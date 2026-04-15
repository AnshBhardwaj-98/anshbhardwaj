import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Share2, Mail, ArrowUp } from "lucide-react";

export const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    {
      icon: Code2,
      href: "https://github.com/yourusername",
      label: "GitHub",
      color: "hover:text-neonBlue",
      glow: "hover:shadow-neonBlue/50",
    },
    {
      icon: Share2,
      href: "https://linkedin.com/in/yourusername",
      label: "LinkedIn",
      color: "hover:text-neonPurple",
      glow: "hover:shadow-neonPurple/50",
    },
    {
      icon: Mail,
      href: "mailto:your.email@example.com",
      label: "Email",
      color: "hover:text-neonPink",
      glow: "hover:shadow-neonPink/50",
    },
    // Optional: LeetCode / Twitter – replace or add as needed
    // {
    //   icon: Code2,
    //   href: "https://leetcode.com/yourusername",
    //   label: "LeetCode",
    //   color: "hover:text-yellow-400",
    //   glow: "hover:shadow-yellow-400/50"
    // },
  ];

  return (
    <footer className="relative z-10 mt-24">
      {/* Gradient top border */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-neonBlue/50 to-transparent" />

      <div className="bg-black/40 backdrop-blur-xl border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-20 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Brand */}
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold bg-linear-to-r from-white to-white/70 bg-clip-text text-transparent">
                ANSHBHARDWAJ.COM
              </h2>
              <p className="text-gray-400 text-sm mt-2 max-w-xs">
                Building scalable tools & AI applications.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex gap-6">
              {socialLinks.map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`text-gray-400 transition-all duration-300 ${social.color} hover:scale-110 hover:-translate-y-1`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon size={24} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Bottom row: copyright + small details */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-10 pt-6 border-t border-white/10 text-xs text-gray-500">
            <p>© {currentYear} Ansh Bhardwaj / Divyansh Bhardwaj</p>
            <p className="flex items-center gap-1 text-neonPink">
              {/* Made with <Heart size={12} className="text-neonPink" />
              and <Coffee size={12} className="text-neonBlue" /> in India */}
              All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-linear-to-br from-neonBlue to-neonPurple text-white shadow-lg flex items-center justify-center hover:shadow-neonBlue/50 transition-all duration-300 group"
            aria-label="Back to top"
          >
            <ArrowUp
              size={20}
              className="group-hover:-translate-y-0.5 transition-transform"
            />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};
