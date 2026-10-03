import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { MapPin } from "lucide-react";
import { experiences } from "../../data";

// wodniack.dev "Work" section, in our palette. One long pinned scene driven by scroll progress `p`:
//   0.00–0.12  a cream grid with an onyx band holding EXPERIENCE; the band expands to fill the screen
//              while the word multiplies above and below into a swaying wall (one column per letter)
//   0.10–0.88  one card per company flies out of the depth, lingers, then rushes past the viewer
//   0.88–1.00  the wall collapses back into the band

const WORD = [..."EXPERIENCE"];
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
// how "open" the scene is: 0 = band, 1 = full screen wall
const openness = (v: number) => ease(clamp01((v - 0.02) / 0.1)) * (1 - ease(clamp01((v - 0.88) / 0.1)));

const Letter = ({ ch, r, c, mid, p }: { ch: string; r: number; c: number; mid: number; p: MotionValue<number> }) => {
  const d = Math.abs(r - mid);
  // outer rows arrive a little later than the inner ones (and leave earlier)
  const opacity = useTransform(p, (v) => (d === 0 ? 1 : clamp01(openness(v) * (mid + 1) - d + 1)));
  const rotate = useTransform(p, (v) => 6 * Math.sin(v * 30 + c * 0.8 + r * 0.7) * openness(v));
  const y = useTransform(p, (v) => `${1 * Math.sin(v * 22 + c * 0.6 + r) * openness(v)}svh`);
  return (
    <motion.span className="flex-1 grid place-items-center" style={{ opacity, rotate, y }}>
      {ch}
    </motion.span>
  );
};

const pad = (n: number) => String(n).padStart(2, "0");

// One card per company: who/when on the left, its highlights on the right. One card in flight at a time.
const Card = ({ i, p, mobile }: { i: number; p: MotionValue<number>; mobile: boolean }) => {
  const e = experiences[i];
  const n = experiences.length;
  const gap = 0.78 / (n + 0.2); // last card is past the viewer by ~0.88, when the wall starts closing
  const start = 0.1 + i * gap;
  const span = gap * 1.2; // slight overlap: the next card appears in the distance as this one rushes past
  const t = (v: number) => (v - start) / span; // 0 = far away, 1 = past the viewer
  const side = i % 2 ? 1 : -1;
  // glide in from the depth, linger near the viewer, then rush past the camera
  // (z beyond the 1200px perspective = behind the viewer)
  const z = useTransform(p, (v) => {
    const k = clamp01(t(v));
    // phones stack the card's two halves, so it lingers a little further back to fit the screen
    const [near, far] = mobile ? [-380, -80] : [-200, 200];
    if (k < 0.35) return -2000 + ((near + 2000) * k) / 0.35; // approach
    if (k < 0.9) return near + ((k - 0.35) / 0.55) * (far - near); // slow drift while it's read
    return far + ((k - 0.9) / 0.1) * (1350 - far); // rush past
  });
  const x = useTransform(p, (v) => `${side * (mobile ? 0 : 2 + clamp01(t(v)) * 4)}vw`);
  const y = useTransform(p, (v) => `${2 - clamp01(t(v)) * 4}svh`);
  const opacity = useTransform(p, (v) => {
    const k = t(v);
    return k <= 0 || k >= 1 ? 0 : Math.min(1, k / 0.12);
  });

  return (
    <motion.article
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(900px,92vw)]"
      style={{ z, x, y, opacity }}
    >
      <div className="bg-cream text-ink grid md:grid-cols-[1fr_1.15fr] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        {/* who / when */}
        <div className="bg-ink text-cream border border-accent/40 p-[clamp(20px,2.6vw,40px)] flex flex-col">
          <div className="flex justify-between gap-4 text-[11px] uppercase tracking-[0.12em] text-cream/55">
            <span>{e.period}</span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={11} /> {e.location}
            </span>
          </div>
          <h3 className="display text-[clamp(52px,5.6vw,100px)] mt-[clamp(24px,5vw,90px)] text-accent">{e.company}</h3>
          <p className="mt-3 text-[clamp(14px,1.2vw,18px)]">{e.role}</p>
        </div>
        {/* highlights */}
        <ol className="p-[clamp(20px,2.6vw,40px)] grid content-center gap-[clamp(12px,1.4vw,20px)]">
          {e.points.map((pt, k) => (
            <li key={pt.t} className="grid grid-cols-[28px_1fr] gap-2 border-t border-line pt-[clamp(10px,1.2vw,16px)] first:border-t-0 first:pt-0">
              <span className="text-[11px] tabular-nums text-accent pt-1">{pad(k + 1)}</span>
              <span>
                <span className="block font-display font-semibold text-[clamp(16px,1.4vw,21px)] leading-tight">{pt.t}</span>
                <span className="block mt-1 text-[clamp(13px,1vw,15px)] leading-[1.5] text-ink/70">{pt.d}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-2 flex justify-between text-[10.5px] uppercase tracking-[0.16em] text-accent">
        <span>{e.company}</span>
        <span>
          {pad(i + 1)} / {pad(n)}
        </span>
      </div>
    </motion.article>
  );
};

// Reduced motion: no scroll scene, just the cards in a column
const StaticList = () => (
  <section id="experience" className="bg-ink text-cream px-page py-[12vh]">
    <h2 className="display text-[clamp(64px,12vw,200px)] text-accent mb-10">Experience</h2>
    <div className="grid gap-6 md:grid-cols-3">
      {experiences.map((e) => (
        <article key={e.company} className="bg-cream text-ink p-6">
          <p className="text-[11px] uppercase tracking-[0.12em] text-muted">{e.period}</p>
          <h3 className="display text-5xl mt-4">{e.company}</h3>
          <p className="mt-2 text-sm text-accent">{e.role}</p>
          <ul className="mt-4 grid gap-2 text-[13px] text-ink/75">
            {e.points.map((pt) => (
              <li key={pt.t}>
                <b className="text-ink">{pt.t}.</b> {pt.d}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  </section>
);

export const Experience = () => {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // pill -> full screen, as a clip-path on the onyx layer
  const clip = useTransform(p, (v) => {
    const k = 1 - openness(v);
    // a full-width rectangular band around the middle row (row height = --row)
    // the band pads the word by 4svh above/below and ~5vw at the sides
    const tb = `calc(${50 * k}% - ${k} * (0.5 * var(--row) + 4svh))`;
    return `inset(${tb} ${k * 2}vw ${tb} ${k * 2}vw)`;
  });
  const ring = useTransform(p, (v) => 1 - openness(v));

  if (reduce) return <StaticList />;

  // ponytail: row count is read once at mount; a resize across 768px keeps the old layout until reload
  const mobile = typeof window !== "undefined" && window.innerWidth < 768;
  const rows = mobile ? 9 : 7;
  const mid = (rows - 1) / 2;

  return (
    <section id="experience" ref={ref} className="relative h-[1000svh] bg-cream" aria-label="Experience">
      <div className="sticky top-0 h-svh overflow-hidden [--row:11svh] md:[--row:14svh]">
        {/* cream grid behind the band */}
        <div className="absolute inset-0 grid-fx [background-size:7.5vw_7.5vw]" />
        {/* thin outline around the band, fading as it opens */}
        <motion.div
          aria-hidden
          className="absolute left-[1vw] right-[1vw] top-1/2 h-[calc(var(--row)+8svh+2vw)] -translate-y-1/2 border border-ink/40"
          style={{ opacity: ring }}
        />

        {/* the onyx layer: a band, then full screen */}
        <motion.div className="absolute inset-0 bg-ink" style={{ clipPath: clip }}>
          <div
            className="absolute inset-0 opacity-40"
            style={{ backgroundImage: "radial-gradient(rgba(194,109,80,0.35) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
          />
          {/* letter wall: the middle row is the band's EXPERIENCE, copies stack above and below */}
          <div
            aria-hidden
            className="absolute inset-0 flex flex-col justify-center px-[7vw]! display text-accent text-[min(calc(var(--row)*0.95),11vw)] leading-none [text-shadow:0.035em_0.035em_0_#6b3424]"
          >
            {Array.from({ length: rows }, (_, r) => (
              <div key={r} className="h-(--row) shrink-0 flex">
                {WORD.map((ch, c) => (
                  <Letter key={c} ch={ch} r={r} c={c} mid={mid} p={p} />
                ))}
              </div>
            ))}
          </div>

          {/* experience cards flying through */}
          <div className="absolute inset-0 [perspective:1200px] [transform-style:preserve-3d]">
            {experiences.map((_, i) => (
              <Card key={i} i={i} p={p} mobile={mobile} />
            ))}
          </div>
        </motion.div>

        <h2 className="sr-only">Experience</h2>
      </div>
    </section>
  );
};
