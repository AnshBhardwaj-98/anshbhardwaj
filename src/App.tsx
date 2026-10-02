import { useCallback, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/sections/Hero";
import { Capabilities } from "./components/sections/Capabilities";
import { Projects } from "./components/sections/Projects";
import { Experience } from "./components/sections/Experience";
import { Moments } from "./components/sections/Moments";
import { Education } from "./components/sections/Education";
import { Contact } from "./components/sections/Contact";
import { ResumeModal } from "./components/ui/ResumeModal";
import { Preloader } from "./components/ui/Preloader";

// Start downloading the hero's three.js/fluid chunk right away instead of after the preloader
void import("./components/ui/FluidReveal");

export default function App() {
  // The intro plays on every page load (including hard reloads).
  // `ready` mounts the page while the intro still covers the screen; `introDone` removes the intro.
  const [ready, setReady] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const onCovered = useCallback(() => setReady(true), []);
  const onIntroDone = useCallback(() => setIntroDone(true), []);
  const [resumeOpen, setResumeOpen] = useState(false);
  const openResume = () => setResumeOpen(true);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    // anchors: Lenis handles #links itself (it honours the 64px scroll-margin-top in index.css)
    <ReactLenis root options={{ lerp: 0.1, anchors: true }}>
      <div className="relative w-full">
        {!introDone && <Preloader onCovered={onCovered} onDone={onIntroDone} />}
        <motion.div className="fixed top-0 inset-x-0 h-0.5 bg-accent origin-left z-[60]" style={{ scaleX }} />
        {ready && (
          <>
            <Navbar onResume={openResume} />

            {/* z-10: the page sits above the sticky footer, which is revealed as main scrolls away */}
            <main className="relative z-10">
              <Hero />
              <Capabilities />
              <Projects />
              <Experience />
              <Moments />
              <Education />
              <Contact onResume={openResume} />
            </main>

            <Footer onResume={openResume} />
          </>
        )}
        <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
      </div>
    </ReactLenis>
  );
}
