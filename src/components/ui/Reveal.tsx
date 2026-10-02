import { motion } from "framer-motion";

const line = {
  hidden: { y: "105%" },
  show: (i: number) => ({ y: 0, transition: { duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const } }),
};

// Masked line-by-line slide-up used for the big headings.
// The in-view check sits on the wrapper: each line starts fully hidden under its overflow mask,
// so observing the lines themselves would never report them as visible.
export const RevealLines = ({
  lines,
  accent,
  className = "",
}: {
  lines: string[];
  accent?: number; // index of the line drawn in the accent colour
  className?: string;
}) => (
  <motion.span className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-10%" }}>
    {lines.map((text, i) => (
      <span key={i} className="block overflow-hidden pb-[0.04em]">
        <motion.span className={`inline-block ${i === accent ? "text-accent" : ""}`} variants={line} custom={i}>
          {text}
        </motion.span>
      </span>
    ))}
  </motion.span>
);
