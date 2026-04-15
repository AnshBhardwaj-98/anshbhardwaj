import { motion } from "framer-motion";

export const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <motion.h2
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="text-4xl md:text-5xl font-bold mb-12 bg-clip-text text-transparent bg-linear-to-r from-neonBlue to-neonPurple"
  >
    {children}
  </motion.h2>
);
