import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLenis } from "lenis/react";
import {
  SiDocker,
  SiFastapi,
  SiGooglegemini,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiPytorch,
  SiReact,
  SiRedis,
  SiTypescript,
} from "react-icons/si";

// smitmakodia.vercel.app-style intro, in our palette:
//   onyx panel -> 7 terracotta columns grow up from the bottom (staggered) while stack logos flick past
//   -> the page mounts underneath (onCovered) -> logo fades -> columns collapse upwards, revealing it (onDone)

const ICONS = [
  SiPython,
  SiFastapi,
  SiReact,
  SiPostgresql,
  SiTypescript,
  SiDocker,
  SiNodedotjs,
  SiRedis,
  SiNextdotjs,
  SiPytorch,
  SiGooglegemini,
];
const COLS = 7;
const inOut = [0.65, 0, 0.35, 1] as const; // ≈ gsap power3.inOut
const outExpo = [0.76, 0, 0.24, 1] as const; // ≈ gsap power4.inOut

type Stage = "in" | "hold" | "out";

export const Preloader = ({ onCovered, onDone }: { onCovered: () => void; onDone: () => void }) => {
  const [stage, setStage] = useState<Stage>("in");
  const [icon, setIcon] = useState(0);
  const lenis = useLenis();

  // Lock scrolling for the duration of the intro
  useEffect(() => {
    lenis?.stop();
    window.scrollTo(0, 0);
    return () => lenis?.start();
  }, [lenis]);

  useEffect(() => {
    const id = setInterval(() => setIcon((n) => (n + 1) % ICONS.length), 130);
    return () => clearInterval(id);
  }, []);

  // Reduced motion: skip the show entirely
  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    onCovered();
    onDone();
  }, [onCovered, onDone]);

  // Hold on the full-colour screen briefly, then collapse
  useEffect(() => {
    if (stage !== "hold") return;
    const id = setTimeout(() => setStage("out"), 650);
    return () => clearTimeout(id);
  }, [stage]);

  const Icon = ICONS[icon];

  return (
    <div data-intro aria-hidden className={`fixed inset-0 z-[200] flex ${stage === "in" ? "bg-ink" : "bg-transparent"}`}>
      {Array.from({ length: COLS }, (_, i) => (
        <motion.div
          key={i}
          className="flex-1 h-full bg-accent -mr-px last:mr-0"
          style={{ originY: stage === "out" ? 0 : 1 }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: stage === "out" ? 0 : 1 }}
          transition={
            stage === "out"
              ? { duration: 0.45, delay: i * 0.05, ease: outExpo }
              : { duration: 0.4, delay: i * 0.04, ease: inOut }
          }
          onAnimationComplete={() => {
            if (i !== COLS - 1) return;
            if (stage === "in") {
              onCovered(); // mount the page underneath while the screen is fully covered
              setStage("hold");
            } else if (stage === "out") {
              onDone();
            }
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0 z-10 grid place-items-center text-ink pointer-events-none"
        animate={{ opacity: stage === "out" ? 0 : 1 }}
        transition={{ duration: 0.22 }}
      >
        <Icon size={64} />
      </motion.div>
    </div>
  );
};
