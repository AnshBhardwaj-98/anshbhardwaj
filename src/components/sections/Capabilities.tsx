import { useState } from "react";
import { capabilities } from "../../data";
import { RevealLines } from "../ui/Reveal";

export const Capabilities = () => {
  const [active, setActive] = useState(0);

  return (
    <section id="capabilities" className="relative py-[12vh] px-page bg-ink-2 overflow-x-clip">
      <span className="eyebrow text-muted mb-5">Capabilities</span>
      <h2 className="font-display font-semibold tracking-[-0.02em] text-[clamp(30px,4vw,60px)] mb-12">
        <RevealLines lines={["What I build."]} />
      </h2>

      <div className="flex flex-col lg:flex-row gap-2.5 lg:h-[600px]">
        {capabilities.map((c, i) => {
          const on = i === active;
          return (
            <div
              key={c.title}
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
              style={{ "--hue": c.hue } as React.CSSProperties}
              className={`relative overflow-hidden border cursor-pointer backdrop-blur-md transition-[flex-grow,border-color,background-color] duration-700 ease-out-expo lg:basis-0 min-w-0 ${
                on
                  ? "lg:grow-[6] border-(--hue) bg-[rgba(22,22,24,0.55)]"
                  : "lg:grow border-(--hue) lg:border-line bg-[rgba(19,19,21,0.35)]"
              }`}
            >
              <span
                className="absolute top-[18px] left-[18px] z-10 text-[11px] font-bold text-ink px-[7px] py-[3px]"
                style={{ background: c.hue }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Collapsed rail (desktop) */}
              <div
                className={`hidden lg:flex absolute inset-0 flex-col items-center pt-16 pb-8 transition-opacity duration-200 ${
                  on ? "opacity-0 pointer-events-none" : "opacity-100"
                }`}
              >
                <span
                  className="w-[52px] h-[52px] grid place-items-center"
                  style={{ background: c.hue + "22", color: c.hue }}
                >
                  <c.Icon size={24} />
                </span>
                <h3 className="mt-auto font-display text-xl font-semibold [writing-mode:vertical-rl] rotate-180 whitespace-nowrap">
                  {c.title}
                </h3>
              </div>

              {/* Expanded content */}
              <div
                className={`relative lg:absolute lg:inset-0 flex flex-col lg:flex-row lg:min-w-[720px] pt-[68px] px-6 lg:px-10 pb-8 lg:pb-10 transition-opacity duration-400 lg:delay-150 ${
                  on ? "lg:opacity-100" : "lg:opacity-0 lg:pointer-events-none"
                }`}
              >
                <div className="lg:w-[58%] flex flex-col">
                  <span
                    className="w-[50px] h-[50px] grid place-items-center mb-6"
                    style={{ background: c.hue + "22", color: c.hue }}
                  >
                    <c.Icon size={24} />
                  </span>
                  <h3 className="font-display font-semibold tracking-[-0.01em] text-[clamp(26px,2.6vw,40px)] mb-4">
                    {c.title}
                  </h3>
                  <p className="text-muted leading-[1.55] text-[15px] mb-6 max-w-[460px]">{c.desc}</p>
                  <p className="text-xs uppercase tracking-[0.08em] mb-4" style={{ color: c.hue }}>
                    Stack &amp; Tools
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {c.stack.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-2 border border-line bg-white/[0.03] px-3 py-1.5 text-[12.5px] text-[#d6d4cf] hover:-translate-y-0.5 hover:border-(--hue) transition"
                      >
                        <span className="text-[9px] font-bold" style={{ color: c.hue }}>
                          {s.slice(0, 2).toUpperCase()}
                        </span>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="hidden lg:flex lg:w-[42%] items-start justify-end">
                  <c.Icon size={220} strokeWidth={0.6} style={{ color: c.hue }} className="opacity-90" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
