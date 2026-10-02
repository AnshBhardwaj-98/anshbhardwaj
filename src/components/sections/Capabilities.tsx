import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { IconType } from "react-icons";
import {
  SiDocker,
  SiFastapi,
  SiGooglegemini,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiPytorch,
  SiReact,
} from "react-icons/si";
import { capabilities, type Capability } from "../../data";

// fiddle.digital "Harmony in the making": a tall onyx section with a checkerboard of square tiles that
// scroll past normally, each growing out of a bottom corner as it enters and shrinking into a top corner
// as it leaves. Years sit pinned in the viewport corners with a caption in the middle.

const pad = (n: number) => String(n).padStart(2, "0");
const gutter = "clamp(20px,3.2vw,64px)"; // same as px-page

type Logo = { Icon: IconType; name: string; tone: string };
type Tile = { cap: Capability; i: number } | Logo;

const logos: Logo[] = [
  { Icon: SiPython, name: "Python", tone: "bg-accent text-ink" },
  { Icon: SiFastapi, name: "FastAPI", tone: "bg-[#1c1b1a] text-cream" },
  { Icon: SiReact, name: "React", tone: "bg-[#1c1b1a] text-accent" },
  { Icon: SiPostgresql, name: "PostgreSQL", tone: "bg-accent text-ink" },
  { Icon: SiGooglegemini, name: "Gemini", tone: "bg-[#1c1b1a] text-cream" },
  { Icon: SiNodedotjs, name: "Node.js", tone: "bg-[#2a2826] text-cream" },
  { Icon: SiDocker, name: "Docker", tone: "bg-accent text-ink" },
  { Icon: SiPytorch, name: "PyTorch", tone: "bg-[#1c1b1a] text-accent" },
];

// capability, logo, logo, capability, ... laid into the checkerboard slots row by row
const tiles: Tile[] = capabilities.flatMap((cap, i) => [{ cap, i }, ...logos.slice(i * 2, i * 2 + 2)]);

// Desktop: 4 columns, two tiles per row on alternating squares.
// Mobile: 2 columns, one tile per row; capability cards full width, logos zig-zag left/right.
let zig = 0;
const placed = tiles.map((t, k) => {
  const dRow = Math.floor(k / 2) + 1;
  const dCol = (k % 2) * 2 + (dRow % 2 ? 1 : 2);
  const isCap = "cap" in t;
  return { t, k, dRow, dCol, mRow: k + 1, mCol: isCap ? 1 : (zig++ % 2) + 1, isCap };
});

const ScaleTile = ({
  k,
  className,
  style,
  children,
}: {
  k: number;
  className: string;
  style: React.CSSProperties;
  children: ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: grow } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const { scrollYProgress: exit } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const shrink = useTransform(exit, [0, 1], [1, 0]);
  // ponytail: fiddle picks the corners at random; a fixed pattern by index reads the same and stays stable
  const inSide = k % 2 ? "right" : "left";
  const outSide = k % 3 ? "left" : "right";

  return (
    <div ref={ref} className={className} style={style}>
      <motion.div className="h-full" style={{ scale: reduce ? 1 : grow, transformOrigin: `${inSide} bottom` }}>
        <motion.div className="h-full" style={{ scale: reduce ? 1 : shrink, transformOrigin: `${outSide} top` }}>
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
};

const CapCard = ({ cap, i }: { cap: Capability; i: number }) => (
  <div className="relative h-full bg-cream text-ink p-[clamp(18px,1.8vw,28px)] flex flex-col overflow-hidden">
    <div className="flex justify-between text-[11px] uppercase tracking-[0.14em]">
      <span className="text-accent">{pad(i + 1)}</span>
      <span className="text-muted">Capability</span>
    </div>
    <h3 className="display text-[clamp(40px,3.3vw,58px)] mt-auto">{cap.title}</h3>
    <p className="mt-4 text-[13px] leading-[1.55] text-muted">{cap.desc}</p>
    <p className="mt-4 pt-3 border-t border-line text-[10.5px] uppercase tracking-[0.12em] text-ink/70">
      {cap.stack.slice(0, 4).join("  /  ")}
    </p>
  </div>
);

const LogoTile = ({ Icon, name, tone }: Logo) => (
  <div className={`relative h-full grid place-items-center overflow-hidden ${tone}`}>
    <div className="absolute inset-0 grain opacity-[0.14] mix-blend-overlay pointer-events-none" />
    <Icon className="w-[38%] h-[38%]" />
    <span className="absolute left-4 bottom-3.5 text-[11px] uppercase tracking-[0.14em] opacity-70">{name}</span>
  </div>
);

const year = "display absolute text-[clamp(56px,8vw,128px)]";

export const Capabilities = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // function form: keeps framer from handing this to a native scroll timeline, which mis-measures this section
  const endOpacity = useTransform(scrollYProgress, (v) => Math.min(1, Math.max(0, (v - 0.85) / 0.15)));

  return (
    <section id="capabilities" ref={ref} className="relative bg-ink text-cream" aria-label="What I build">
      {/* pinned overlay: 20 · 22 up top, —20 · 26 fading in at the end, caption in the middle */}
      <div className="sticky top-0 h-svh z-10 pointer-events-none mix-blend-difference" aria-hidden>
        <span className={`${year} top-20 text-cream/30`} style={{ left: gutter }}>
          20
        </span>
        <span className={`${year} top-20 text-cream/30`} style={{ right: gutter }}>
          22
        </span>
        <motion.span className={`${year} bottom-6 text-cream`} style={{ left: gutter, opacity: endOpacity }}>
          —20
        </motion.span>
        <motion.span className={`${year} bottom-6 text-cream`} style={{ right: gutter, opacity: endOpacity }}>
          26
        </motion.span>
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[11px] uppercase tracking-[0.24em] text-cream">
          ( What I build )
        </span>
      </div>

      {/* the checkerboard, scrolling underneath the overlay */}
      <div className="-mt-[100svh] pt-[60svh] pb-[45svh] px-page">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          {placed.map(({ t, k, dRow, dCol, mRow, mCol, isCap }) => (
            <ScaleTile
              key={k}
              k={k}
              className={`aspect-square row-start-(--mr) col-start-(--mc) md:row-start-(--dr) md:col-start-(--dc) md:col-span-1 ${
                isCap ? "col-span-2" : ""
              }`}
              style={{ "--mr": mRow, "--mc": mCol, "--dr": dRow, "--dc": dCol } as React.CSSProperties}
            >
              {"cap" in t ? <CapCard cap={t.cap} i={t.i} /> : <LogoTile {...t} />}
            </ScaleTile>
          ))}
        </div>
      </div>
    </section>
  );
};
