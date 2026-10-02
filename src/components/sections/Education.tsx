import { ArrowUpRight } from "lucide-react";
import { education } from "../../data";

const highlights = [
  `CGPA ${education.cgpa}`,
  "Amazon ML Challenge 2025 · Top 983",
  "Amazon ML Challenge 2024 · Top 1192",
  "LeetCode · 355+ solved",
];

export const Education = () => (
  <section id="education" className="bg-paper text-ink py-[14vh] px-page border-t border-line">
    <span className="eyebrow text-ink mb-[6vh]">Education</span>
    <blockquote className="font-display leading-[1.05] tracking-[-0.02em] text-[clamp(28px,3.6vw,58px)] max-w-[1200px]">
      {education.degree}.
    </blockquote>

    <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-[50px] mt-[7vh] items-start">
      <div>
        <p className="text-ink/75 leading-[1.6] text-[17px] mb-6 max-w-[640px]">
          {education.school}, {education.place}. Alongside the degree: three engineering internships shipping LLM
          pipelines, multi-tenant backends and full-stack products, plus competitive ML and problem solving.
        </p>
        <div className="flex flex-wrap gap-2">
          {highlights.map((h) => (
            <span key={h} className="text-[11px] border border-hairline px-2.5 py-1 text-ink/70">
              {h}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-start md:items-end gap-4">
        <span className="border border-ink px-3 py-1.5 text-[11px]">{education.period}</span>
        <span className="text-muted text-xs">
          {education.school} · {education.place}
        </span>
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
