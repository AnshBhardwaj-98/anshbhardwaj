import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useLenis } from "lenis/react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { navItems, profile } from "../../data";
import { LoopVideo } from "../ui/LoopVideo";

// art-yakushev.com-style ending, in three layers:
//   1. contact list: rows slide up into view; links "roll" on hover
//   2. onyx panel with "GET IN TOUCH" cut out of it, panning sideways with scroll, so the footer
//      behind shows through the moving letters
//   3. the footer, stuck to the bottom of the viewport *behind* the page (z-0 under main's z-10):
//      as the page scrolls off it, the video zooms out, the content rises and the name assembles

const year = new Date().getFullYear();
const NAME = "Divyansh Bhardwaj";
const ease = [0.22, 1, 0.36, 1] as const;

const useDelhiTime = () => {
  const fmt = () =>
    new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" });
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 15_000);
    return () => clearInterval(id);
  }, []);
  return time;
};

// Hover "roll": the label slides up out of its mask while an identical copy rolls in from below
const Roll = ({ children }: { children: React.ReactNode }) => (
  <span className="relative inline-block overflow-hidden align-bottom">
    <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">
      {children}
    </span>
    <span
      aria-hidden
      className="absolute inset-0 block translate-y-full text-accent transition-transform duration-500 ease-out-expo group-hover:translate-y-0"
    >
      {children}
    </span>
  </span>
);

const Arrow = () => (
  <ArrowUpRight className="w-[0.55em] h-[0.55em] shrink-0 text-accent opacity-0 -translate-x-3 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition duration-500 ease-out-expo" />
);

const bigLink =
  "group inline-flex items-center gap-3 font-display font-medium tracking-[-0.02em] leading-[1.2] text-[clamp(22px,3.4vw,56px)]";

const Row = ({ index, label, children }: { index: number; label: string; children: React.ReactNode }) => (
  <motion.div
    className="grid grid-cols-[64px_1fr] md:grid-cols-2 gap-6 md:gap-10 border-t border-white/10 pt-[clamp(18px,2.4vw,32px)]"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ duration: 0.9, delay: index * 0.08, ease }}
  >
    <span className="text-right text-cream/45 text-sm pt-[0.7em] tabular-nums">
      <span className="text-accent">0{index + 1}</span> — {label}
    </span>
    <div className="flex flex-col items-start gap-1">{children}</div>
  </motion.div>
);

// One letter of the footer name: rises out of its mask on a slightly later slice of the reveal than the last
const Letter = ({
  ch,
  i,
  total,
  progress,
  accent = false,
}: {
  ch: string;
  i: number;
  total: number;
  progress: MotionValue<number>;
  accent?: boolean;
}) => {
  const start = 0.45 + (i / total) * 0.35;
  const y = useTransform(progress, [start, start + 0.2], ["110%", "0%"]);
  return (
    <span className="inline-block overflow-hidden align-bottom pb-[0.02em]">
      <motion.span className={`inline-block ${accent ? "text-accent" : ""}`} style={{ y }}>
        {ch === " " ? " " : ch}
      </motion.span>
    </span>
  );
};

export const Footer = ({ onResume }: { onResume: () => void }) => {
  const lenis = useLenis();
  const time = useDelhiTime();

  // Reveal progress: 0 when the knockout panel enters from below, 1 at the very end of the page
  const revealRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: reveal } = useScroll({ target: revealRef, offset: ["start end", "end start"] });
  const panX = useTransform(reveal, [0, 1], [0, -2600]);
  const videoScale = useTransform(reveal, [0.2, 1], [1.25, 1]);
  const contentY = useTransform(reveal, [0.2, 1], ["18vh", "0vh"]);
  const metaOpacity = useTransform(reveal, [0.7, 0.95], [0, 1]);

  // Only run the footer video while it's actually being revealed
  const [playing, setPlaying] = useState(false);
  useMotionValueEvent(reveal, "change", (v) => setPlaying(v > 0.05));

  const letters = [...NAME];

  return (
    <>
      {/* 1. Contact list */}
      <section className="relative z-10 bg-ink text-cream px-page pt-[16vh] pb-[12vh]">
        <motion.p
          className="eyebrow text-accent mb-[6vh]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Contact
        </motion.p>
        <div className="flex flex-col gap-[clamp(22px,3vw,40px)] max-w-[1400px]">
          <Row index={0} label="Email">
            <a href={`mailto:${profile.email}`} className={bigLink}>
              <Roll>
                {/* only allow a line break after the @ */}
                {profile.email.split("@")[0]}@<wbr />
                {profile.email.split("@")[1]}
              </Roll>
              <Arrow />
            </a>
          </Row>
          <Row index={1} label="Social">
            {[
              { label: "LinkedIn", href: profile.linkedin },
              { label: "GitHub", href: profile.github },
              { label: "LeetCode", href: profile.leetcode },
            ].map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className={bigLink}>
                <Roll>{l.label}</Roll>
                <Arrow />
              </a>
            ))}
          </Row>
          <Row index={2} label="Résumé">
            <button onClick={onResume} className={bigLink}>
              <Roll>Get my résumé</Roll>
              <Arrow />
            </button>
          </Row>
        </div>

        <div className="mt-[12vh] flex flex-col md:flex-row md:items-end justify-between gap-6 text-sm">
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {navItems.map((n) => (
              <a key={n.id} href={`#${n.id}`} className="group text-cream/60 hover:text-cream transition-colors">
                <Roll>{n.label}</Roll>
              </a>
            ))}
          </nav>
          <span className="text-cream/45">©{year} All rights reserved</span>
        </div>
      </section>

      {/* 2. Knockout panel: moving transparent letters reveal the footer layer behind */}
      <div ref={revealRef} className="relative z-10 -mb-px" aria-hidden>
        <svg viewBox="0 0 1920 520" className="block w-full h-auto">
          <defs>
            <mask id="footer-knockout" maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="520">
              <rect width="1920" height="520" fill="white" />
              <motion.text x="60" y="430" fontSize="470" className="display" fill="black" style={{ x: panX }}>
                Get in touch — Get in touch —
              </motion.text>
            </mask>
          </defs>
          <rect width="1920" height="520" fill="var(--color-ink)" mask="url(#footer-knockout)" />
        </svg>
      </div>

      {/* 3. Curtain-reveal footer */}
      <footer className="sticky bottom-0 z-0 h-svh min-h-[560px] overflow-hidden bg-ink text-cream">
        <motion.div className="absolute inset-0" style={{ scale: videoScale }}>
          <LoopVideo src="/hero/4.mp4" playing={playing} className="blur-[5px] opacity-80" />
        </motion.div>
        {/* depth: dark at the edges, a warm terracotta glow low in the middle, film grain on top */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_115%,rgba(194,109,80,0.45)_0%,rgba(194,109,80,0)_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,15,15,0.05)_0%,rgba(15,15,15,0.3)_45%,rgba(15,15,15,0.6)_100%)]" />
        <div className="absolute inset-0 grain opacity-[0.12] mix-blend-overlay pointer-events-none" />

        <motion.div
          className="relative h-full flex flex-col justify-between px-page pt-24 pb-6"
          style={{ y: contentY }}
        >
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 items-center gap-4 text-xs uppercase tracking-[0.08em]"
            style={{ opacity: metaOpacity }}
          >
            <span className="flex items-center gap-2 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              New Delhi <span className="text-cream/55 tabular-nums">{time} IST</span>
            </span>
            <span className="hidden md:block text-center text-cream/75">
              {profile.role} <span className="text-cream/40">/</span> Open to work
            </span>
            <button
              onClick={() => lenis?.scrollTo(0)}
              className="group justify-self-end inline-flex items-center gap-2 hover:text-accent transition-colors"
            >
              <Roll>Back to top</Roll>
              <ArrowUp size={14} className="transition-transform duration-500 group-hover:-translate-y-1" />
            </button>
          </motion.div>

          {/* name sits dead-centre of the footer; the meta rows keep to the top and bottom edges */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-page pointer-events-none">
            <h2
              className="display text-center leading-[0.8] text-[clamp(22px,9.4vw,205px)] whitespace-nowrap"
              aria-label={NAME}
            >
              {letters.map((ch, i) => (
                <Letter key={i} ch={ch} i={i} total={letters.length} progress={reveal} />
              ))}
              <Letter ch="." i={letters.length} total={letters.length} progress={reveal} accent />
            </h2>
          </div>

          <motion.p className="text-center text-xs text-cream/45" style={{ opacity: metaOpacity }}>
            {profile.focus} · ©{year} {profile.name}
          </motion.p>
        </motion.div>
      </footer>
    </>
  );
};
