import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree, type RootState } from "@react-three/fiber";
import { useFluid } from "@funtech-inc/use-shader-fx";

const BASE = "#faf9f6"; // cream panel
const INK_COLOR = "#0f0f0f"; // wordmark on the panel
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

      settled = paint(base.ctx, BASE, INK_COLOR, now, width, height);
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

// --- Ink (dye) layer, as on noth.in -------------------------------------------------------------
// The cursor paints ink; the fluid's velocity carries it; it fades slowly. The reveal is cut on the ink,
// so the shape behaves like a substance: it holds together, lingers after you stop, keeps crisp detail.

const INK = {
  scale: 0.5, // ink buffer resolution relative to the canvas (noth.in uses ~512px)
  dissipation: 0.988, // noth.in's dyeDissipation, per 60fps frame: how slowly the ink fades
  amount: 0.5, // ink painted per frame while the cursor moves
  radius: 0.0016, // brush size (uv^2, aspect-corrected)
  threshold: 0.128, // noth.in: smoothstep(0.5, 0.51, dye * 3.9) -> cut at ~0.128
};

const inkShader = /* glsl */ `
  uniform sampler2D uInk;
  uniform sampler2D uVelocity;
  uniform vec2 uMaxAspect;
  uniform vec2 uPoint;
  uniform vec2 uPrev;
  uniform float uAspect;
  uniform float uAmount;
  uniform float uRadius;
  uniform float uDissipation;
  varying vec2 vUv;
  void main() {
    // Advect exactly like use-shader-fx moves its own velocity (deltaTime 0.008)
    vec2 vel = texture2D(uVelocity, vUv).xy;
    float ink = texture2D(uInk, vUv - vel * 0.008 * uMaxAspect).r * uDissipation;
    // Paint along the segment prev -> current (a capsule, not a dot) so fast swings stay one stroke
    vec2 p = vUv - uPrev, ab = uPoint - uPrev;
    p.x *= uAspect; ab.x *= uAspect;
    float h = clamp(dot(p, ab) / max(dot(ab, ab), 1e-8), 0.0, 1.0);
    vec2 d = p - ab * h;
    // max, not +: repeated passes over the same spot top the ink up instead of piling it on,
    // so the stroke keeps a constant width however fast or often you swing through it
    ink = max(ink, uAmount * exp(-dot(d, d) / uRadius));
    gl_FragColor = vec4(clamp(ink, 0.0, 2.0), 0.0, 0.0, 1.0);
  }
`;

// Cut the panel open where there's ink: base layer (cream + ink wordmark) is swapped for the reveal layer
// (white wordmark on transparent), so the video shows through with the name on it.
// Hard threshold, anti-aliased over ~1px with fwidth: sharp but not jagged.
const maskShader = /* glsl */ `
  uniform sampler2D uBase;
  uniform sampler2D uReveal;
  uniform sampler2D uInk;
  uniform float uThreshold;
  varying vec2 vUv;
  void main() {
    vec4 base = texture2D(uBase, vUv);
    vec4 rev = texture2D(uReveal, vUv);
    float ink = texture2D(uInk, vUv).r;
    float aa = fwidth(ink);
    float open = smoothstep(uThreshold - aa, uThreshold + aa, ink);
    // premultiplied output: opaque cream panel -> white text over transparent
    gl_FragColor = mix(vec4(base.rgb, 1.0), vec4(rev.rgb * rev.a, rev.a), open);
    #include <colorspace_fragment>
  }
`;

// Ping-pong ink buffers + the final mask material, kept outside React (plain mutable GPU state).
function createInk(base: THREE.Texture, reveal: THREE.Texture) {
  const rtOpts = {
    type: THREE.HalfFloatType,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    depthBuffer: false,
  };
  let read = new THREE.WebGLRenderTarget(1, 1, rtOpts);
  let write = new THREE.WebGLRenderTarget(1, 1, rtOpts);
  let needsClear = true;

  const inkMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader: inkShader,
    uniforms: {
      uInk: { value: read.texture },
      uVelocity: { value: null },
      uMaxAspect: { value: new THREE.Vector2(1, 1) },
      uPoint: { value: new THREE.Vector2(0.5, 0.5) },
      uPrev: { value: new THREE.Vector2(0.5, 0.5) },
      uAspect: { value: 1 },
      uAmount: { value: 0 },
      uRadius: { value: INK.radius },
      uDissipation: { value: INK.dissipation },
    },
    depthTest: false,
    depthWrite: false,
  });
  const scene = new THREE.Scene();
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), inkMaterial);
  quad.frustumCulled = false;
  scene.add(quad);
  const camera = new THREE.Camera();

  const maskMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader: maskShader,
    uniforms: {
      uBase: { value: base },
      uReveal: { value: reveal },
      uInk: { value: read.texture },
      uThreshold: { value: INK.threshold },
    },
    transparent: true,
    blending: THREE.NoBlending,
    depthTest: false,
    depthWrite: false,
  });

  let hasPrev = false;
  const u = inkMaterial.uniforms;

  return {
    maskMaterial,
    step(
      gl: THREE.WebGLRenderer,
      velocity: THREE.Texture,
      pointerNdc: THREE.Vector2,
      width: number,
      height: number,
      dt: number,
    ) {
      const w = Math.max(1, Math.round(width * INK.scale));
      const h = Math.max(1, Math.round(height * INK.scale));
      if (read.width !== w || read.height !== h) {
        read.setSize(w, h);
        write.setSize(w, h);
        needsClear = true;
      }
      if (needsClear) {
        // Fresh GPU buffers can hold garbage (even NaN) on some drivers; start from no ink
        for (const rt of [read, write]) {
          gl.setRenderTarget(rt);
          gl.clear();
        }
        needsClear = false;
      }

      const x = (pointerNdc.x + 1) / 2;
      const y = (pointerNdc.y + 1) / 2;
      if (!hasPrev) u.uPrev.value.set(x, y);
      hasPrev = true;
      const moved = Math.hypot(x - u.uPrev.value.x, y - u.uPrev.value.y);
      u.uPoint.value.set(x, y);
      // Only paint while moving; ramp in over a tiny distance so a twitch doesn't punch a full hole
      u.uAmount.value = INK.amount * Math.min(1, moved / 0.0008);
      // Fade per unit of time, not per frame, so ink lasts the same on 60Hz and 144Hz screens
      u.uDissipation.value = Math.pow(INK.dissipation, dt / 16.67);
      const m = Math.max(width, height);
      u.uMaxAspect.value.set(m / width, m / height);
      u.uAspect.value = width / height;
      u.uVelocity.value = velocity;
      u.uInk.value = read.texture;

      gl.setRenderTarget(write);
      gl.render(scene, camera);
      gl.setRenderTarget(null);
      [read, write] = [write, read];
      u.uPrev.value.set(x, y);
      maskMaterial.uniforms.uInk.value = read.texture;
    },
  };
}

const Scene = ({
  word,
  getPointer,
  onReady,
}: {
  word: string;
  getPointer: (now: number) => THREE.Vector2;
  onReady: () => void;
}) => {
  const frames = useRef(0);
  const { size } = useThree();
  const [wordmark] = useState(() => createWordmark(word));
  const [ink] = useState(() => createInk(wordmark.base, wordmark.reveal));
  const fluid = useFluid({
    size,
    dpr: 0.5,
    // noth.in lets the motion die quickly (0.962) while the ink lingers; the swirl only shapes the ink
    dissipation: 0.962,
    forceBias: 18,
  });

  useFrame((state: RootState, delta: number) => {
    const now = performance.now();
    wordmark.draw(now, state.size.width, state.size.height);
    // Feed the sim our own pointer (real cursor, or a slow wander when idle / on touch)
    const pointer = getPointer(now);
    fluid.render({ ...state, pointer });
    ink.step(state.gl, fluid.velocity, pointer, state.size.width, state.size.height, Math.min(delta * 1000, 50));
    // A frame has definitely reached the screen by the 2nd tick: tell the hero it can drop its static cover
    if (++frames.current === 2) onReady();
  });

  return (
    <mesh frustumCulled={false} material={ink.maskMaterial}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
};

// noth.in-style hero layer: cream wordmark panel that the cursor dissolves with a real fluid sim.
export default function FluidReveal({
  word,
  active,
  onContextLost,
  onReady,
}: {
  word: string;
  active: boolean;
  onContextLost: () => void;
  onReady: () => void;
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
  // Light easing so bursty mouse events don't give the sim jerky pushes (frame-rate independent)
  const smooth = useRef(new THREE.Vector2(0, 0));
  const lastFrame = useRef(0);
  const getPointer = (now: number) => {
    const idle = !reduce && now - lastMove.current >= 2500;
    const s = now / 1000;
    const target = idle ? wander.set(0.6 * Math.sin(s * 0.5), 0.4 * Math.sin(s * 0.8)) : pointer.current;
    const dt = lastFrame.current ? Math.min(now - lastFrame.current, 50) : 16;
    lastFrame.current = now;
    return smooth.current.lerp(target, 1 - Math.pow(1 - 0.35, dt / 16.67));
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
        <Scene word={word} getPointer={getPointer} onReady={onReady} />
      </Canvas>
    </div>
  );
}
