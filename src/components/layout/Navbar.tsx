import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText } from "lucide-react";
import { useLenis } from "lenis/react";
import { navItems, profile } from "../../data";
import { GithubIcon, LinkedinIcon } from "../ui/BrandIcons";

export const Navbar = ({ onResume }: { onResume: () => void }) => {
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight whichever section crosses the middle of the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Lock page scroll behind the mobile menu
  const lenis = useLenis();
  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
  }, [open, lenis]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 h-16 px-page flex items-center justify-center transition-colors duration-300 ${
          scrolled ? "bg-cream/85 backdrop-blur-md border-b border-line" : ""
        }`}
      >
        <div className="w-full max-w-[1380px] flex items-center justify-between gap-6">
          <a
            href="#hero"
            className="font-display font-bold text-lg tracking-tight hover:opacity-65 transition-opacity whitespace-nowrap"
          >
            {profile.name}
          </a>

          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.06em] transition-colors duration-200 ${
                  active === id ? "bg-ink text-cream" : "hover:bg-ink hover:text-cream"
                }`}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {[
              { href: profile.github, Icon: GithubIcon, label: "GitHub" },
              { href: profile.linkedin, Icon: LinkedinIcon, label: "LinkedIn" },
            ].map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full grid place-items-center hover:bg-ink hover:text-cream transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
            <button
              onClick={onResume}
              className={`ml-1 inline-flex items-center gap-2 rounded-full bg-accent text-cream px-4 py-2 text-xs font-semibold uppercase tracking-[0.06em] hover:-translate-y-px hover:brightness-105 transition`}
            >
              <FileText size={14} /> Résumé
            </button>
          </div>

          <button
            className="md:hidden flex flex-col gap-[5px] w-[30px] p-1.5 relative z-[60]"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`block h-0.5 w-full bg-current transition duration-300 ${
                  open && i === 0 ? "translate-y-[7px] rotate-45" : ""
                } ${open && i === 1 ? "opacity-0" : ""} ${open && i === 2 ? "-translate-y-[7px] -rotate-45" : ""}`}
              />
            ))}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] bg-cream px-page pt-24 pb-10 flex flex-col justify-between"
          >
            <span className="eyebrow text-muted">Menu</span>
            <nav className="flex flex-col items-center gap-2">
              {navItems.map(({ id, label }, i) => (
                <motion.a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => {
                    // Lenis ignores scrolls while stopped, so restart it before jumping
                    e.preventDefault();
                    setOpen(false);
                    lenis?.start();
                    lenis?.scrollTo(`#${id}`);
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="display text-[clamp(64px,18vw,140px)] text-center hover:text-accent transition-colors"
                >
                  <span className="font-sans text-xs text-muted-2 align-top mr-2">0{i + 1}</span>
                  {label}
                </motion.a>
              ))}
            </nav>
            <div className="flex gap-6 text-muted border-t border-hairline pt-5 text-sm">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-accent"
              >
                <GithubIcon /> GitHub
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-accent"
              >
                <LinkedinIcon /> LinkedIn
              </a>
              <button
                onClick={() => {
                  setOpen(false);
                  onResume();
                }}
                className="inline-flex items-center gap-2 hover:text-accent"
              >
                <FileText size={16} /> Résumé
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
