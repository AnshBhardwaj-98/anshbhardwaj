import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree, type RootState } from "@react-three/fiber";
import { useFluid } from "@funtech-inc/use-shader-fx";

const BASE = "#f5f4f2"; // cream panel
const INK = "#0e0e0e"; // wordmark on the panel
const WHITE = "#ffffff"; // wordmark revealed on top of the video
const FONT = '"Google Sans Flex", "Inter", sans-serif';

const makeLayer = () => {
  const canvas = document.createElement("canvas");
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return { canvas, ctx: canvas.getContext("2d")!, texture };
};

// Two identical wordmark layers (noth.in's base/reveal pair):
//   base   = cream panel + ink wordmark (what you see by default)
//   reveal = transparent + white wordmark (what the fluid opening shows over the video)
// Letters rise from a baseline mask in random order for the first ~1.5s.
function createWordmark(word: string) {
  const base = makeLayer();
  const reveal = makeLayer();
  const letters = [...word].map((ch) => ({ ch, delay: Math.random() * 0.45 }));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let start = performance.now();
  let settled = false;
  let lastSize = "";

  // Restart the intro once the web font has loaded (otherwise it measures a fallback font)
  document.fonts.load(`800 100px ${FONT}`).then(() => {
    start = performance.now();
    settled = false;
  });

  const paint = (
    ctx: CanvasRenderingContext2D,
    bg: string | null,
    ink: string,
    now: number,
    width: number,
    height: number,
  ) => {
    ctx.clearRect(0, 0, width, height);
    if (bg) {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);
    }
    const pad = Math.min(64, Math.max(20, width * 0.032));
    ctx.font = `800 100px ${FONT}`;
    const size = (100 * (width - pad * 2)) / ctx.measureText(word).width;
    ctx.font = `800 ${size}px ${FONT}`;
    const m = ctx.measureText(word);
    const asc = m.actualBoundingBoxAscent,
      desc = m.actualBoundingBoxDescent;
    const baseline = (height + asc - desc) / 2;

    const elapsed = (now - start) / 1000;
    let allDone = true;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, baseline - asc - 4, width, asc + desc + 8);
    ctx.clip();
    ctx.fillStyle = ink;
    letters.forEach((l, i) => {
      const p = reduce ? 1 : Math.min(1, Math.max(0, (elapsed - 0.2 - l.delay) / 0.9));
      if (p < 1) allDone = false;
      const eased = 1 - Math.pow(1 - p, 4);
      ctx.fillText(l.ch, pad + ctx.measureText(word.slice(0, i)).width, baseline + (1 - eased) * (asc + desc + 8));
    });
    ctx.restore();
    return allDone;
  };

  return {
    base: base.texture,
    reveal: reveal.texture,
    draw(now: number, width: number, height: number) {
      const key = `${width}x${height}`;
      if (key !== lastSize) {
        lastSize = key;
        settled = false;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        for (const l of [base, reveal]) {
          l.canvas.width = Math.round(width * dpr);
          l.canvas.height = Math.round(height * dpr);
          l.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
      }
      if (settled) return; // nothing changes once the intro is over

      settled = paint(base.ctx, BASE, INK, now, width, height);
      paint(reveal.ctx, null, WHITE, now, width, height);
      base.texture.needsUpdate = true;
      reveal.texture.needsUpdate = true;
    },
  };
}

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy * 2.0, 0.0, 1.0); }
`;

// Where the fluid is moving faster than uThreshold the panel opens: the base layer is swapped for
// the reveal layer (white wordmark on transparent), so the video shows through with the name on it.
// The cut is a hard threshold, anti-aliased over ~1px with fwidth, so the edge is sharp but not jagged.
const fragmentShader = /* glsl */ `
  uniform sampler2D uBase;
  uniform sampler2D uReveal;
  uniform sampler2D uFluid;
  uniform float uThreshold;
  uniform float uGoo;
  varying vec2 vUv;
  void main() {
    vec4 base = texture2D(uBase, vUv);
    vec4 rev = texture2D(uReveal, vUv);
    // "Gooey" blur of the speed field before the hard cut (blur + threshold = metaballs):
    // pieces that get close merge into one body instead of tearing into separate islands.
    // Two rings of 8 taps around the centre, ~uGoo sim texels wide.
    vec2 px = uGoo / vec2(textureSize(uFluid, 0));
    float speed = texture2D(uFluid, vUv).r * 0.2;
    for (int i = 0; i < 8; i++) {
      float a = float(i) * 0.785398; // 45deg steps
      vec2 dir = vec2(cos(a), sin(a));
      speed += texture2D(uFluid, vUv + dir * px * 0.5).r * 0.06;
      speed += texture2D(uFluid, vUv + dir * px).r * 0.04;
    }
    float aa = fwidth(speed);
    float open = smoothstep(uThreshold - aa, uThreshold + aa, speed);
    // premultiplied output: opaque cream panel -> white text over transparent
    gl_FragColor = mix(vec4(base.rgb, 1.0), vec4(rev.rgb * rev.a, rev.a), open);
    #include <colorspace_fragment>
  }
`;

const Scene = ({ word, getPointer }: { word: string; getPointer: (now: number) => THREE.Vector2 }) => {
  const { size } = useThree();
  const [wordmark] = useState(() => createWordmark(word));
  const fluid = useFluid({
    size,
    // Half-res sim: enough detail that the hard-edged contour stays smooth and liquid
    dpr: 0.5,
    dissipation: 0.994, // closer to 1 = the swirl lingers longer
    forceBias: 22, // enough stir for swirly, stretched openings without turning chaotic
  });

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uBase: { value: wordmark.base },
          uReveal: { value: wordmark.reveal },
          uFluid: { value: fluid.texture },
          uThreshold: { value: 0.24 },
          uGoo: { value: 8.0 }, // merge radius in sim texels; higher = blob sticks together more
        },
        transparent: true,
        blending: THREE.NoBlending,
        depthTest: false,
        depthWrite: false,
      }),
    [wordmark.base, wordmark.reveal, fluid.texture],
  );

  useFrame((state: RootState) => {
    const now = performance.now();
    wordmark.draw(now, state.size.width, state.size.height);
    // Feed the sim our own pointer (real cursor, or a slow wander when idle / on touch)
    fluid.render({ ...state, pointer: getPointer(now) });
  });

  return (
    <mesh frustumCulled={false} material={material}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
};

// noth.in-style hero layer: cream wordmark panel that the cursor dissolves with a real fluid sim.
export default function FluidReveal({
  word,
  active,
  onContextLost,
}: {
  word: string;
  active: boolean;
  onContextLost: () => void;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const pointer = useRef(new THREE.Vector2(0, 0));
  const lastMove = useRef(-Infinity);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const r = wrap.current?.getBoundingClientRect();
      if (!r || e.clientY < r.top || e.clientY > r.bottom) return;
      pointer.current.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
      lastMove.current = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const wander = useMemo(() => new THREE.Vector2(), []);
  const reduce = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  // The sim reacts to pointer velocity, so raw (bursty) mouse events make it jerky.
  // Ease a follower toward the target instead (frame-rate independent).
  const smooth = useRef(new THREE.Vector2(0, 0));
  const lastFrame = useRef(0);
  const getPointer = (now: number) => {
    const idle = !reduce && now - lastMove.current >= 2500;
    const s = now / 1000;
    const target = idle ? wander.set(0.6 * Math.sin(s * 0.5), 0.4 * Math.sin(s * 0.8)) : pointer.current;
    const dt = lastFrame.current ? Math.min(now - lastFrame.current, 50) : 16;
    lastFrame.current = now;
    // Cap the follower's speed: a fast swing gives a strong but bounded push instead of a spike
    // that tears the fluid apart (units: normalized screen per ms).
    const MAX_STEP = 0.003 * dt;
    const before = smooth.current.clone();
    smooth.current.lerp(target, 1 - Math.pow(1 - 0.2, dt / 16.67));
    const step = smooth.current.clone().sub(before);
    if (step.length() > MAX_STEP) smooth.current.copy(before.add(step.setLength(MAX_STEP)));
    return smooth.current;
  };

  return (
    <div ref={wrap} className="absolute inset-0 pointer-events-none" aria-hidden>
      <Canvas
        flat
        dpr={[1, 2]}
        frameloop={active ? "always" : "never"}
        gl={{ alpha: true, antialias: false, premultipliedAlpha: true }}
        // A lost GPU context leaves a transparent canvas (just the dark video); let the hero fall back
        onCreated={({ gl }) => gl.domElement.addEventListener("webglcontextlost", onContextLost, { once: true })}
      >
        <Scene word={word} getPointer={getPointer} />
      </Canvas>
    </div>
  );
}
