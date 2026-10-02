import { motion } from "framer-motion";

// Masked line-by-line slide-up used for the big headings
export const RevealLines = ({
  lines,
  accent,
  className = "",
}: {
  lines: string[];
  accent?: number; // index of the line drawn in neon
  className?: string;
}) => (
  <span className={className}>
    {lines.map((line, i) => (
      <span key={i} className="block overflow-hidden pb-[0.04em]">
        <motion.span
          className={`inline-block ${i === accent ? "text-neon" : ""}`}
          initial={{ y: "105%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          {line}
        </motion.span>
      </span>
    ))}
  </span>
);
