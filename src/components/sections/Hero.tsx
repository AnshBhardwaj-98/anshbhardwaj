import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ResumeModal } from "../ui/ResumeModal";
import { Download, Activity } from "lucide-react";
import { Magnetic } from "../ui/Magnetic";

export const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position for parallax (spring-smooth)
  const mouseX = useSpring(0, { stiffness: 100, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      // Range: -25 to 25 for subtle movement
      const x = (clientX / innerWidth - 0.5) * 50;
      const y = (clientY / innerHeight - 0.5) * 50;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []); // mouseX/mouseY are stable, no need to re-run

  const { scrollY } = useScroll();
  const nameY = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  // Parallax transforms for background elements
  const bgParallaxX = useTransform(mouseX, (x) => x * 0.5);
  const bgParallaxY = useTransform(mouseY, (y) => y * 0.3);
  const contentParallaxX = useTransform(mouseX, (x) => x * 0.2);
  const contentParallaxY = useTransform(mouseY, (y) => y * 0.15);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] },
    },
  } as const;

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative h-screen flex flex-col justify-center items-start overflow-hidden px-6 md:px-24 bg-surface-base"
    >
      {/* Patterns & Glows */}
      <div className="absolute inset-0 z-0 aero-glow-red" />
      <div className="absolute inset-0 z-0 carbon-fiber opacity-[0.03]" />

      {/* Background Large Text with Mouse Parallax - Repositioned to avoid overlap */}
      <motion.div
        className="absolute top-1/2 right-0 z-0 select-none pointer-events-none overflow-hidden"
        style={{ opacity, x: bgParallaxX, y: bgParallaxY, translateY: "-50%" }}
      >
        <h2 className="text-[20vw] font-black text-chassis/[0.02] leading-none tracking-tighter uppercase font-display italic">
          High Performance
        </h2>
      </motion.div>

      {/* Hero Content with Mouse Parallax */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="z-10 w-full max-w-6xl"
        style={{ x: contentParallaxX, y: contentParallaxY }}
      >
        {/* Telemetry Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-3 px-4 py-1.5 bg-chassis text-white mb-10 rounded-sm"
        >
          <Activity size={14} className="text-telemetryYellow animate-pulse" />
          <span className="text-[11px] font-display font-bold uppercase tracking-[0.25em]">
            System Status: Optimal / {new Date().getFullYear()}
          </span>
        </motion.div>

        <motion.div style={{ y: nameY }}>
          <h1 className="text-6xl sm:text-8xl md:text-[11rem] font-black text-chassis leading-[0.8] mb-12 tracking-tighter uppercase font-display italic">
            <div className="overflow-hidden">
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
                className="block"
              >
                Divyansh
              </motion.span>
            </div>
            <div className="overflow-hidden">
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.1,
                  ease: [0.33, 1, 0.68, 1],
                }}
                className="block text-ignitionRed"
              >
                Bhardwaj
              </motion.span>
            </div>
          </h1>

          <div className="flex flex-col md:flex-row md:items-end gap-12">
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-2xl text-chassis max-w-md font-medium uppercase font-display leading-tight tracking-tight border-l-4 border-telemetryYellow pl-6"
            >
              Generative AI Engineer at{" "}
              <span className="text-ignitionRed">Synergy Labs</span>.
              Architecting high-throughput intelligence.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-5"
            >
              <Magnetic strength={0.2}>
                <a
                  href="#projects"
                  className="group px-12 py-6 bg-ignitionRed text-white font-black rounded-sm uppercase tracking-[0.2em] text-sm shadow-2xl shadow-ignitionRed/40 hover:scale-[1.05] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 flex items-center relative overflow-hidden"
                  aria-label="Navigate to projects section"
                >
                  {/* High-visibility yellow notch */}
                  <div className="absolute top-0 right-0 w-2 h-2 bg-telemetryYellow" />
                  <span className="relative z-10">Launch Projects</span>
                </a>
              </Magnetic>
              <Magnetic strength={0.2}>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-12 py-6 bg-chassis text-telemetryYellow font-black rounded-sm uppercase tracking-[0.2em] text-sm shadow-2xl shadow-chassis/40 hover:scale-[1.05] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 flex items-center gap-3 border-l-4 border-telemetryYellow"
                  aria-label="Open resume modal"
                >
                  <Download size={18} className="text-white" />
                  Telemetry/Resume
                </button>
              </Magnetic>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1.5 }}
        className="absolute bottom-10 right-24 text-chassis/40 hidden md:flex flex-col items-center gap-3"
      >
        <span className="text-[10px] uppercase tracking-[0.5em] font-bold font-display -rotate-90 origin-center mb-12">
          Scroll
        </span>
        <div className="w-px h-24 bg-linear-to-b from-chassis/40 to-transparent" />
      </motion.div>

      <ResumeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resumeUrl="/resume.pdf"
      />
    </section>
  );
};
