import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { ArrowUpRight, Loader2, Mail, MapPin } from "lucide-react";
import { profile } from "../../data";
import { RevealLines } from "../ui/Reveal";
import { GithubIcon, LinkedinIcon } from "../ui/BrandIcons";

type Status = "idle" | "sending" | "success" | "error";

const field =
  "w-full bg-white/[0.03] border border-line px-4 py-3.5 text-cream placeholder:text-muted-dark focus:outline-none focus:border-neon transition-colors";

export const Contact = ({ onResume }: { onResume: () => void }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current!,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );
      formRef.current?.reset();
      setStatus("success");
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 5000);
  };

  return (
    <section id="contact" className="relative min-h-screen flex items-center overflow-hidden bg-ink-2 py-[14vh] px-page">
      <div className="absolute inset-0 grid-fx opacity-60" />
      <div className="absolute inset-0 bg-[linear-gradient(335deg,rgba(11,11,13,0.94)_0%,rgba(11,11,13,0.7)_45%,rgba(11,11,13,0.5)_100%)]" />
      <div className="absolute -bottom-1/3 -left-1/4 w-[60vw] h-[60vw] rounded-full bg-neon/10 blur-[140px]" />

      <div className="relative z-10 w-full grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-16 items-end">
        <div>
          <span className="eyebrow text-neon mb-6">Get Started</span>
          <h2 className="display text-[clamp(64px,11vw,200px)]">
            <RevealLines lines={["Let's build", "something", "that ships."]} accent={2} />
          </h2>
          <p className="text-[#d7d7d4] leading-[1.6] text-[clamp(15px,1.3vw,19px)] max-w-[560px] mt-8">
            Open to Generative AI engineering roles, collaborations and ambitious builds. Drop a message or reach
            out on GitHub or LinkedIn.
          </p>

          <div className="flex flex-wrap gap-x-8 gap-y-3.5 mt-8 text-sm text-muted">
            <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2.5 hover:text-neon transition-colors">
              <Mail size={16} /> {profile.email}
            </a>
            <span className="inline-flex items-center gap-2.5">
              <MapPin size={16} /> {profile.location}
            </span>
          </div>

          <div className="flex flex-wrap gap-3.5 mt-8">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2.5 rounded-full bg-neon text-ink border border-neon px-5 py-3 text-sm font-semibold hover:-translate-y-0.5 hover:brightness-105 transition"
            >
              Email me <ArrowUpRight size={16} />
            </a>
            {[
              { href: profile.github, label: "GitHub", Icon: GithubIcon },
              { href: profile.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border border-hairline px-5 py-3 text-sm font-semibold hover:-translate-y-0.5 hover:bg-white/[0.08] hover:border-cream transition"
              >
                <Icon /> {label}
              </a>
            ))}
            <button
              onClick={onResume}
              className="inline-flex items-center gap-2.5 rounded-full border border-hairline px-5 py-3 text-sm font-semibold hover:-translate-y-0.5 hover:bg-white/[0.08] hover:border-cream transition"
            >
              Résumé
            </button>
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="border border-line bg-ink/70 backdrop-blur-md p-6 md:p-8 space-y-4">
          <p className="eyebrow text-muted mb-2">Send a message</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="from_name" required placeholder="Name" aria-label="Name" className={field} />
            <input name="from_email" type="email" required placeholder="Email" aria-label="Email" className={field} />
          </div>
          <textarea name="message" required rows={5} placeholder="Message" aria-label="Message" className={`${field} resize-none`} />
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full inline-flex items-center justify-center gap-2.5 bg-cream text-ink py-3.5 text-sm font-semibold hover:bg-neon disabled:opacity-60 transition-colors"
          >
            {status === "sending" && <Loader2 size={16} className="animate-spin" />}
            {{ idle: "Send message", sending: "Sending…", success: "Message sent ✓", error: "Failed, try email instead" }[status]}
          </button>
        </form>
      </div>
    </section>
  );
};
