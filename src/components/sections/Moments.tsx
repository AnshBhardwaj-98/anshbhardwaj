import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useScroll, useTransform, type MotionValue } from "framer-motion";
import { moments, type MomentBar } from "../../data";

const ease = [0.22, 1, 0.36, 1] as const;
const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Football yard-line ticks under the heading, as on jjettas.com
const YARDS = [10, 20, 30, 40, 50, 40, 30, 20, 10];

// Counts every number inside `text` up from zero once `run` turns true ("7.1s → 0.12s" keeps its decimals)
const CountUp = ({ text, run }: { text: string; run: boolean }) => {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!run) return;
    const controls = animate(0, 1, { duration: reduceMotion() ? 0 : 1.6, ease, onUpdate: setT });
    return () => controls.stop();
  }, [run]);

  return (
    <>
      {text.split(/(\d+(?:\.\d+)?)/).map((part, i) => {
        if (i % 2 === 0) return part;
        const decimals = part.split(".")[1]?.length ?? 0;
        return (
          <span key={i} className="tabular-nums">
            {(Number(part) * t).toFixed(decimals)}
          </span>
        );
      })}
    </>
  );
};

const Bars = ({ bars, run }: { bars: MomentBar[]; run: boolean }) => {
  const max = Math.max(...bars.map((b) => b.value));
  return (
    <div className="flex flex-col gap-5 w-full">
      {bars.map((b, i) => (
        <div key={b.label}>
          <div className="flex justify-between text-xs uppercase tracking-[0.1em] mb-2">
            <span className="text-cream/55">{b.label}</span>
            <span className="tabular-nums">{b.display}</span>
          </div>
          <div className="h-1.5 bg-white/10 overflow-hidden">
            <motion.div
              className={`h-full ${i === bars.length - 1 ? "bg-accent" : "bg-cream/70"}`}
              initial={{ width: "0%" }}
              animate={{ width: run ? `${Math.max(1.5, (b.value / max) * 100)}%` : "0%" }}
              transition={{ duration: 1.3, delay: 0.25 + i * 0.12, ease }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// A card in the sticky stack. As later cards slide over it, it shrinks back and dims.
const Card = ({
  m,
  i,
  n,
  progress,
}: {
  m: (typeof moments)[number];
  i: number;
  n: number;
  progress: MotionValue<number>;
}) => {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { once: true, margin: "-25%" });
  const depth = n - 1 - i; // how many cards will end up on top of this one
  const scale = useTransform(progress, [i / n, 1], [1, 1 - depth * 0.05]);
  const dim = useTransform(progress, [i / n, 1], [0, depth * 0.14]);

  return (
    <motion.article
      ref={ref}
      className="sticky mb-[10vh] last:mb-0 origin-top bg-ink text-cream border border-white/10 overflow-hidden"
      style={{ top: `calc(84px + ${i * 24}px)`, scale }}
    >
      {/* texture: terracotta glow, grain, and a giant outlined index number */}
      <motion.div
        className="absolute -top-1/3 -right-1/4 w-[70%] aspect-square rounded-full bg-accent/25 blur-[90px] pointer-events-none"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={seen ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.6, ease }}
      />
      <div className="absolute inset-0 grain opacity-[0.1] mix-blend-overlay pointer-events-none" />
      <span
        aria-hidden
        className="display absolute -right-[0.04em] -bottom-[0.12em] text-[clamp(160px,24vw,380px)] text-transparent [-webkit-text-stroke:1px_rgba(250,249,246,0.12)] select-none pointer-events-none"
      >
        {String(i + 1).padStart(2, "0")}
      </span>

      <div className="relative grid grid-cols-1 md:grid-cols-[1.35fr_1fr] gap-10 md:gap-16 items-end p-8 md:p-12 min-h-[52vh]">
        <div>
          <motion.span
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-accent"
            initial={{ opacity: 0, x: -16 }}
            animate={seen ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease }}
          >
            <span className="w-6 h-px bg-accent" />
            {String(i + 1).padStart(2, "0")} · {m.tag}
          </motion.span>
          <h3 className="display text-[clamp(48px,7vw,120px)] mt-5 overflow-hidden pb-[0.04em]">
            <motion.span
              className="inline-block"
              initial={{ y: "105%" }}
              animate={seen ? { y: 0 } : {}}
              transition={{ duration: 0.9, ease }}
            >
              <CountUp text={m.title} run={seen} />
            </motion.span>
          </h3>
          <motion.p
            className="mt-5 text-sm uppercase tracking-[0.12em] text-cream/70 max-w-[420px]"
            initial={{ opacity: 0, y: 12 }}
            animate={seen ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease }}
          >
            {m.stat}
          </motion.p>
        </div>
        <Bars bars={m.bars} run={seen} />
      </div>

      {/* depth: darken as the stack grows over this card */}
      <motion.div className="absolute inset-0 bg-ink pointer-events-none" style={{ opacity: dim }} />
    </motion.article>
  );
};

export const Moments = () => {
  // Heading words slide in from opposite edges as the section scrolls up
  const headRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress: headIn } = useScroll({ target: headRef, offset: ["start end", "center center"] });
  const leftX = useTransform(headIn, [0, 1], ["-35vw", "0vw"]);
  const rightX = useTransform(headIn, [0, 1], ["35vw", "0vw"]);

  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: stack } = useScroll({ target: listRef, offset: ["start start", "end end"] });

  return (
    <section id="moments" className="relative bg-paper text-ink pt-[14vh] pb-[16vh] px-page overflow-x-clip">
      <h2 ref={headRef} className="display text-center md:whitespace-nowrap text-[clamp(40px,10.6vw,220px)]">
        <motion.span className="inline-block" style={{ x: leftX }}>
          Signature
        </motion.span>{" "}
        <motion.span className="inline-block text-accent" style={{ x: rightX }}>
          Moments
        </motion.span>
      </h2>

      <div className="relative mt-6 mb-[10vh] pt-2" aria-hidden>
        <motion.div
          className="absolute top-0 inset-x-0 h-px bg-ink/25 origin-left"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease }}
        />
        <div className="flex justify-between">
          {YARDS.map((y, i) => (
            <motion.span
              key={i}
              className="display text-[clamp(14px,1.6vw,26px)] text-ink/35 relative"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.06, ease }}
            >
              <span className="absolute left-1/2 -top-2 w-px h-3 bg-ink/30" />
              {y}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Sticky card stack: each card pins a little lower than the last */}
      <div ref={listRef} className="max-w-[1100px] mx-auto">
        {moments.map((m, i) => (
          <Card key={m.title} m={m} i={i} n={moments.length} progress={stack} />
        ))}
      </div>
    </section>
  );
};
