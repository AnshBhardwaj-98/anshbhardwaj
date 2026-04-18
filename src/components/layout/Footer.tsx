import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Flag, Globe, Zap, Code2, Share2, Target } from "lucide-react";

export const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const socialLinks = [
    {
      label: "GITHUB",
      icon: Code2,
      href: "https://github.com/AnshBhardwaj-98",
      value: "REPO_ACCESS",
    },
    {
      label: "LINKEDIN",
      icon: Share2,
      href: "https://linkedin.com/in/divyanshbhardwaj001",
      value: "NETWORK_ID",
    },
    {
      label: "LEETCODE",
      icon: Target,
      href: "https://leetcode.com/u/itsanshbhardwaj/",
      value: "SIGNAL_OUT",
    },
    { label: "PORTFOLIO", icon: Globe, href: "#", value: "v4.2_LIVE" },
  ];

  return (
    <footer className="relative z-10 bg-surface-base border-t-12 border-chassis">
      {/* Visual Accents */}
      <div className="absolute inset-0 checkered-pattern opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 right-0 w-64 h-64 carbon-fiber opacity-[0.05] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-24 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          {/* Main Branding Block */}
          <div className="lg:col-span-6 space-y-12">
            <div className="flex items-start gap-8">
              <div className="w-24 h-24 bg-chassis text-white flex items-center justify-center rounded-none shadow-2xl relative group overflow-hidden">
                <div className="absolute inset-0 bg-ignitionRed translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <Flag
                  className="relative z-10 text-telemetryYellow group-hover:text-white transition-colors"
                  size={40}
                />
              </div>
              <div>
                <h2 className="text-5xl md:text-7xl font-black text-chassis tracking-tighter uppercase italic leading-[0.8] mb-4">
                  Ansh <br />
                  <span className="text-ignitionRed">Bhardwaj</span>
                </h2>
                <div className="flex items-center gap-4 text-chassis/40">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                    Sector_DB105
                  </span>
                  <div className="h-px w-12 bg-chassis/10" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                    F1_ENG_v4
                  </span>
                </div>
              </div>
            </div>

            <p className="text-chassis/60 text-lg font-display uppercase tracking-tight max-w-md leading-tight border-l-4 border-telemetryYellow pl-8 py-2">
              Architecting high-throughput{" "}
              <span className="text-chassis font-black italic">
                Generative AI systems
              </span>{" "}
              and intelligent automation pipelines. Engineered for maximum
              velocity and zero latency.
            </p>
          </div>

          {/* Social & Meta Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialLinks.map((item, i) => (
              <a
                key={i}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-8 bg-surface-container hover:bg-chassis transition-all duration-500 relative overflow-hidden"
              >
                {/* Background ID Tag */}
                <span className="absolute top-2 right-4 text-[7px] font-black text-chassis/10 group-hover:text-white/10 uppercase tracking-widest">
                  Link_Entry_0{i + 1}
                </span>

                <div className="flex items-center gap-6 mb-4">
                  <div className="p-3 bg-white shadow-sm group-hover:bg-ignitionRed transition-colors">
                    <item.icon
                      size={20}
                      className="text-chassis group-hover:text-white transition-colors"
                    />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-chassis/40 group-hover:text-white/40">
                    {item.label}
                  </h4>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-sm font-black text-chassis uppercase italic group-hover:text-telemetryYellow transition-colors">
                    {item.value}
                  </span>
                  <Zap
                    size={14}
                    className="text-ignitionRed opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Metadata Bar */}
        <div className="mt-32 pt-12 border-t border-chassis/5 flex flex-col md:flex-row justify-between items-end gap-10">
          <div className="space-y-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className={`w-6 h-1 ${i <= 4 ? "bg-chassis" : "bg-chassis/10"}`}
                />
              ))}
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-chassis/30">
              © {currentYear} DB105 // THE AERODYNAMIC EDGE // ALL SYSTEMS
              NOMINAL
            </p>
          </div>

          <div className="text-right">
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-ignitionRed block mb-2 italic">
              Maximum_Velocity_Protocol
            </span>
            <p className="text-xs font-black uppercase italic text-chassis">
              Built for the podium.
            </p>
          </div>
        </div>
      </div>

      {/* High-Performance Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-12 right-12 z-50 w-20 h-20 bg-ignitionRed text-white flex flex-col items-center justify-center hover:bg-chassis transition-all shadow-2xl group border-none rounded-none"
          >
            <ArrowUp
              size={24}
              className="group-hover:-translate-y-1 transition-transform mb-1"
            />
            <span className="text-[7px] font-black uppercase tracking-widest">
              TOP
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};
