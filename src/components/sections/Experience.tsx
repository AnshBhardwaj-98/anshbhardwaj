import { motion } from "framer-motion";
import { SectionHeading } from "../ui/SectionHeading";
import { GlassCard } from "../ui/GlassCard";
import { Briefcase, Calendar, MapPin } from "lucide-react";

const experiences = [
  {
    role: "Generative AI Engineer",
    company: "Synergy Labs",
    period: "Present",
    location: "Gurugram, Haryana",
    color: "text-neonPink",
    border: "border-neonPink/50",
    bg: "bg-neonPink",
    shadow: "shadow-[0_0_15px_#ff007f]",
    points: [
      "Currently building internal AI automation tools to streamline company workflows and boost operational efficiency.",
      "Developing and fine-tuning generative models and LLM-based solutions for specialized internal use cases.",
      "Engineering robust AI pipelines to automate repetitive tasks and integrate intelligence into core business processes.",
    ],
  },
  {
    role: "Software Engineering Intern",
    company: "Uplyift",
    period: "Jan 2026 - Present",
    location: "Okhla Phase 1, Delhi",
    color: "text-neonBlue",
    border: "border-neonBlue/50",
    bg: "bg-neonBlue",
    shadow: "shadow-[0_0_15px_#00f3ff]",
    points: [
      "Developed a full-stack Shopify admin dashboard using FastAPI and React for real-time product, inventory, and collections management.",
      "Implemented Shopify Bulk Operations API with SSE streaming to synchronize thousands of product variants.",
      "Engineered an Excel-based data pipeline enabling bulk import and automated Shopify updates.",
    ],
  },
  {
    role: "Intern Machine Learning & Deep Learning",
    company: "Edunet Foundation",
    period: "Jan 2025 - Feb 2025",
    location: "Remote",
    color: "text-neonPurple",
    border: "border-neonPurple/50",
    bg: "bg-neonPurple",
    shadow: "shadow-[0_0_15px_#bc13fe]",
    points: [
      "Developed domain-specific image generation pipelines using Stable Diffusion XL.",
      "Curated datasets and optimized training pipelines using PyTorch and Hugging Face.",
      "Improved generated image quality by 30% using FID evaluation metrics.",
    ],
  },
];

export const Experience = () => {
  return (
    <section
      id="experience"
      className="py-24 px-6 md:px-20 max-w-7xl mx-auto relative z-10"
    >
      <SectionHeading>Experience Timeline</SectionHeading>

      <div className="relative mt-12">
        {/* Vertical Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-neonPink via-neonBlue to-neonPurple opacity-30 -translate-x-1/2 hidden md:block" />
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-linear-to-b from-neonPink via-neonBlue to-neonPurple opacity-30 block md:hidden" />

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
            >
              {/* Timeline Node */}
              <div
                className={`absolute left-4 md:left-1/2 w-4 h-4 rounded-full ${exp.bg} ${exp.shadow} -translate-x-1/2 z-20 top-0 md:top-1/2 md:-translate-y-1/2`}
              />

              {/* Content Card */}
              <div
                className={`w-full md:w-[45%] pl-12 md:pl-0 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}
              >
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <GlassCard
                    className={`relative border ${exp.border} hover:scale-[1.02] transition-transform duration-300`}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Briefcase className={`${exp.color}`} size={18} />
                        <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
                          {exp.role}
                        </h3>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-gray-400 mb-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`${exp.color} font-bold`}>
                            @ {exp.company}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          <span>{exp.period}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} />
                          <span>{exp.location}</span>
                        </div>
                      </div>

                      <ul className="space-y-3">
                        {exp.points.map((point, i) => (
                          <li
                            key={i}
                            className="flex gap-3 text-sm md:text-base text-gray-300 leading-relaxed"
                          >
                            <span
                              className={`mt-2 w-1.5 h-1.5 rounded-full shrink-0 ${exp.bg}`}
                            />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </GlassCard>
                </motion.div>
              </div>

              {/* Spacer for the other side on desktop */}
              <div className="hidden md:block md:w-[45%]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
