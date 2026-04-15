import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  User,
  Code2,
  FolderCode,
  Briefcase,
  GraduationCap,
  Mail,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { id: "hero", label: "Home", icon: <Home size={20} /> },
  { id: "about", label: "About", icon: <User size={20} /> },
  { id: "skills", label: "Skills", icon: <Code2 size={20} /> },
  { id: "projects", label: "Projects", icon: <FolderCode size={20} /> },
  { id: "experience", label: "Experience", icon: <Briefcase size={20} /> },
  { id: "education", label: "Education", icon: <GraduationCap size={20} /> },
  { id: "contact-form", label: "Contact", icon: <Mail size={20} /> },
];

export const Navbar = () => {
  const [activeSection, setActiveSection] = useState("hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for active section detection
  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);
    if (sections.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-20% 0px -20% 0px" },
    );

    sections.forEach((section) => {
      if (section) observerRef.current?.observe(section);
    });

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsMobileMenuOpen(false);
    }
  };

  // Desktop navigation (fixed left sidebar)
  const DesktopNav = () => (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
      {navItems.map((item) => {
        const isActive = activeSection === item.id;
        return (
          <div key={item.id} className="group relative flex items-center">
            {/* Tooltip */}
            <div className="absolute left-full ml-4 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg text-white text-xs font-medium whitespace-nowrap opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none shadow-lg">
              {item.label}
            </div>

            {/* Nav Button */}
            <button
              onClick={() => scrollToSection(item.id)}
              className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 border backdrop-blur-sm ${
                isActive
                  ? "bg-neonBlue/20 border-neonBlue text-neonBlue shadow-[0_0_12px_#00f3ff]"
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/30 hover:text-white"
              }`}
              aria-label={`Navigate to ${item.label}`}
            >
              {item.icon}
              {/* Active dot indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeDot"
                  className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-neonBlue shadow-[0_0_8px_#00f3ff]"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );

  // Mobile Hamburger Menu
  const MobileNav = () => (
    <div className="lg:hidden fixed top-4 right-4 z-50">
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              ref={menuRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-64 bg-black/80 backdrop-blur-xl border-l border-white/20 z-50 shadow-2xl"
            >
              <div className="flex justify-end p-4">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-lg bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-2 px-4">
                {navItems.map((item, idx) => {
                  const isActive = activeSection === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => scrollToSection(item.id)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-neonBlue/20 text-neonBlue border border-neonBlue/50 shadow-neon"
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="mobileActiveDot"
                          className="ml-auto w-2 h-2 rounded-full bg-neonBlue shadow-[0_0_6px_#00f3ff]"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  );
};
