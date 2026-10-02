import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { MapPin } from "lucide-react";
import { capabilities, experiences } from "../../data";

const stack = [...new Set(capabilities.flatMap((c) => c.stack))];

export const Experience = () => {
  const [tab, setTab] = useState(0);
  const exp = experiences[tab];

  // jjettas "Partnerships" heading: solid copy is revealed left-to-right over a hollow copy as you scroll
  const headRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({ target: headRef, offset: ["start 90%", "start 30%"] });
  const clip = useTransform(scrollYProgress, (p) => `inset(0 ${100 - p * 100}% 0 0)`);

  return (
    <section id="experience" className="relative py-[12vh] px-page bg-cream overflow-hidden">
      <span className="eyebrow text-accent mb-5">Experience</span>
      <h2 ref={headRef} className="display relative whitespace-nowrap text-[clamp(64px,17vw,320px)] mb-10">
        <span className="text-outline">Experience</span>
        <motion.span className="absolute inset-0 text-ink" style={{ clipPath: clip }} aria-hidden>
          Experience
        </motion.span>
      </h2>

      <div className="flex flex-wrap gap-1.5 mb-9" role="tablist">
        {experiences.map((e, i) => (
          <button
            key={e.company}
            role="tab"
            aria-selected={i === tab}
            onClick={() => setTab(i)}
            className={`px-[18px] py-[9px] border text-xs uppercase tracking-[0.06em] transition-colors ${
              i === tab ? "bg-ink border-ink text-cream" : "border-line text-muted hover:text-ink"
            }`}
          >
            {e.company}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-[50px] min-h-[300px]"
        >
          <div>
            <h3 className="font-display text-[clamp(26px,2.6vw,40px)] font-semibold tracking-tight mb-4">{exp.role}</h3>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-muted-2 text-sm border-y border-hairline py-3.5">
              <span className="text-ink">{exp.company}</span>
              <span>{exp.period}</span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={13} /> {exp.location}
              </span>
            </div>
          </div>
          <div className="grid gap-[18px]">
            {exp.points.map((p) => (
              <div key={p.t} className="border-l-2 border-line hover:border-accent transition-colors pl-[18px]">
                <p className="font-display text-lg mb-1.5">{p.t}</p>
                <p className="text-muted text-sm leading-[1.5]">{p.d}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-[10vh] -mx-[clamp(20px,3.2vw,64px)] border-y border-line py-6 overflow-hidden" aria-hidden>
        <div className="flex w-max animate-marquee">
          {[...stack, ...stack].map((t, i) => (
            <span key={i} className="display text-[clamp(32px,4vw,64px)] text-muted-dark px-8 hover:text-accent transition-colors">
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
