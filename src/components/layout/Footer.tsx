import { ArrowUpRight } from "lucide-react";
import { capabilities, navItems, profile, projects } from "../../data";

const techStack = [...new Set(capabilities.flatMap((c) => c.stack))];

const Col = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <p className="flex items-center gap-2.5 text-muted text-xs uppercase tracking-[0.08em] pb-[18px] border-b border-hairline mb-3">
      <span className="w-2 h-2 bg-neon" /> {title}
    </p>
    {children}
  </div>
);

const linkCls =
  "block text-xs text-[#cfcfcf] px-1.5 py-[7px] transition-[background-color,color,padding] duration-300 hover:bg-neon hover:text-ink hover:pl-3.5";

export const Footer = ({ onResume }: { onResume: () => void }) => (
  <footer className="relative bg-ink pt-[20vh] pb-11 px-page min-h-[96vh] flex items-end">
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-[60px] pb-[6vh]">
        <div>
          <p className="font-display font-bold text-[22px] tracking-tight">{profile.name}</p>
          <p className="text-muted mt-6 text-sm">{profile.role}</p>
          <div className="flex flex-col items-start gap-1 mt-6">
            {[
              { label: "GitHub", href: profile.github },
              { label: "LinkedIn", href: profile.linkedin },
              { label: "LeetCode", href: profile.leetcode },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm px-2 py-1 -ml-2 transition hover:bg-neon hover:text-ink hover:translate-x-1.5"
              >
                {l.label} <ArrowUpRight size={14} />
              </a>
            ))}
            <button
              onClick={onResume}
              className="inline-flex items-center gap-2 text-sm px-2 py-1 -ml-2 transition hover:bg-neon hover:text-ink hover:translate-x-1.5"
            >
              Résumé <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[30px]">
          <Col title="Navigate">
            {navItems.map((n) => (
              <a key={n.id} href={`#${n.id}`} className={linkCls}>
                {n.label}
              </a>
            ))}
          </Col>
          <Col title="Focus">
            {capabilities.map((c) => (
              <a key={c.title} href="#capabilities" className={linkCls}>
                {c.title}
              </a>
            ))}
          </Col>
          <Col title="Projects">
            {projects.map((p) => (
              <a key={p.title} href={p.link} target="_blank" rel="noopener noreferrer" className={linkCls}>
                {p.title}
              </a>
            ))}
          </Col>
          <Col title="Tech Stack">
            <div className="flex flex-wrap gap-[7px]">
              {techStack.map((t) => (
                <span
                  key={t}
                  className="text-[11px] text-[#cfcfcf] border border-line bg-white/[0.03] px-[9px] py-[5px] rounded-full hover:border-neon hover:text-neon transition-colors"
                >
                  {t}
                </span>
              ))}
            </div>
          </Col>
        </div>
      </div>

      {/* Wordmark */}
      <p
        aria-hidden
        className="display text-[22vw] whitespace-nowrap mt-[12vh] mb-5 -ml-[0.04em]"
      >
        Divyansh<span className="text-neon">.</span>
      </p>

      <div className="flex flex-col sm:flex-row justify-between gap-3 border-t border-hairline pt-5 text-xs text-muted-2">
        <span>{profile.role}</span>
        <span>
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </span>
      </div>
    </div>
  </footer>
);
