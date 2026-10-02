import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const DURATION = 1400; // ms the counter takes to reach 100%

// jjettas-style 0% → 100% counter, then the panel wipes up (exit handled by AnimatePresence in App)
export const Preloader = ({ onDone }: { onDone: () => void }) => {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onDone();
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      setPct(Math.round((1 - Math.pow(1 - t, 3)) * 100)); // ease-out cubic
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <motion.div
      exit={{ y: "-100%" }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[200] bg-ink-2 text-cream flex flex-col justify-between px-page py-8"
      aria-hidden
    >
      <div className="flex justify-between text-xs uppercase tracking-[0.12em] text-muted">
        <span>Divyansh Bhardwaj</span>
        <span>Portfolio · {new Date().getFullYear()}</span>
      </div>
      <div className="flex items-end justify-between gap-6">
        <span className="display text-[clamp(120px,26vw,420px)] tabular-nums">{pct}%</span>
        <span className="hidden sm:block w-[30vw] h-px bg-hairline mb-[4vw] relative overflow-hidden">
          <span className="absolute inset-y-0 left-0 bg-neon" style={{ width: `${pct}%` }} />
        </span>
      </div>
    </motion.div>
  );
};
