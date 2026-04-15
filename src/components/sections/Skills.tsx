import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Server,
  Layout,
  Database,
  BrainCircuit,
  Terminal,
} from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";

/* ─── Network topology ──────────────────────────────────────────── */
const LAYERS = [
  {
    label: "Input Layer",
    nodes: [
      {
        id: "lang",
        title: "Languages",
        Icon: Code2,
        color: "#00f3ff",
        skills: ["Python", "JavaScript (ES6+)", "C++", "Java"],
      },
      {
        id: "tools",
        title: "Developer Tools",
        Icon: Terminal,
        color: "#ff007f",
        skills: ["Git", "Docker", "VS Code"],
      },
      {
        id: "core",
        title: "Core CS",
        Icon: Code2,
        color: "#bc13fe",
        skills: ["Data Structures", "Algorithms", "OOP", "DBMS"],
      },
    ],
  },

  {
    label: "Hidden Layer",
    nodes: [
      {
        id: "frontend",
        title: "Frontend",
        Icon: Layout,
        color: "#00f3ff",
        skills: ["React.js", "Next.js", "React Native"],
      },
      {
        id: "backend",
        title: "Backend",
        Icon: Server,
        color: "#bc13fe",
        skills: ["FastAPI", "Node.js", "Express.js", "REST APIs", "JWT Auth"],
      },
      {
        id: "realtime",
        title: "Realtime Systems",
        Icon: Server,
        color: "#ff007f",
        skills: ["WebSockets", "Socket.IO", "SSE"],
      },
      {
        id: "api",
        title: "API Integration",
        Icon: Server,
        color: "#00f3ff",
        skills: ["GraphQL", "YouTube Data API", "Shopify API"],
      },
    ],
  },

  {
    label: "Output Layer",
    nodes: [
      {
        id: "ai",
        title: "AI & ML",
        Icon: BrainCircuit,
        color: "#ff007f",
        skills: [
          "PyTorch",
          "TensorFlow",
          "Hugging Face",
          "Scikit-learn",
          "NumPy",
          "Pandas",
        ],
      },
      {
        id: "genai",
        title: "Generative AI",
        Icon: BrainCircuit,
        color: "#00f3ff",
        skills: ["LLMs", "Stable Diffusion XL", "Prompt Engineering"],
      },
      {
        id: "data",
        title: "Databases",
        Icon: Database,
        color: "#bc13fe",
        skills: ["PostgreSQL", "MySQL", "MongoDB"],
      },
      {
        id: "pipeline",
        title: "Data Pipelines",
        Icon: Database,
        color: "#ff007f",
        skills: ["Pandas", "openpyxl", "SheetJS", "ETL"],
      },
    ],
  },
];

interface Connection {
  from: string;
  to: string;
}

const ALL_NODES = Object.fromEntries(
  LAYERS.flatMap((l) => l.nodes.map((n) => [n.id, n])),
);

// All adjacent-layer connections (2×2 + 2×2 = 8 edges)
const CONNECTIONS: Connection[] = [];
for (let i = 0; i < LAYERS.length - 1; i++) {
  for (const src of LAYERS[i].nodes) {
    for (const tgt of LAYERS[i + 1].nodes) {
      CONNECTIONS.push({ from: src.id, to: tgt.id });
    }
  }
}

// Stable pseudo-random weight from node pair
function edgeWeight(a: string, b: string): string {
  let h = 0;
  for (const c of `${a}→${b}`) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return (0.28 + (h % 65) / 100).toFixed(2);
}

/* ─── Component ─────────────────────────────────────────────────── */
export const Skills = () => {
  const [hovered, setHovered] = useState<string | null>(null);
  const nodeRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [positions, setPositions] = useState<{
    [key: string]: { x: number; y: number };
  }>({});

  const updatePositions = useCallback(() => {
    if (!svgRef.current) return;
    const sr = svgRef.current.getBoundingClientRect();
    const next: { [key: string]: { x: number; y: number } } = {};
    for (const [id, el] of Object.entries(nodeRefs.current)) {
      if (!el) continue;
      const r = el.getBoundingClientRect();
      next[id] = {
        x: r.left - sr.left + r.width / 2,
        y: r.top - sr.top + r.height / 2,
      };
    }
    setPositions(next);
  }, []);

  useEffect(() => {
    updatePositions();
    const t = setTimeout(updatePositions, 150);
    window.addEventListener("resize", updatePositions);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", updatePositions);
    };
  }, [updatePositions]);

  // Nodes connected to hovered
  const connected = hovered
    ? new Set(
        CONNECTIONS.flatMap((c) =>
          c.from === hovered ? [c.to] : c.to === hovered ? [c.from] : [],
        ),
      )
    : new Set();

  const isDimmed = (id: string) =>
    hovered !== null && hovered !== id && !connected.has(id);
  const isEdgeActive = (c: Connection) =>
    hovered !== null && (hovered === c.from || hovered === c.to);

  return (
    <section
      id="skills"
      className="pt-32 pb-4 px-6 md:px-20 max-w-400 mx-auto relative z-10 overflow-visible"
    >
      <SectionHeading>Technical Arsenal</SectionHeading>

      {/* ── Sublabel ── */}
      <p className="hidden md:block text-center text-[10px] uppercase tracking-[0.4em] text-white/25 font-bold -mt-4 mb-16">
        Skill Architecture
      </p>

      {/* ── Desktop: Neural Network ── */}
      <div
        ref={containerRef}
        className="relative hidden md:flex items-center justify-between"
        style={{ minHeight: 480, paddingBottom: "9rem" }}
      >
        {/* SVG edges */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
        >
          <defs>
            <filter
              id="pulse-glow"
              x="-80%"
              y="-80%"
              width="260%"
              height="260%"
            >
              <feGaussianBlur stdDeviation="3.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="edge-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {CONNECTIONS.map((conn, i) => {
            const f = positions[conn.from];
            const t = positions[conn.to];
            if (!f || !t) return null;

            const active = isEdgeActive(conn);
            const color = ALL_NODES[conn.from].color;
            const w = edgeWeight(conn.from, conn.to);
            const mx = (f.x + t.x) / 2;
            const my = (f.y + t.y) / 2;

            return (
              <g key={`${conn.from}-${conn.to}`}>
                {/* Glow halo on active edge */}
                {active && (
                  <line
                    x1={f.x}
                    y1={f.y}
                    x2={t.x}
                    y2={t.y}
                    stroke={color}
                    strokeWidth={10}
                    strokeOpacity={0.1}
                    filter="url(#edge-glow)"
                  />
                )}

                {/* Base edge line */}
                <motion.line
                  x1={f.x}
                  y1={f.y}
                  x2={t.x}
                  y2={t.y}
                  stroke={active ? color : "rgba(255,255,255,0.07)"}
                  strokeWidth={active ? 1.6 : 0.6}
                  animate={{
                    stroke: active ? color : "rgba(255,255,255,0.07)",
                    strokeWidth: active ? 1.6 : 0.6,
                  }}
                  transition={{ duration: 0.2 }}
                />

                {/* Weight label */}
                <motion.text
                  x={mx}
                  y={my - 8}
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="'Courier New', monospace"
                  animate={{
                    fill: active ? color : "rgba(255,255,255,0.1)",
                    opacity: active ? 0.85 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  w={w}
                </motion.text>

                {/* Ambient slow particle */}
                {!active && (
                  <motion.circle
                    r={1}
                    fill="rgba(255,255,255,0.2)"
                    animate={{
                      cx: [f.x, t.x],
                      cy: [f.y, t.y],
                      opacity: [0, 0.2, 0],
                    }}
                    transition={{
                      duration: 5 + i * 0.55,
                      repeat: Infinity,
                      delay: i * 0.45,
                      ease: "linear",
                    }}
                  />
                )}

                {/* Active signal pulses (3 staggered) */}
                {active &&
                  [0, 0.28, 0.56].map((delay, pi) => (
                    <motion.circle
                      key={pi}
                      r={3.5}
                      fill={color}
                      filter="url(#pulse-glow)"
                      animate={{
                        cx: [f.x, t.x],
                        cy: [f.y, t.y],
                        opacity: [0, 1, 1, 0],
                        scale: [0.6, 1, 1, 0.6],
                      }}
                      transition={{
                        duration: 0.65,
                        repeat: Infinity,
                        delay,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
              </g>
            );
          })}
        </svg>

        {/* Layer columns */}
        {LAYERS.map((layer) => (
          <div
            key={layer.label}
            className="flex-1 flex flex-col items-center gap-20 z-10 relative"
            style={{ paddingTop: "2.5rem" }}
          >
            {/* Layer label + tick */}
            <div className="absolute top-0 left-0 right-0 flex flex-col items-center gap-1">
              <span className="text-[9px] uppercase tracking-[0.45em] text-white/25 font-bold">
                {layer.label}
              </span>
              <div className="w-6 h-px bg-white/10" />
            </div>

            {/* Neurons */}
            {layer.nodes.map((node) => {
              const isHov = hovered === node.id;
              const dim = isDimmed(node.id);

              return (
                <div
                  key={node.id}
                  className="relative select-none"
                  ref={(el) => {
                    nodeRefs.current[node.id] = el;
                  }}
                  onMouseEnter={() => setHovered(node.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Skill cloud */}
                  <AnimatePresence>
                    {isHov && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                      >
                        {node.skills.map((s, i) => {
                          const total = node.skills.length;
                          const angle = (i / total) * Math.PI * 2; // full circle
                          const radius = 90; // distance from center

                          const x = Math.cos(angle) * radius;
                          const y = Math.sin(angle) * radius;

                          return (
                            <motion.span
                              key={s}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                                x,
                                y,
                              }}
                              exit={{ opacity: 0, scale: 0 }}
                              transition={{
                                delay: i * 0.05,
                                type: "spring",
                                stiffness: 200,
                              }}
                              className="absolute text-[11px] px-3 py-1 rounded-full font-mono"
                              style={{
                                background: "rgba(0,0,0,0.9)",
                                border: `1px solid ${node.color}50`,
                                color: node.color,
                                backdropFilter: "blur(8px)",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {s}
                            </motion.span>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {/* Ripple rings */}
                  {isHov && (
                    <>
                      {[
                        { s: 2.4, d: 0 },
                        { s: 3, d: 0.45 },
                      ].map(({ s, d }, ri) => (
                        <motion.div
                          key={ri}
                          className="absolute inset-0 rounded-full pointer-events-none"
                          style={{
                            border: `1.5px solid ${node.color}70`,
                          }}
                          animate={{ scale: [1, s], opacity: [0.7, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: d,
                            ease: "easeOut",
                          }}
                        />
                      ))}
                    </>
                  )}

                  {/* Neuron body */}
                  <motion.div
                    className="relative w-19.5 h-19.5 rounded-full flex items-center justify-center cursor-pointer overflow-hidden"
                    style={{
                      background: "rgba(0,0,0,0.82)",
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                      border: `2px solid ${isHov ? node.color : "rgba(255,255,255,0.13)"}`,
                      boxShadow: isHov
                        ? `0 0 42px ${node.color}50, 0 0 14px ${node.color}25, inset 0 0 22px ${node.color}12`
                        : "none",
                      transition: "border-color 0.25s, box-shadow 0.25s",
                    }}
                    animate={{
                      opacity: dim ? 0.13 : 1,
                      scale: isHov ? 1.1 : 1,
                    }}
                    transition={{
                      duration: 0.25,
                      type: "spring",
                      stiffness: 280,
                    }}
                  >
                    {/* Inner radial glow */}
                    {isHov && (
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `radial-gradient(circle at center, ${node.color}30, transparent 70%)`,
                        }}
                      />
                    )}
                    <node.Icon
                      size={28}
                      color={
                        isHov
                          ? node.color
                          : dim
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(255,255,255,0.55)"
                      }
                    />
                  </motion.div>

                  {/* Node label */}
                  <motion.p
                    className="mt-3 text-center text-[10px] font-bold uppercase tracking-widest"
                    animate={{
                      color: isHov
                        ? node.color
                        : dim
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(255,255,255,0.38)",
                    }}
                    transition={{ duration: 0.25 }}
                  >
                    {node.title}
                  </motion.p>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* ── Mobile fallback ── */}
      <div className="md:hidden mt-12 space-y-4">
        {LAYERS.flatMap((l) => l.nodes).map((node) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-lg"
          >
            <div className="flex items-center gap-3 mb-3">
              <node.Icon size={18} color={node.color} />
              <h3
                className="font-bold text-sm uppercase tracking-wider"
                style={{ color: node.color }}
              >
                {node.title}
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {node.skills.map((s) => (
                <span
                  key={s}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 border border-white/10 text-gray-400 font-mono"
                >
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
