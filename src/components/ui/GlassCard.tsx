import { motion } from "framer-motion";

export const GlassCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className={`bg-glass backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 shadow-glass hover:border-white/20 transition-all duration-300 ${className}`}
  >
    {children}
  </motion.div>
);
