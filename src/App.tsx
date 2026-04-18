import { motion, useScroll, useSpring } from "framer-motion";
import { Navbar } from "./components/layout/Navbar";
import { Hero } from "./components/sections/Hero";
import { About } from "./components/sections/About";
import { Skills } from "./components/sections/Skills";
import { Projects } from "./components/sections/Projects";
import { Experience } from "./components/sections/Experience";
import { Education } from "./components/sections/Education";
import { Contact } from "./components/sections/Contact";
import { Footer } from "./components/layout/Footer";
import { LoadingScreen } from "./components/ui/LoadingScreen";

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="relative w-full bg-surface-base selection:bg-ignitionRed selection:text-white">
      <LoadingScreen />
      
      {/* High-Performance Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-ignitionRed origin-left z-[100]"
        style={{ scaleX }}
      />

      <Navbar />

      <main className="relative">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
