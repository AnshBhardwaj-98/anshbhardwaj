import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { MapPin } from "lucide-react";
import { experiences } from "../../data";

// wodniack.dev "Work" section, in our palette. One long pinned scene driven by scroll progress `p`:
//   0.00–0.12  a cream grid with an onyx band holding EXPERIENCE; the band expands to fill the screen
//              while the word multiplies above and below into a swaying wall (one column per letter)
//   0.10–0.88  the experience cards (an intro + one per highlight, per job) fly out of the depth, past the viewer
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

// Each job becomes an intro card (company, role, dates) followed by one card per highlight,
// so the flight is a longer sequence of shorter reads.
type Slide =
  | { kind: "intro"; job: number; e: (typeof experiences)[number] }
  | { kind: "point"; job: number; e: (typeof experiences)[number]; t: string; d: string; n: number; of: number };
const slides: Slide[] = experiences.flatMap((e, job) => [
  { kind: "intro" as const, job, e },
  ...e.points.map((pt, k) => ({ kind: "point" as const, job, e, t: pt.t, d: pt.d, n: k + 1, of: e.points.length })),
]);
const pad = (n: number) => String(n).padStart(2, "0");

const Card = ({ i, p, mobile }: { i: number; p: MotionValue<number>; mobile: boolean }) => {
  const s = slides[i];
  const n = slides.length;
  const gap = 0.78 / (n + 1.4); // last card is past the viewer by ~0.88, when the wall starts closing
  const start = 0.1 + i * gap;
  const span = gap * 2.4; // roughly two cards in flight at once
  const t = (v: number) => (v - start) / span; // 0 = far away, 1 = past the viewer
  const side = i % 2 ? 1 : -1;
  // glide in from the depth, then rush past the camera (z beyond the 1200px perspective = behind the viewer)
  const z = useTransform(p, (v) => {
    const k = clamp01(t(v));
    return k < 0.94 ? -2000 + (2250 * k) / 0.94 : 250 + ((k - 0.94) / 0.06) * 1100;
  });
  const x = useTransform(p, (v) => `${side * (mobile ? 1 + clamp01(t(v)) * 3 : 6 + clamp01(t(v)) * 10)}vw`);
  const y = useTransform(p, (v) => `${(i % 3 === 1 ? -6 : 4) + clamp01(t(v)) * -4}svh`);
  const opacity = useTransform(p, (v) => {
    const k = t(v);
    return k <= 0 || k >= 1 ? 0 : Math.min(1, k / 0.15);
  });

  return (
    <motion.article
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(680px,90vw)]"
      style={{ z, x, y, opacity }}
    >
      {s.kind === "intro" ? (
        <div className="bg-ink text-cream border border-accent/40 p-[clamp(20px,2.6vw,40px)] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
          <div className="flex justify-between gap-4 text-[11px] uppercase tracking-[0.12em] text-cream/55">
            <span>{s.e.period}</span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={11} /> {s.e.location}
            </span>
          </div>
          <h3 className="display text-[clamp(56px,6.6vw,116px)] mt-[clamp(28px,4vw,64px)] text-accent">{s.e.company}</h3>
          <p className="mt-3 text-[clamp(15px,1.3vw,20px)]">{s.e.role}</p>
        </div>
      ) : (
        <div className="bg-cream text-ink p-[clamp(20px,2.6vw,40px)] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
          <div className="flex justify-between gap-4 text-[11px] uppercase tracking-[0.12em] text-muted">
            <span className="text-accent">{s.e.company}</span>
            <span>
              {pad(s.n)} / {pad(s.of)}
            </span>
          </div>
          <h3 className="display text-[clamp(44px,5vw,84px)] mt-[clamp(24px,3vw,48px)]">{s.t}</h3>
          <p className="mt-4 pt-4 border-t border-line text-[clamp(15px,1.3vw,20px)] leading-[1.5] text-ink/75">{s.d}</p>
        </div>
      )}
      <div className="mt-2 flex justify-between text-[10.5px] uppercase tracking-[0.16em] text-accent">
        <span>{s.kind === "intro" ? s.e.role : s.e.company}</span>
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
    <section id="experience" ref={ref} className="relative h-[1300svh] bg-cream" aria-label="Experience">
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
            {slides.map((_, i) => (
              <Card key={i} i={i} p={p} mobile={mobile} />
            ))}
          </div>
        </motion.div>

        <h2 className="sr-only">Experience</h2>
      </div>
    </section>
  );
};
