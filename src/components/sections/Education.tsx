import { ArrowUpRight } from "lucide-react";

const coursework = ["Advanced AI", "Deep Learning", "System Architecture", "Robotics"];

export const Education = () => (
  <section id="education" className="bg-paper text-ink py-[14vh] px-page border-t border-[#d6d6d6]">
    <span className="eyebrow text-[#111] mb-[6vh]">Education</span>
    <blockquote className="font-display leading-[1.05] tracking-[-0.02em] text-[clamp(28px,3.6vw,58px)] max-w-[1200px]">
      B.Tech in Computer Science, specialising in Artificial Intelligence &amp; Machine Learning.
    </blockquote>

    <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-[50px] mt-[7vh] items-start">
      <div>
        <p className="text-[#333] leading-[1.6] text-[17px] mb-6 max-w-[640px]">
          Sharda University, Greater Noida. Coursework spanning modern AI, deep learning, systems design and
          robotics, alongside hands-on industry work in generative AI.
        </p>
        <div className="flex flex-wrap gap-2">
          {coursework.map((c) => (
            <span key={c} className="text-[11px] border border-[#c9c9c9] px-2.5 py-1 text-[#444]">
              {c}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-start md:items-end gap-4">
        <span className="border border-ink px-3 py-1.5 text-[11px]">Class of 2026</span>
        <span className="text-[#666] text-xs">Sharda University · India</span>
        <span className="font-display leading-[0.9] tracking-[-0.03em] text-[clamp(48px,6vw,90px)]">2026</span>
        <a
          href="https://maps.google.com/?q=Sharda+University+Greater+Noida"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-8 border-b border-ink pb-2 text-sm font-semibold hover:gap-10 transition-all"
        >
          View campus <ArrowUpRight size={16} />
        </a>
      </div>
    </div>
  </section>
);
