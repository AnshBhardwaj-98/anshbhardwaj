import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Server,
  Layout,
  BrainCircuit,
  Terminal,
  Activity,
  Cpu,
  Database,
} from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";

/* ─── Neural-F1 Hybrid Taxonomy ──────────────────────────────────── */
const LAYERS = [
  {
    label: "INPUT / INTAKE",
    nodes: [
      {
        id: "lang",
        title: "LANGUAGES",
        Icon: Code2,
        color: "#bb0016",
        skills: ["Python", "JavaScript", "C++", "Java"],
        stat: "v-max",
      },
      {
        id: "tools",
        title: "DEV TOOLS",
        Icon: Terminal,
        color: "#f1c100",
        skills: ["Git", "Docker", "VS Code"],
        stat: "optimal",
      },
    ],
  },
  {
    label: "SYNAPSE / CORE",
    nodes: [
      {
        id: "ai",
        title: "AI ENGINE",
        Icon: BrainCircuit,
        color: "#000827",
        skills: [
          "PyTorch",
          "TensorFlow",
          "Hugging Face",
          "Scikit-learn",
          "NumPy",
          "Pandas",
        ],
        stat: "98.4%",
      },
      {
        id: "backend",
        title: "BACKEND",
        Icon: Server,
        color: "#000827",
        skills: ["FastAPI", "Node.js", "Express.js", "REST APIs"],
        stat: "active",
      },
      {
        id: "db",
        title: "DATABASES",
        Icon: Database,
        color: "#000827",
        skills: ["PostgreSQL", "MySQL", "MongoDB"],
        stat: "live",
      },
    ],
  },
  {
    label: "OUTPUT / AERO",
    nodes: [
      {
        id: "interface",
        title: "USER FLOW",
        Icon: Layout,
        color: "#bb0016",
        skills: ["React.js", "Next.js", "React Native"],
        stat: "peak",
      },
    ],
  },
];

interface Connection {
  from: string;
  to: string;
}

const CONNECTIONS: Connection[] = [];
for (let i = 0; i < LAYERS.length - 1; i++) {
  for (const src of LAYERS[i].nodes) {
    for (const tgt of LAYERS[i + 1].nodes) {
      CONNECTIONS.push({ from: src.id, to: tgt.id });
    }
  }
}

export const Skills = () => {
  const [hovered, setHovered] = useState<string | null>(null);
  const nodeRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const svgRef = useRef<SVGSVGElement | null>(null);
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
    const t = setTimeout(updatePositions, 100);
    window.addEventListener("resize", updatePositions);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", updatePositions);
    };
  }, [updatePositions]);

  const isEdgeActive = (c: Connection) =>
    hovered !== null && (hovered === c.from || hovered === c.to);

  return (
    <section
      id="skills"
      className="py-32 px-6 md:px-24 bg-surface-layered relative overflow-hidden"
    >
      {/* Technical Grid Overlay */}
      <div className="absolute inset-0 checkered-pattern opacity-[0.03] pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <SectionHeading align="left">
          Neural Telemetry / Technical Suite
        </SectionHeading>
        <div className="flex items-center gap-6 px-6 py-3 bg-chassis text-white rounded-none border-b-4 border-ignitionRed shadow-2xl">
          <Activity size={16} className="text-telemetryYellow animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">
            Processing Logic Stream
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start relative z-10">
        {/* Left: Neural Network Interactive */}
        <div className="lg:col-span-8 relative bg-surface-base p-12 shadow-2xl border-l-8 border-chassis overflow-hidden">
          {/* F1 Overlay markings */}
          <div className="absolute top-0 right-0 p-4 opacity-10 font-display font-black italic text-chassis uppercase text-xs select-none">
            Scale: 1:1 / Revision_B
          </div>

          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
          >
            {CONNECTIONS.map((conn, i) => {
              const f = positions[conn.from];
              const t = positions[conn.to];
              if (!f || !t) return null;
              const active = isEdgeActive(conn);
              return (
                <g key={i}>
                  <motion.line
                    x1={f.x}
                    y1={f.y}
                    x2={t.x}
                    y2={t.y}
                    stroke={active ? "#bb0016" : "#000827"}
                    strokeWidth={active ? 2 : 1}
                    strokeOpacity={active ? 1 : 0.04}
                    transition={{ duration: 0.3 }}
                  />
                  {active && (
                    <motion.circle
                      r={4}
                      fill="#bb0016"
                      animate={{
                        cx: [f.x, t.x],
                        cy: [f.y, t.y],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </g>
              );
            })}
          </svg>

          <div className="relative z-10 h-150 flex justify-between">
            {LAYERS.map((layer) => (
              <div
                key={layer.label}
                className="flex flex-col justify-around py-10 h-full w-1/3"
              >
                <div className="text-center">
                  <span className="text-[8px] font-black uppercase tracking-[0.4em] text-chassis/40 block mb-1">
                    {layer.label}
                  </span>
                </div>

                <div className="flex flex-col gap-10 items-center justify-center grow">
                  {layer.nodes.map((node) => {
                    const isHov = hovered === node.id;
                    return (
                      <div
                        key={node.id}
                        ref={(el) => {
                          nodeRefs.current[node.id] = el;
                        }}
                        onMouseEnter={() => setHovered(node.id)}
                        onMouseLeave={() => setHovered(null)}
                        className="relative"
                      >
                        {/* Neuron Rings */}
                        <div
                          className={`absolute inset-0 rounded-full border border-chassis/5 transition-all duration-500 ${isHov ? "scale-150 opacity-0" : "scale-110 opacity-100"}`}
                        />

                        <div
                          className={`group relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 cursor-crosshair border-2 ${isHov ? "bg-chassis border-ignitionRed shadow-[0_0_40px_rgba(187,0,22,0.2)] scale-110" : "bg-surface-layered border-chassis/10"}`}
                        >
                          <node.Icon
                            size={28}
                            className={
                              isHov ? "text-telemetryYellow" : "text-chassis/40"
                            }
                          />

                          {/* Skill Cloud */}
                          <AnimatePresence>
                            {isHov && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-52 pointer-events-none z-20"
                              >
                                <div className="bg-chassis text-white p-4 rounded-none border-t-4 border-telemetryYellow shadow-2xl relative">
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-chassis" />
                                  <div className="flex flex-wrap gap-2 justify-center">
                                    {node.skills.map((s) => (
                                      <span
                                        key={s}
                                        className="text-[8px] font-black uppercase tracking-widest text-telemetryYellow/80"
                                      >
                                        {s}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Data Readout Modules */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-chassis/40 mb-8 flex items-center gap-4">
            <Cpu size={14} /> Telemetry_Stack.v3
          </h3>

          <div className="space-y-2">
            {LAYERS.flatMap((l) => l.nodes).map((node) => (
              <motion.div
                key={node.id}
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
                animate={{
                  backgroundColor: hovered === node.id ? "#000827" : "#ececec",
                  x: hovered === node.id ? -10 : 0,
                }}
                className={`p-6 flex flex-col gap-4 border-l-4 transition-all duration-300 ${hovered === node.id ? "border-ignitionRed" : "border-telemetryYellow"}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4
                      className={`text-sm font-black uppercase italic tracking-tighter ${hovered === node.id ? "text-white" : "text-chassis"}`}
                    >
                      {node.title}
                    </h4>
                    <span
                      className={`text-[8px] font-bold uppercase tracking-widest ${hovered === node.id ? "text-telemetryYellow" : "text-chassis/40"}`}
                    >
                      Node_Pulse_{node.id.toUpperCase()}
                    </span>
                  </div>
                  <div
                    className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest ${hovered === node.id ? "bg-ignitionRed text-white" : "bg-chassis/5 text-chassis/60"}`}
                  >
                    {node.stat}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {node.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`px-3 py-1 text-[9px] font-bold uppercase tracking-wider ${hovered === node.id ? "bg-white/10 text-white border-white/20" : "bg-white text-chassis border-chassis/5"} border`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile fallback ── */}
      <div className="md:hidden mt-12 space-y-4">
        {LAYERS.flatMap((l) => l.nodes).map((node) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-surface-container p-6 rounded-none border-l-4 border-telemetryYellow shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <node.Icon size={18} className="text-chassis" />
                <h3 className="font-black text-sm uppercase italic tracking-tighter text-chassis">
                  {node.title}
                </h3>
              </div>
              <span className="text-[8px] font-black uppercase tracking-widest text-ignitionRed bg-chassis/5 px-2 py-1">
                {node.stat}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {node.skills.map((s) => (
                <span
                  key={s}
                  className="text-[9px] px-2 py-1 bg-surface-base border border-chassis/10 text-chassis/60 font-bold uppercase tracking-wider"
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
