import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import {
  Home,
  User,
  Code2,
  FolderCode,
  Briefcase,
  Mail,
  Menu,
  X,
  Gauge,
} from "lucide-react";

const navItems = [
  { id: "hero", label: "01 / PITS", icon: <Home size={18} /> },
  { id: "about", label: "02 / CHASSIS", icon: <User size={18} /> },
  { id: "skills", label: "03 / TELEMETRY", icon: <Code2 size={18} /> },
  { id: "projects", label: "04 / CIRCUIT", icon: <FolderCode size={18} /> },
  { id: "experience", label: "05 / PADDOCK", icon: <Briefcase size={18} /> },
  { id: "contact-form", label: "06 / RADIO", icon: <Mail size={18} /> },
];

export const Navbar = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    const diff = current - previous;

    // Show navbar if scrolling up or at the very top
    if (current < 50) {
      setVisible(true);
    } else if (diff > 0) {
      // Scrolling down
      setVisible(false);
    } else {
      // Scrolling up
      setVisible(true);
    }
  });

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    // Store intersection ratios for all sections
    const ratios: Record<string, number> = {};

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios[entry.target.id] = entry.intersectionRatio;
        });

        // Find the section with the highest intersection ratio
        let maxRatio = 0;
        let activeId = activeSection;

        for (const [id, ratio] of Object.entries(ratios)) {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            activeId = id;
          }
        }

        // Only update if we have a clear winner with sufficient visibility
        if (maxRatio > 0.1) {
          setActiveSection(activeId);
        }
      },
      {
        // More granular thresholds for smoother transition detection
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: "-10% 0px -10% 0px",
      },
    );

    sections.forEach((section) => section && observer.observe(section));

    return () => observer.disconnect();
  }, [activeSection]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Floating Nav */}
      <motion.nav
        initial={{ y: 0, x: "-50%", opacity: 1 }}
        animate={{
          y: visible ? 0 : -150,
          opacity: visible ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
        className="fixed top-8 left-1/2 z-50 w-[95%] max-w-5xl"
      >
        <div className="bg-chassis/80 backdrop-blur-xl border-t border-white/10 px-8 py-4 flex items-center justify-between rounded-sm aero-shadow">
          <div
            className="flex items-center gap-4 group cursor-pointer"
            onClick={() => scrollToSection("hero")}
          >
            <div className="bg-ignitionRed p-2 rounded-sm rotate-45 group-hover:rotate-0 transition-transform duration-500 shadow-lg shadow-ignitionRed/20">
              <Gauge
                className="text-white -rotate-45 group-hover:rotate-0 transition-transform duration-500"
                size={18}
              />
            </div>
            <span className="text-white font-display font-black uppercase tracking-widest text-xs hidden md:block italic">
              Ansh Bhardwaj / DB105
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative group ${isActive ? "text-white" : "text-white/40 hover:text-white"}`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-ignitionRed"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <button
            className="lg:hidden text-white"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Refactored */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-100 bg-chassis p-10 flex flex-col justify-center gap-8"
          >
            <button
              className="absolute top-10 right-10 text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={32} />
            </button>
            {navItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-4xl md:text-6xl font-display font-black text-white uppercase italic tracking-tighter hover:text-ignitionRed transition-colors text-left"
              >
                <span className="text-lg text-ignitionRed mr-6 italic">
                  0{idx + 1}
                </span>{" "}
                {item.label.split(" / ")[1]}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
