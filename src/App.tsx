import { useCallback, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
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

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const onLoaded = useCallback(() => setLoaded(true), []);
  const [resumeOpen, setResumeOpen] = useState(false);
  const openResume = () => setResumeOpen(true);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    // anchors: Lenis handles #links itself (it honours the 64px scroll-margin-top in index.css)
    <ReactLenis root options={{ lerp: 0.1, anchors: true }}>
      <div className="relative w-full">
        <AnimatePresence>{!loaded && <Preloader onDone={onLoaded} />}</AnimatePresence>
        <motion.div className="fixed top-0 inset-x-0 h-0.5 bg-neon origin-left z-[60]" style={{ scaleX }} />
        {loaded && (
          <>
            <Navbar onResume={openResume} />

            <main>
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
