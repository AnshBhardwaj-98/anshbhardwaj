import { SectionHeading } from "../ui/SectionHeading";
import { useRef } from "react";
import { ArrowRight, Zap, Target } from "lucide-react";
import { motion, useInView } from "framer-motion";

const projects = [
  {
    title: "Aclique CLI",
    year: "2025",
    tech: ["Node.js", "PostgreSQL", "Google Gemini"],
    description:
      "A high-performance AI orchestrator designed for terminal-based automation and mission-critical developer workflows.",
    featured: true,
    link: "https://github.com/AnshBhardwaj-98/aclique-cli",
  },
  {
    title: "YouTube Sentiment",
    year: "2025",
    tech: ["Python", "Flask", "NLP"],
    description:
      "Rapid telemetry processing for digital audience insights, analyzing massive comment buffers at scale.",
    link: "https://github.com/AnshBhardwaj-98/Youtube_Sentiment_Analysis_Extension",
  },
  {
    title: "Meridian Live",
    year: "2025",
    tech: ["React", "WebSockets", "Socket.IO"],
    description:
      "Low-latency collaborative environment with real-time state synchronization for high-throughput teams.",
    link: "https://meridian-live.vercel.app/",
  },
  {
    title: "SkittyChat",
    year: "2024",
    tech: ["Node.js", "JWT", "Realtime"],
    description:
      "Secure, high-bandwidth communication infrastructure with modular authentication and real-time data streaming.",
    link: "https://skitty-frontend.onrender.com",
  },
];

export const Projects = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section
      id="projects"
      className="py-32 px-6 md:px-24 bg-surface-base relative overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full checkered-pattern opacity-[0.01] pointer-events-none" />
      <div className="absolute left-0 top-1/4 w-px h-1/2 bg-linear-to-b from-transparent via-ignitionRed to-transparent opacity-20" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
        <SectionHeading align="left">
          CIRCUIT / <br />
          <span className="text-ignitionRed italic">SOLUTIONS</span>
        </SectionHeading>

        <div className="hidden md:flex flex-col items-end text-right">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-chassis/30 mb-2">
            Portfolio_Registry.v2
          </span>
          <div className="h-0.5 w-32 bg-chassis/10" />
        </div>
      </div>

      <motion.div
        ref={containerRef}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-20 lg:gap-y-0"
      >
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: index * 0.1,
              ease: [0.33, 1, 0.68, 1],
            }}
            className={`flex flex-col h-full ${index % 2 !== 0 ? "lg:mt-32" : ""}`}
          >
            <div className="group relative flex flex-col h-full bg-surface-container hover:bg-surface-layered transition-all duration-500 overflow-hidden shadow-sm hover:shadow-2xl">
              {/* Top Racing Stripe */}
              <div className="absolute top-0 left-0 w-full h-1 bg-chassis/5 overflow-hidden">
                <div className="w-full h-full bg-ignitionRed transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out" />
              </div>

              {/* Technical Overlay */}
              <div className="absolute top-4 right-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <Target size={120} className="text-chassis" />
              </div>

              <div className="p-8 md:p-12 flex flex-col h-full relative z-10">
                {/* Header info */}
                <div className="flex justify-between items-start mb-10">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-chassis text-telemetryYellow flex items-center justify-center font-display font-black text-sm italic rounded-none border-b-2 border-ignitionRed">
                      {index + 1}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-chassis uppercase tracking-[0.3em]">
                        Year
                      </span>
                      <span className="text-xs font-bold text-chassis/40">
                        {project.year}
                      </span>
                    </div>
                  </div>
                  {project.featured && (
                    <div className="px-3 py-1.5 bg-ignitionRed text-white text-[9px] font-black uppercase tracking-widest italic flex items-center gap-2">
                      <Zap size={10} /> Mission_Critical
                    </div>
                  )}
                </div>

                {/* Content */}
                <h3 className="text-4xl md:text-5xl font-black text-chassis uppercase tracking-tighter mb-6 italic leading-none group-hover:text-ignitionRed transition-colors">
                  {project.title}
                </h3>

                <p className="text-chassis/70 text-sm md:text-base font-medium leading-relaxed mb-12 max-w-md border-l-2 border-chassis/10 pl-6 group-hover:border-ignitionRed transition-colors">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mt-auto mb-12">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-black uppercase tracking-widest text-chassis/60 px-4 py-2 bg-surface-base border-r-2 border-telemetryYellow group-hover:bg-chassis group-hover:text-white transition-all"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Footer Link */}
                <div className="flex items-center justify-between pt-8 border-t border-chassis/5">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-chassis group-hover:text-ignitionRed transition-all"
                  >
                    Analyze Entry{" "}
                    <ArrowRight
                      size={16}
                      className="group-hover:translate-x-2 transition-transform"
                    />
                  </a>

                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`w-1 h-1 ${i === 1 ? "bg-ignitionRed" : "bg-chassis/10"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Section End Marker */}
      <div className="mt-32 flex justify-center opacity-10">
        <div className="h-px w-full bg-linear-to-r from-transparent via-chassis to-transparent" />
      </div>
    </section>
  );
};
