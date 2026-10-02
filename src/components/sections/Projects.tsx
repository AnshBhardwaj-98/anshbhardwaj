import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects } from "../../data";
import { RevealLines } from "../ui/Reveal";

const pad = (n: number) => String(n).padStart(2, "0");

export const Projects = () => {
  const [active, setActive] = useState(0);
  const current = projects[active];

  return (
    <section id="work" className="relative bg-paper text-ink pt-[8vh] pb-[6vh] overflow-x-clip">
      {/* Scrolling rail */}
      <div className="overflow-hidden pb-[6vh] pt-[2vh]" aria-hidden>
        <div className="flex w-max animate-marquee font-display font-medium tracking-[-0.02em] whitespace-nowrap text-[clamp(46px,8vw,130px)] text-ink/15">
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} className="px-[0.3em]">
              Featured Work <span className="text-accent">/</span>
            </span>
          ))}
        </div>
      </div>

      <div className="px-page">
        <div className="mb-[8vh]">
          <span className="eyebrow text-muted-dark mb-4">Featured Work</span>
          <h2 className="font-display font-medium tracking-[-0.015em] leading-[1.02] text-[clamp(28px,3vw,46px)]">
            <RevealLines lines={["Selected projects, up close."]} />
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-start">
          {/* Sticky preview panel */}
          <div className="hidden lg:block sticky top-[calc(64px+6vh)] h-[72vh] border border-ink/10 bg-ink text-cream overflow-hidden">
            <div className="absolute inset-0 grid-fx" />
            <div className="absolute -bottom-1/3 -right-1/4 w-[70%] h-[70%] rounded-full bg-accent/20 blur-[100px]" />
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative h-full flex flex-col justify-between p-10"
              >
                <div className="flex justify-between text-xs uppercase tracking-[0.08em] text-cream/60">
                  <span className="text-accent">{current.category}</span>
                  <span>
                    {pad(active + 1)} / {pad(projects.length)}
                  </span>
                </div>
                <div>
                  <p className="font-display font-bold leading-none text-[clamp(120px,14vw,240px)] text-accent">
                    {pad(active + 1)}
                  </p>
                  <p className="font-display text-4xl font-semibold tracking-tight mt-4">{current.title}</p>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {current.tech.map((t) => (
                      <span key={t} className="text-[11px] border border-white/15 px-2.5 py-1 text-[#d0d0d0]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Project list */}
          <div className="flex flex-col">
            {projects.map((p, i) => (
              <motion.article
                key={p.title}
                onViewportEnter={() => setActive(i)}
                viewport={{ amount: 0.6 }}
                className="lg:min-h-[72vh] flex flex-col justify-center py-10 border-t border-ink/15 first:border-t-0"
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.08em] text-muted-dark mb-5">
                  <span>
                    {pad(i + 1)} / {pad(projects.length)}
                  </span>
                  <span>{p.year}</span>
                </div>
                <h3 className="font-display font-semibold tracking-[-0.02em] leading-none text-[clamp(32px,3.6vw,56px)] mb-6">
                  {p.title}
                </h3>
                <p className="text-[#333] leading-[1.6] text-[17px] max-w-[540px] mb-6">{p.description}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {p.tech.map((t) => (
                    <span key={t} className="text-[11px] border border-[#c9c9c9] px-2.5 py-1 text-[#444]">
                      {t}
                    </span>
                  ))}
                </div>
                {p.link ? (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 w-fit rounded-full bg-ink text-cream px-5 py-3 text-sm font-semibold hover:bg-accent hover:text-cream transition-colors"
                  >
                    View Project
                    <ArrowUpRight
                      size={16}
                      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                  </a>
                ) : (
                  <span className="text-xs uppercase tracking-[0.08em] text-muted">
                    Client work · source confidential
                  </span>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
