import { motion } from "framer-motion";
import { SectionHeading } from "../ui/SectionHeading";
import { MapPin, Gauge } from "lucide-react";

const experiences = [
  {
    role: "Generative AI Engineer",
    company: "Synergy Labs",
    period: "Present",
    location: "Gurugram, India",
    points: [
      "Architecting LLM-driven internal automation systems.",
      "Optimizing fine-tuning pipelines for proprietary models.",
      "Developing high-throughput API layers for real-time inference.",
    ],
  },
  {
    role: "Software Engineering Intern",
    company: "Uplyift",
    period: "2026",
    location: "Delhi, India",
    points: [
      "Engineered Shopify admin scale systems with SSE streaming.",
      "Built FastAPI backends for high-concurrency management.",
    ],
  },
];

export const Experience = () => {
  return (
    <section id="experience" className="py-32 px-6 md:px-24 bg-surface-layered relative">
      <SectionHeading align="left">Paddock / Experience</SectionHeading>

      <div className="space-y-1 mt-20">
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group grid grid-cols-1 md:grid-cols-12 gap-8 bg-surface-base p-10 hover:bg-chassis hover:text-white transition-all duration-500 cursor-default"
          >
            {/* Timeline info */}
            <div className="md:col-span-3 space-y-4">
              <div className="flex items-center gap-3">
                <Gauge size={16} className="text-ignitionRed" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] group-hover:text-telemetryYellow">{exp.period}</span>
              </div>
              <h3 className="text-xl font-black uppercase italic leading-none">{exp.company}</h3>
              <div className="flex items-center gap-2 text-xs font-bold text-chassis/40 group-hover:text-white/40">
                <MapPin size={12} /> {exp.location}
              </div>
            </div>

            {/* Content */}
            <div className="md:col-span-9 space-y-6 md:border-l border-chassis/5 md:pl-12 group-hover:border-white/10 transition-colors">
              <h4 className="text-2xl font-black uppercase tracking-tight italic text-ignitionRed group-hover:text-telemetryYellow">
                {exp.role}
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {exp.points.map((point, i) => (
                  <li key={i} className="flex gap-4 text-sm font-medium leading-relaxed opacity-70 group-hover:opacity-100">
                    <span className="w-1.5 h-1.5 bg-ignitionRed mt-2 shrink-0 group-hover:bg-telemetryYellow" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
