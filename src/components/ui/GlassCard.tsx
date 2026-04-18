import { motion } from "framer-motion";

export const GlassCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
    className={`bg-surface-container relative overflow-hidden rounded-sm p-6 md:p-10 transition-all duration-300 hover:bg-surface-layered group ${className}`}
  >
    {/* Red racing stripe on hover */}
    <div className="absolute top-0 left-0 right-0 h-0.5 bg-ignitionRed scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
    
    <div className="relative z-10">
      {children}
    </div>
  </motion.div>
);
