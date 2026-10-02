import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { ArrowUpRight, Loader2, Mail, MapPin } from "lucide-react";
import { profile } from "../../data";
import { RevealLines } from "../ui/Reveal";
import { GithubIcon, LinkedinIcon } from "../ui/BrandIcons";

type Status = "idle" | "sending" | "success" | "error";

const field =
  "w-full bg-white border border-line px-4 py-3.5 text-ink placeholder:text-muted-2 focus:outline-none focus:border-ink transition-colors";

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
    <section id="contact" className="relative min-h-screen flex items-center overflow-hidden bg-cream py-[14vh] px-page">
      <div className="absolute inset-0 grid-fx opacity-60" />
            <div className="absolute -bottom-1/3 -left-1/4 w-[60vw] h-[60vw] rounded-full bg-accent/10 blur-[140px]" />

      <div className="relative z-10 w-full grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] gap-16 items-end">
        <div>
          <span className="eyebrow text-accent mb-6">Get Started</span>
          <h2 className="display text-[clamp(64px,11vw,200px)]">
            <RevealLines lines={["Let's build", "something", "that ships."]} accent={2} />
          </h2>
          <p className="text-ink/70 leading-[1.6] text-[clamp(15px,1.3vw,19px)] max-w-[560px] mt-8">
            Open to software engineering roles across backend, full-stack and GenAI, and to ambitious builds. Drop a message or reach
            out on GitHub or LinkedIn.
          </p>

          <div className="flex flex-wrap gap-x-8 gap-y-3.5 mt-8 text-sm text-muted">
            <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2.5 hover:text-accent transition-colors">
              <Mail size={16} /> {profile.email}
            </a>
            <span className="inline-flex items-center gap-2.5">
              <MapPin size={16} /> {profile.location}
            </span>
          </div>

          <div className="flex flex-wrap gap-3.5 mt-8">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2.5 rounded-full bg-accent text-cream border border-accent px-5 py-3 text-sm font-semibold hover:-translate-y-0.5 hover:brightness-105 transition"
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
                className="inline-flex items-center gap-2.5 rounded-full border border-hairline px-5 py-3 text-sm font-semibold hover:-translate-y-0.5 hover:bg-ink/5 hover:border-ink transition"
              >
                <Icon /> {label}
              </a>
            ))}
            <button
              onClick={onResume}
              className="inline-flex items-center gap-2.5 rounded-full border border-hairline px-5 py-3 text-sm font-semibold hover:-translate-y-0.5 hover:bg-ink/5 hover:border-ink transition"
            >
              Résumé
            </button>
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="border border-line bg-white/60 backdrop-blur-md p-6 md:p-8 space-y-4">
          <p className="eyebrow text-muted mb-2">Send a message</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="from_name" required placeholder="Name" aria-label="Name" className={field} />
            <input name="from_email" type="email" required placeholder="Email" aria-label="Email" className={field} />
          </div>
          <textarea name="message" required rows={5} placeholder="Message" aria-label="Message" className={`${field} resize-none`} />
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full inline-flex items-center justify-center gap-2.5 bg-ink text-cream py-3.5 text-sm font-semibold hover:bg-accent disabled:opacity-60 transition-colors"
          >
            {status === "sending" && <Loader2 size={16} className="animate-spin" />}
            {{ idle: "Send message", sending: "Sending…", success: "Message sent ✓", error: "Failed, try email instead" }[status]}
          </button>
        </form>
      </div>
    </section>
  );
};
