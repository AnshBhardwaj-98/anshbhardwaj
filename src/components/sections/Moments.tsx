import { moments } from "../../data";
import { LoopVideo } from "../ui/LoopVideo";

// Football yard-line ticks under the heading, as on jjettas.com
const YARDS = [10, 20, 30, 40, 50, 40, 30, 20, 10];

export const Moments = () => (
  <section id="moments" className="relative bg-paper text-ink pt-[14vh] pb-[16vh] px-page overflow-x-clip">
    <h2 className="display text-center md:whitespace-nowrap text-[clamp(40px,12vw,240px)]">Signature Moments</h2>

    <div className="flex justify-between mt-6 mb-[10vh] border-t border-ink/20 pt-2" aria-hidden>
      {YARDS.map((y, i) => (
        <span key={i} className="display text-[clamp(14px,1.6vw,26px)] text-ink/35 relative">
          <span className="absolute left-1/2 -top-2 w-px h-3 bg-ink/30" />
          {y}
        </span>
      ))}
    </div>

    {/* Sticky card stack: each card pins a little lower than the last */}
    <div className="max-w-[1100px] mx-auto">
      {moments.map((m, i) => (
        <article
          key={m.title}
          className="sticky mb-[8vh] last:mb-0 bg-ink text-cream border border-line overflow-hidden"
          style={{ top: `calc(84px + ${i * 22}px)` }}
        >
          <LoopVideo src={m.video} className="opacity-55" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(14,14,14,0.9)_0%,rgba(14,14,14,0.35)_60%,rgba(14,14,14,0.15)_100%)]" />
          <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 p-8 md:p-12 min-h-[56vh]">
            <div>
              <span className="text-xs uppercase tracking-[0.12em] text-neon">
                {String(i + 1).padStart(2, "0")} · {m.tag}
              </span>
              <h3 className="display text-[clamp(48px,7vw,120px)] mt-4">{m.title}</h3>
            </div>
            <p className="text-sm uppercase tracking-[0.12em] text-muted md:text-right md:max-w-[320px]">{m.stat}</p>
          </div>
        </article>
      ))}
    </div>
  </section>
);
