import { motion } from "framer-motion";

export const SectionHeading = ({ children, align = "left" }: { children: React.ReactNode, align?: "left" | "center" | "right" }) => (
  <div className={`overflow-hidden mb-20 ${align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left"}`}>
    <motion.h2
      initial={{ y: "100%" }}
      whileInView={{ y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
      className="text-4xl md:text-7xl font-black text-chassis uppercase tracking-tight leading-[0.9]"
    >
      {children}
    </motion.h2>
    <div className={`h-1 w-20 bg-ignitionRed mt-4 ${align === "center" ? "mx-auto" : align === "right" ? "ml-auto" : ""}`} />
  </div>
);
