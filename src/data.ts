import { BrainCircuit, Server, Layout, Database, type LucideIcon } from "lucide-react";

export const profile = {
  name: "Divyansh Bhardwaj",
  role: "Generative AI Engineer",
  email: "contact@anshbhardwaj.com",
  location: "NCR, India",
  github: "https://github.com/AnshBhardwaj-98",
  linkedin: "https://linkedin.com/in/divyanshbhardwaj001",
  leetcode: "https://leetcode.com/u/itsanshbhardwaj/",
};

export const navItems = [
  { id: "hero", label: "Home" },
  { id: "capabilities", label: "About" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
];

export type Capability = {
  title: string;
  desc: string;
  Icon: LucideIcon;
  hue: string;
  stack: string[];
};

export const capabilities: Capability[] = [
  {
    title: "Generative AI & LLMs",
    desc: "Building internal tools that use LLMs to automate complex business workflows, from fine-tuning pipelines to production inference.",
    Icon: BrainCircuit,
    hue: "#cbf74b",
    stack: ["PyTorch", "TensorFlow", "Hugging Face", "Scikit-learn", "NumPy", "Pandas", "Google Gemini"],
  },
  {
    title: "Scalable Backends",
    desc: "Designing robust FastAPI and Node.js backends that handle real-time data streaming and high-concurrency workloads.",
    Icon: Server,
    hue: "#7dd3fc",
    stack: ["FastAPI", "Node.js", "Express.js", "REST APIs", "SSE", "WebSockets", "Socket.IO"],
  },
  {
    title: "Full-Stack Product",
    desc: "Creating seamless user experiences with React and modern frontend architectures, shipped end to end.",
    Icon: Layout,
    hue: "#f9a8d4",
    stack: ["React.js", "Next.js", "React Native", "JavaScript", "TypeScript"],
  },
  {
    title: "Data & Tooling",
    desc: "Modelling data across relational and document stores, and shipping it with containerised, version-controlled workflows.",
    Icon: Database,
    hue: "#fcd34d",
    stack: ["PostgreSQL", "MySQL", "MongoDB", "Docker", "Git", "Python", "C++", "Java"],
  },
];

export const projects = [
  {
    title: "Aclique CLI",
    year: "2025",
    category: "AI Tooling",
    tech: ["Node.js", "PostgreSQL", "Google Gemini"],
    description:
      "A high-performance AI orchestrator designed for terminal-based automation and mission-critical developer workflows.",
    link: "https://github.com/AnshBhardwaj-98/aclique-cli",
  },
  {
    title: "YouTube Sentiment",
    year: "2025",
    category: "NLP",
    tech: ["Python", "Flask", "NLP"],
    description:
      "A browser extension that analyses large volumes of YouTube comments at scale for audience-sentiment insights.",
    link: "https://github.com/AnshBhardwaj-98/Youtube_Sentiment_Analysis_Extension",
  },
  {
    title: "Meridian Live",
    year: "2025",
    category: "Realtime",
    tech: ["React", "WebSockets", "Socket.IO"],
    description:
      "Low-latency collaborative environment with real-time state synchronisation for high-throughput teams.",
    link: "https://meridian-live.vercel.app/",
  },
  {
    title: "SkittyChat",
    year: "2024",
    category: "Realtime",
    tech: ["Node.js", "JWT", "Realtime"],
    description:
      "Secure chat infrastructure with modular authentication and real-time message streaming.",
    link: "https://skitty-frontend.onrender.com",
  },
];

export const experiences = [
  {
    role: "Generative AI Engineer",
    company: "Synergy Labs",
    period: "Present",
    location: "Gurugram, India",
    points: [
      { t: "LLM automation", d: "Architecting LLM-driven internal automation systems." },
      { t: "Fine-tuning", d: "Optimising fine-tuning pipelines for proprietary models." },
      { t: "Inference APIs", d: "Developing high-throughput API layers for real-time inference." },
    ],
  },
  {
    role: "Software Engineering Intern",
    company: "Uplyift",
    period: "2026",
    location: "Delhi, India",
    points: [
      { t: "Shopify at scale", d: "Engineered Shopify admin scale systems with SSE streaming." },
      { t: "FastAPI backends", d: "Built FastAPI backends for high-concurrency management." },
    ],
  },
];

// jjettas "Signature Moments": title + stat line. Swap in real metrics as you have them.
export const moments = [
  { title: "Generative AI Engineer", stat: "Synergy Labs · LLM Automation · Present", tag: "Career", video: "/moments/1.mp4" },
  { title: "10k+ Syncs", stat: "Production automation · Real-time pipelines", tag: "Impact", video: "/moments/2.mp4" },
  { title: "Aclique CLI", stat: "Node.js · PostgreSQL · Gemini · 2025", tag: "Featured build", video: "/moments/3.mp4" },
  { title: "SSE at Shopify Scale", stat: "Uplyift · FastAPI · High concurrency", tag: "Internship", video: "/moments/4.mp4" },
  { title: "B.Tech AI & ML", stat: "Sharda University · Class of 2026", tag: "Education", video: "/moments/5.mp4" },
];
