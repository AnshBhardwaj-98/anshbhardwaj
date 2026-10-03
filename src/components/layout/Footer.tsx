import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useLenis } from "lenis/react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { navItems, profile } from "../../data";

// art-yakushev.com-style ending, in three layers:
//   1. contact list: rows slide up into view; links "roll" on hover
//   2. onyx panel with a terracotta "GET IN TOUCH" panning sideways with scroll
//   3. the footer, stuck to the bottom of the viewport *behind* the page (z-0 under main's z-10):
//      as the page scrolls off it, the content rises and the name assembles

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
      className="absolute inset-0 block translate-y-full text-accent select-none transition-transform duration-500 ease-out-expo group-hover:translate-y-0"
    >
      {children}
    </span>
  </span>
);

// One card in the uneven link grid: index + arrow up top, condensed label + detail at the bottom.
// Hover floods it with terracotta from the bottom (the preloader's column motion).
const LinkCard = ({
  index,
  label,
  detail,
  span,
  href,
  onClick,
}: {
  index: number;
  label: string;
  detail: string;
  span: string; // grid placement, e.g. "col-span-2 md:col-span-7"
  href?: string;
  onClick?: () => void;
}) => {
  const Tag = href ? "a" : "button";
  const external = href && !href.startsWith("mailto:");
  return (
    <motion.li
      className={span}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.9, delay: index * 0.07, ease }}
    >
      <Tag
        {...(href ? { href, ...(external && { target: "_blank", rel: "noopener noreferrer" }) } : { onClick, type: "button" })}
        className="group relative w-full h-full min-h-[clamp(150px,15vw,230px)] flex flex-col justify-between gap-6 border border-white/12 p-[clamp(16px,1.6vw,26px)] text-left overflow-hidden"
      >
        <span className="absolute inset-0 bg-accent origin-bottom scale-y-0 group-hover:scale-y-100 group-focus-visible:scale-y-100 transition-transform duration-500 ease-out-expo" />
        <span className="relative flex items-start justify-between">
          <span className="text-xs tabular-nums tracking-[0.1em] text-cream/45 group-hover:text-ink transition-colors duration-300">
            0{index + 1}
          </span>
          <ArrowUpRight
            strokeWidth={1.25}
            className="w-6 h-6 text-accent group-hover:text-ink group-hover:rotate-45 transition duration-500 ease-out-expo"
          />
        </span>
        <span className="relative">
          <span className="block display text-[clamp(30px,3.4vw,58px)] group-hover:text-ink transition-colors duration-300">
            {label}
          </span>
          <span className="block mt-2 text-[13px] text-cream/55 group-hover:text-ink/80 transition-colors duration-300 truncate">
            {detail}
          </span>
        </span>
      </Tag>
    </motion.li>
  );
};

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

  // Reveal progress: 0 when the "Get in touch" panel enters from below, 1 at the very end of the page
  const revealRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: reveal } = useScroll({ target: revealRef, offset: ["start end", "end start"] });
  const panX = useTransform(reveal, [0, 1], [0, -1500]);
  const contentY = useTransform(reveal, [0.2, 1], ["18vh", "0vh"]);
  const metaOpacity = useTransform(reveal, [0.7, 0.95], [0, 1]);


  const letters = [...NAME];

  return (
    <>
      {/* 1. Contact list */}
      <section className="relative z-10 bg-ink text-cream px-page pt-[14vh] pb-[10vh]">
        <motion.div
          className="flex justify-between items-end gap-6 mb-[5vh] text-xs uppercase tracking-[0.14em]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="text-accent whitespace-nowrap">( Find me elsewhere )</span>
          <span className="hidden sm:block text-cream/45">Replies within a day</span>
        </motion.div>
        {/* uneven bento: 7 + 5 on the first row, 3 + 5 + 4 on the second (12-col); 2-col on phones */}
        <ul className="grid grid-cols-2 md:grid-cols-12 gap-2">
          <LinkCard index={0} span="col-span-2 md:col-span-7" label="Email" detail={profile.email} href={`mailto:${profile.email}`} />
          <LinkCard index={1} span="col-span-1 md:col-span-5" label="LinkedIn" detail="in/divyanshbhardwaj001" href={profile.linkedin} />
          <LinkCard index={2} span="col-span-1 md:col-span-3" label="GitHub" detail="@AnshBhardwaj-98" href={profile.github} />
          <LinkCard index={3} span="col-span-1 md:col-span-5" label="LeetCode" detail="355+ problems solved" href={profile.leetcode} />
          <LinkCard index={4} span="col-span-1 md:col-span-4" label="Résumé" detail="PDF · 2026" onClick={onResume} />
        </ul>

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

      {/* 2. "Get in touch" panel, panning sideways with scroll */}
      <div ref={revealRef} className="relative z-10 -mb-px" aria-hidden>
        <svg viewBox="0 0 1920 300" className="block w-full h-auto bg-ink">
          <motion.text x="60" y="250" fontSize="270" className="display" fill="var(--color-accent)" style={{ x: panX }}>
            Get in touch — Get in touch —
          </motion.text>
        </svg>
      </div>

      {/* 3. Curtain-reveal footer */}
      <footer className="sticky bottom-0 z-0 h-svh min-h-[560px] overflow-hidden bg-ink text-cream">
        {/* depth: a warm terracotta glow low in the middle, film grain on top */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_115%,rgba(194,109,80,0.55)_0%,rgba(194,109,80,0)_60%)]" />
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
