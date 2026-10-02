// Content source: divyansh_bhardwaj.pdf (latest resume)

export const profile = {
  name: "Divyansh Bhardwaj",
  role: "Software Engineer",
  focus: "Backend · Full-Stack · AI/GenAI",
  email: "contact@anshbhardwaj.com",
  location: "New Delhi, India",
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
  stack: string[];
};

export const capabilities: Capability[] = [
  {
    title: "AI & LLM Pipelines",
    desc: "Multi-stage LLM pipelines with structured outputs, speech-to-text, and permission-aware RAG over vector search and knowledge graphs.",
    stack: ["OpenAI API", "Gemini", "RAG", "Knowledge Graphs", "Speech-to-Text", "pgvector", "PyTorch", "Hugging Face", "Langfuse"],
  },
  {
    title: "Backend & APIs",
    desc: "Multi-tenant FastAPI and Node.js backends with RBAC, background jobs, and real-time streaming over WebSockets and SSE.",
    stack: ["FastAPI", "Node.js", "Express.js", "Flask", "SQLAlchemy", "Celery", "Redis", "WebSockets", "SSE", "REST APIs"],
  },
  {
    title: "Full-Stack Product",
    desc: "React and Next.js products shipped end to end, from bulk-edit grids over whole store catalogs to live collaborative editors.",
    stack: ["React.js", "Next.js", "TypeScript", "Vite", "Tailwind CSS", "React Native", "IndexedDB"],
  },
  {
    title: "Data & DevOps",
    desc: "PostgreSQL schemas and migrations, Dockerised deploys, and CI pipelines running hundreds of automated tests.",
    stack: ["PostgreSQL", "MySQL", "MongoDB", "Supabase", "AWS S3", "Docker", "GitHub Actions", "Railway", "Vercel", "Alembic", "pytest"],
  },
];

export type Project = {
  title: string;
  year: string;
  category: string;
  tech: string[];
  description: string;
  link?: string; // client work has no public link
};

export const projects: Project[] = [
  {
    title: "Triburg QA",
    year: "2026",
    category: "AI · Client work",
    tech: ["Python", "FastAPI", "React", "PostgreSQL", "OpenAI", "AWS S3"],
    description:
      "Speech-to-report garment inspection: a 5-stage LLM pipeline turns recorded Hindi/English inspections into the client's filled reports, cutting time per size set by 50%.",
  },
  {
    title: "OrgOS",
    year: "2026",
    category: "AI · Client work",
    tech: ["FastAPI", "pgvector", "Celery", "Redis", "React", "TypeScript"],
    description:
      "Multi-tenant AI meeting assistant that joins Meet, Zoom and Teams calls, streams live transcripts and answers questions through permission-aware RAG.",
  },
  {
    title: "ShopManager",
    year: "2026",
    category: "Full-stack · Client work",
    tech: ["React", "FastAPI", "Supabase", "Shopify GraphQL", "WebSockets"],
    description:
      "Multi-store Shopify admin with a bulk-edit grid over entire catalogs that syncs only changed fields and streams progress live.",
  },
  {
    title: "Meridian",
    year: "2025",
    category: "Realtime",
    tech: ["React", "Node.js", "Socket.IO", "Monaco"],
    description: "Real-time collaborative code editor with multi-user sync for 10+ concurrent users and live notifications.",
    link: "https://meridian.anshbhardwaj.com/",
  },
  {
    title: "Aclique CLI",
    year: "2025",
    category: "AI Tooling",
    tech: ["Node.js", "Next.js", "PostgreSQL", "Prisma", "Gemini"],
    description: "AI-powered CLI on Google Gemini with GitHub OAuth device authorization and a Prisma/PostgreSQL auth backend.",
    link: "https://github.com/AnshBhardwaj-98/aclique-cli",
  },
  {
    title: "YouTube Sentiment",
    year: "2025",
    category: "NLP",
    tech: ["Python", "Flask", "YouTube Data API"],
    description: "Browser extension with Flask REST APIs for real-time sentiment analysis of YouTube comments across 100+ videos.",
    link: "https://github.com/AnshBhardwaj-98/Youtube_Sentiment_Analysis_Extension",
  },
];

export const experiences = [
  {
    role: "SDE Intern",
    company: "Synergy Labs",
    period: "Apr 2026 – Sep 2026",
    location: "Gurugram, India",
    points: [
      {
        t: "Triburg QA",
        d: "Built a speech-to-report inspection platform; its 5-stage LLM pipeline cut time per size set by 50%.",
      },
      {
        t: "OrgOS",
        d: "Engineered a multi-tenant AI meeting assistant: live transcripts, permission-aware RAG, 224 endpoints across 61 tables.",
      },
      { t: "Performance", d: "Cut board load time from 7.1s to 0.12s with eager loading and indexed permission checks." },
      { t: "Shipping", d: "Docker and AWS S3 deploys, Alembic migrations, and GitHub Actions CI with 600+ automated tests." },
    ],
  },
  {
    role: "Software Engineering Intern",
    company: "Uplyift",
    period: "Jan 2026 – Mar 2026",
    location: "New Delhi, India",
    points: [
      { t: "ShopManager", d: "Built a multi-tenant dashboard managing products, inventory and collections across Shopify stores." },
      { t: "Bulk editing", d: "GraphQL Bulk Operations grid that pushes only modified fields and streams progress over WebSockets." },
      { t: "Resilience", d: "Supabase JWT auth, auto-refreshing Shopify tokens, and an API client with backoff on 429/5xx errors." },
    ],
  },
  {
    role: "Intern, Machine Learning & Deep Learning",
    company: "Edunet Foundation",
    period: "Jan 2025 – Feb 2025",
    location: "Remote",
    points: [
      { t: "Stable Diffusion XL", d: "Fine-tuned SDXL in PyTorch for domain-specific image generation, improving quality by about 30% (FID)." },
    ],
  },
];

export const education = {
  degree: "B.Tech in Computer Science (AI & ML)",
  school: "Sharda University",
  place: "Greater Noida, India",
  period: "2022 – 2026",
  cgpa: "7.98 / 10",
};

// "Signature Moments": a headline number, what it measures, and a small bar chart of the numbers behind it
export type MomentBar = { label: string; value: number; display: string };
export const moments: { title: string; stat: string; tag: string; bars: MomentBar[] }[] = [
  {
    title: "50% faster",
    stat: "Triburg QA · inspection report time per size set",
    tag: "Synergy Labs",
    bars: [
      { label: "Before", value: 70, display: "60–80 min" },
      { label: "After", value: 35, display: "30–40 min" },
    ],
  },
  {
    title: "7.1s → 0.12s",
    stat: "OrgOS · board load time, eager loading + indexed permissions",
    tag: "Performance",
    bars: [
      { label: "Before", value: 7.1, display: "7.1s" },
      { label: "After", value: 0.12, display: "0.12s" },
    ],
  },
  {
    title: "Top 983",
    stat: "Amazon ML Challenge 2025 · top 1192 in 2024",
    tag: "Competition",
    bars: [
      { label: "Participants", value: 83000, display: "83,000+" },
      { label: "Rank", value: 983, display: "#983" },
    ],
  },
  {
    title: "224 endpoints",
    stat: "OrgOS · RBAC across organisations and teams",
    tag: "Scale",
    bars: [
      { label: "API endpoints", value: 224, display: "224" },
      { label: "Database tables", value: 61, display: "61" },
    ],
  },
  {
    title: "355+ solved",
    stat: "LeetCode · problems by difficulty",
    tag: "DSA",
    bars: [
      { label: "Easy", value: 139, display: "139" },
      { label: "Medium", value: 187, display: "187" },
      { label: "Hard", value: 29, display: "29" },
    ],
  },
];
