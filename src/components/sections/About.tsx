import { motion } from "framer-motion";
import { Cpu, Rocket, Globe, ChevronRight } from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";

const focusAreas = [
  {
    icon: <Cpu className="text-ignitionRed" size={24} />,
    title: "AI Automation",
    desc: "Building internal tools that leverage LLMs to automate complex business workflows.",
  },
  {
    icon: <Rocket className="text-telemetryYellow" size={24} />,
    title: "Scalable Systems",
    desc: "Designing robust backends with FastAPI and Node.js that handle real-time data streaming.",
  },
  {
    icon: <Globe className="text-chassis" size={24} />,
    title: "Full-Stack Dev",
    desc: "Creating seamless user experiences with React and modern frontend architectures.",
  },
];

export const About = () => {
  return (
    <section id="about" className="py-32 px-6 md:px-24 bg-surface-base relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full carbon-fiber opacity-[0.05] pointer-events-none" />
      
      <SectionHeading align="left">Chassis & Philosophy</SectionHeading>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start relative z-10">
        {/* Story */}
        <div className="lg:col-span-7 space-y-12">
          <div className="space-y-8 text-xl md:text-2xl text-chassis font-display font-medium leading-[1.2] italic uppercase tracking-tight">
            <p>
              I am a <span className="text-ignitionRed font-black">Generative AI Engineer</span> at synergy labs, architecting the future of automated intelligence.
            </p>
            <p>
              Pursuing a B.Tech in CS with focus on <span className="underline decoration-telemetryYellow decoration-4 underline-offset-8">AI & Machine Learning</span>.
            </p>
            <p>
              My engineering philosophy is rooted in <span className="font-black italic">high-throughput execution</span> and minimalist architectural design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['10k+ Syncs', 'Real-time', 'Production Ready'].map((stat) => (
              <div key={stat} className="bg-surface-container p-6 rounded-none border-l-4 border-ignitionRed">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-chassis/40 block mb-2">Metric</span>
                <span className="text-lg font-black text-chassis uppercase italic">{stat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Areas */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-chassis/40 mb-6 block">Target Focus Areas</span>
          {focusAreas.map((area, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-surface-container p-8 flex items-center justify-between hover:bg-chassis hover:text-white transition-all duration-300 cursor-default"
            >
              <div className="flex items-center gap-6">
                <div className="p-3 bg-surface-base group-hover:bg-white/10 transition-colors">
                  {area.icon}
                </div>
                <h4 className="text-lg font-black uppercase italic tracking-tighter">{area.title}</h4>
              </div>
              <ChevronRight className="text-ignitionRed opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
