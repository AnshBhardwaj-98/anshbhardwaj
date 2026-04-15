import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Cpu, Rocket, Globe } from "lucide-react";
import { SectionHeading } from "../ui/SectionHeading";
import { GlassCard } from "../ui/GlassCard";

const personalInfo = [
  // { icon: <MapPin className="text-neonBlue" size={20} />, text: "Gurugram, Haryana" },
  {
    icon: <Mail className="text-neonPurple" size={20} />,
    text: "divyanshbhardwaj105@gmail.com",
  },
  // { icon: <Phone className="text-neonPink" size={20} />, text: "+91 9310056643" },
];

const focusAreas = [
  {
    icon: <Cpu className="text-neonBlue" size={24} />,
    title: "AI Automation",
    desc: "Building internal tools that leverage LLMs to automate complex business workflows.",
  },
  {
    icon: <Rocket className="text-neonPurple" size={24} />,
    title: "Scalable Systems",
    desc: "Designing robust backends with FastAPI and Node.js that handle real-time data streaming.",
  },
  {
    icon: <Globe className="text-neonPink" size={24} />,
    title: "Full-Stack Dev",
    desc: "Creating seamless user experiences with React and modern frontend architectures.",
  },
];

export const About = () => {
  return (
    <section
      id="about"
      className="py-24 px-6 md:px-20 max-w-7xl mx-auto relative z-10"
    >
      <SectionHeading>About Me</SectionHeading>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Narrative */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 space-y-8"
        >
          <GlassCard className="p-8! border-white/5">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              The Journey <span className="w-12 h-px bg-neonBlue/50" />
            </h3>
            <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
              <p>
                I am a{" "}
                <span className="text-white font-semibold">
                  Generative AI Engineer
                </span>{" "}
                at
                <span className="text-neonPink font-bold"> Synergy Labs</span>,
                where I bridge the gap between complex AI research and
                practical, high-impact business solutions. My daily focus is on
                architecting internal automation tools that redefine how teams
                operate.
              </p>
              <p>
                Currently pursuing a B.Tech in Computer Science with a
                specialization in
                <span className="text-neonBlue"> AI & Machine Learning</span>,
                I've developed a deep obsession with building systems that are
                not just functional, but intelligently automated.
              </p>
              <p>
                Whether it's fine-tuning LLMs, engineering real-time data
                pipelines, or crafting slick React interfaces, I thrive at the
                intersection of{" "}
                <span className="italic">logic and creativity</span>.
              </p>
            </div>

            {/* Contact Grid inside About Card */}
            <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {personalInfo.map((info, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors cursor-default"
                >
                  {info.icon}
                  <span>{info.text}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Right Column: Focus Areas */}
        <div className="lg:col-span-5 space-y-6">
          {focusAreas.map((area, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <GlassCard className="group hover:border-white/20 transition-all duration-300">
                <div className="flex gap-4">
                  <div className="p-3 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">
                    {area.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">
                      {area.title}
                    </h4>
                    <p className="text-gray-400 leading-snug">{area.desc}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}

          {/* Impact Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl bg-linear-to-r from-neonBlue/10 to-neonPurple/10 border border-white/5 flex items-center justify-between"
          >
            <div>
              <p className="text-2xl font-black text-white">AI-First</p>
              <p className="text-xs text-gray-400 uppercase tracking-widest leading-tight">
                Automation
                <br />
                Mindset
              </p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <p className="text-2xl font-black text-white">Scale</p>
              <p className="text-xs text-gray-400 uppercase tracking-widest leading-tight">
                1000s of
                <br />
                Syncs / Day
              </p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="text-right">
              <p className="text-2xl font-black text-white">FastAPI</p>
              <p className="text-xs text-gray-400 uppercase tracking-widest leading-tight">
                High Perf.
                <br />
                Backend
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
