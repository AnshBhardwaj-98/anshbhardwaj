import { useState } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { StarBackground } from "../three/StarBackground";
import { ResumeModal } from "../ui/ResumeModal";
import { Download, ChevronDown, Sparkles } from "lucide-react";

export const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const firstName = "DIVYANSH";
  const lastName = "BHARDWAJ";

  const renderNameLine = (text: string) =>
    text.split("").map((char, index) => (
      <motion.span
        key={index}
        variants={letterVariants}
        className="inline-block hover:text-neonBlue transition-colors cursor-default flex-shrink-0"
      >
        {char}
      </motion.span>
    ));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 200, damping: 10 },
    },
  };

  return (
    <section
      id="hero"
      className="relative h-screen flex flex-col justify-center items-center overflow-hidden px-6 md:px-20"
    >
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <StarBackground />
        </Canvas>
        {/* Radial Glow & Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,243,255,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Hero Content Centered */}
      <div className="z-10 w-full max-w-5xl text-center">
        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neonBlue opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neonBlue"></span>
          </span>
          <span className="text-xs font-medium text-gray-300 uppercase tracking-widest flex items-center gap-2">
            Available for new projects{" "}
            <Sparkles size={12} className="text-neonBlue" />
          </span>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Name with animated letters */}
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-6 tracking-tighter text-white leading-tight flex flex-col justify-center items-center gap-0 md:gap-2 max-w-full px-2">
            <div className="flex flex-wrap justify-center gap-1 md:gap-2">
              {renderNameLine(firstName)}
            </div>
            <div className="flex flex-wrap justify-center gap-1 md:gap-2">
              {renderNameLine(lastName)}
            </div>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-xl md:text-3xl text-gray-400 font-light mb-12 mx-auto max-w-3xl leading-relaxed"
          >
            Generative AI Engineer <span className="text-neonBlue">/</span>{" "}
            <span className="text-neonBlue">Synergy Labs</span>{" "}
            <br className="hidden md:block" />
            <span className="text-lg md:text-xl text-gray-500 mt-2 block">
              Architecting intelligent automation at the intersection of logic
              and creativity.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <a
              href="#projects"
              className="group px-8 py-3.5 rounded-full bg-white text-black font-bold hover:bg-neonBlue hover:text-white hover:shadow-neon transition-all duration-300 flex items-center gap-2"
            >
              View Work
            </a>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3.5 rounded-full border border-white/20 hover:border-neonPurple hover:text-white hover:bg-neonPurple/20 transition-all duration-300 backdrop-blur-sm bg-white/5 flex items-center gap-2 group"
            >
              <Download
                size={18}
                className="group-hover:-translate-y-1 transition-transform"
              />
              Get Resume
            </button>
            <a
              href="#contact-form"
              className="px-8 py-3.5 rounded-full border border-white/20 hover:border-neonPink hover:text-white hover:bg-neonPink/20 transition-all duration-300 backdrop-blur-sm bg-white/5"
            >
              Contact Me
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={20} className="text-neonBlue" />
        </motion.div>
      </motion.div>

      <ResumeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resumeUrl="/resume.pdf"
      />
    </section>
  );
};
