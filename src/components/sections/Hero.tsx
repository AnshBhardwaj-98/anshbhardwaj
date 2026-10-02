import { lazy, Suspense, useRef, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { motion, useInView } from "framer-motion";
import { profile } from "../../data";
import { LoopVideo } from "../ui/LoopVideo";
// three.js + the fluid sim are heavy; load them after first paint
const FluidReveal = lazy(() => import("../ui/FluidReveal"));

const WORD = "divyansh.";

const hasWebGL = () => {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
};

// Shown while the fluid layer loads, and permanently if WebGL is unavailable or it crashes,
// so a GPU problem degrades to a static hero instead of unmounting the whole page.
const StaticWordmark = () => (
  <div className="absolute inset-0 bg-cream flex items-center px-page">
    <svg viewBox="0 0 100 22" className="w-full overflow-visible" aria-hidden>
      <text
        x="0"
        y="17"
        textLength="100"
        lengthAdjust="spacingAndGlyphs"
        fontSize="22"
        fontWeight="800"
        className="font-display fill-ink"
      >
        {WORD}
      </text>
    </svg>
  </div>
);

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
});

// noth.in-style hero: video underneath, cream wordmark panel on top that the cursor dissolves (fluid sim),
// and a mix-blend-difference overlay so the copy stays readable on both layers.
export const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  const [webgl, setWebgl] = useState(hasWebGL);

  return (
    <section ref={ref} id="hero" className="relative h-svh min-h-[560px] overflow-hidden bg-ink">
      <LoopVideo src="/hero/loop.mp4" />
      {webgl ? (
        <ErrorBoundary
          fallback={<StaticWordmark />}
          onError={(error) => console.error("Hero fluid effect failed, using static fallback:", error)}
        >
          <Suspense fallback={<StaticWordmark />}>
            <FluidReveal word={WORD} active={inView} onContextLost={() => setWebgl(false)} />
          </Suspense>
        </ErrorBoundary>
      ) : (
        <StaticWordmark />
      )}

      <h1 className="sr-only">
        {profile.name}, {profile.role}
      </h1>

      <div className="absolute inset-0 z-10 flex flex-col justify-end px-page pt-20 pb-4 text-white mix-blend-difference pointer-events-none">
        <motion.div {...fade(1.2)} className="mb-[clamp(24px,6vh,64px)]">
          <p className="font-display text-[clamp(20px,1.6vw,26px)] leading-none tracking-tight">
            Backends, products & LLM pipelines.
            <br />
            Engineered to ship.
          </p>
          <a
            href="#contact"
            className="pointer-events-auto group mt-6 inline-flex items-center gap-3.5 rounded-full border border-white/40 bg-white text-black px-5 py-3 text-xs font-medium uppercase tracking-[0.08em] hover:border-white transition-colors"
          >
            Let's talk
            <span className="relative w-3.5 h-px bg-black transition-transform group-hover:translate-x-1">
              <span className="absolute right-0 -top-[3px] w-[7px] h-[7px] border-t border-r border-black rotate-45" />
            </span>
          </a>
        </motion.div>

        <motion.div
          {...fade(1.4)}
          className="flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-[0.03em] leading-none"
        >
          <span>
            {profile.role} · {profile.location}
          </span>
          <div className="flex items-center gap-[22px]">
            <div className="flex items-center gap-3.5 pointer-events-auto">
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-60 transition-opacity"
              >
                <span className="hidden md:inline">LinkedIn</span>
                <span className="md:hidden">LKDN</span>
              </a>
              <span>/</span>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-60 transition-opacity"
              >
                GitHub
              </a>
            </div>
            <span className="bg-white text-black rounded px-1 py-1">2026</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
