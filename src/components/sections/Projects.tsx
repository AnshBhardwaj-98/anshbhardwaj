import { SectionHeading } from "../ui/SectionHeading";
import { GlassCard } from "../ui/GlassCard";
import { useEffect, useRef, useState } from "react";

const projects = [
  {
    title: "Aclique CLI",
    year: "2025",
    tech: ["Node.js", "PostgreSQL", "Next.js", "GitHub OAuth"],
    description: [
      "Developed an AI-powered CLI assistant using Google Gemini to automate developer workflows and command execution.",
      "Implemented secure device authentication via GitHub OAuth using Next.js, Prisma, and PostgreSQL (NeonDB).",
      "Designed modular CLI commands enabling integration with external APIs and developer tools.",
    ],
    color: "from-neonBlue/10",
    accent: "neonBlue",
    featured: true,
  },
  {
    title: "YouTube Sentiment Analysis",
    year: "2025",
    tech: ["Python", "Flask", "YouTube Data API V3"],
    description: [
      "Built a sentiment analysis pipeline to process and analyze 50K+ YouTube comments using Python NLP models.",
      "Integrated YouTube Data API with Flask services to extract comments and generate sentiment insights across 100+ videos.",
    ],
    color: "from-neonPurple/10",
    accent: "neonPurple",
  },
  {
    title: "Meridian",
    year: "2025",
    tech: ["React", "Node.js", "Socket.IO"],
    description: [
      "Developed a collaborative code editor using Monaco Editor with real-time multi-user synchronization.",
      "Implemented low-latency WebSocket communication supporting 10+ concurrent users with live notifications.",
    ],
    color: "from-neonPink/10",
    accent: "neonPink",
  },
  {
    title: "SkittyChat",
    year: "2024",
    tech: ["React", "Node.js", "Express", "Socket.IO"],
    description: [
      "Built a full-stack chat platform with JWT authentication and REST APIs.",
      "Implemented Socket.IO messaging enabling secure real-time multi-user communication across devices.",
    ],
    color: "from-neonBlue/10",
    accent: "neonBlue",
  },
];

export const Projects = () => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const cardsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setVisibleCards((prev) => [...new Set([...prev, index])]);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="projects"
      className="py-24 px-6 md:px-20 max-w-7xl mx-auto relative z-10"
    >
      <SectionHeading>Featured Projects</SectionHeading>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 auto-rows-fr">
        {projects.map((project, index) => (
          <div
            key={index}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            data-index={index}
            className={`transition-all duration-700 ease-out transform ${
              visibleCards.includes(index)
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <GlassCard className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-neonBlue/20">
              {/* Gradient top accent line */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${project.color} to-transparent`}
              />

              {/* Background watermark year */}
              <div className="absolute bottom-4 right-4 text-7xl font-black text-white/5 select-none pointer-events-none">
                {project.year}
              </div>

              {/* Featured badge */}
              {project.featured && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-2 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider bg-neonBlue/20 text-neonBlue rounded-full border border-neonBlue/30 backdrop-blur-sm">
                    Featured
                  </span>
                </div>
              )}

              <div className="p-6 flex flex-col h-full relative z-2">
                {/* Title and year row */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl font-bold bg-linear-to-r from-white to-white/80 bg-clip-text text-transparent">
                    {project.title}
                  </h3>
                </div>

                {/* Tech badges */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tech.map((tech, i) => (
                    <span
                      key={i}
                      className={`text-xs font-mono px-2.5 py-1 rounded-full bg-${project.accent}/10 text-${project.accent} border border-${project.accent}/30`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Description list with custom bullets */}
                <ul className="space-y-2.5 text-gray-300 text-sm mb-6 grow">
                  {project.description.map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span
                        className={`text-${project.accent} mt-0.5 shrink-0`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Hover link */}
                <div className="mt-auto pt-4 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a
                    href="#"
                    className={`inline-flex items-center gap-2 text-sm font-medium text-${project.accent} hover:gap-3 transition-all`}
                    onClick={(e) => e.preventDefault()} // Replace with actual link
                  >
                    Explore project
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </GlassCard>
          </div>
        ))}
      </div>
    </section>
  );
};
