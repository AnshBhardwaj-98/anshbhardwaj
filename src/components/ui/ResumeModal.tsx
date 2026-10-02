import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle, Send } from "lucide-react";
import emailjs from "@emailjs/browser";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal = ({ isOpen, onClose }: ResumeModalProps) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const data = { user_email: email, time: new Date().toLocaleString() };

    // Sent in parallel and independently: the visitor's download-link email must not depend on my notification
    const [reply, notify] = await Promise.allSettled([
      // Auto-reply with the résumé download link to the visitor (account B)
      emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID_B,
        import.meta.env.VITE_EMAILJS_TEMPLATE3_ID,
        data,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY_B,
      ),
      // Notify me that someone requested it (account A)
      emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE2_ID,
        data,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      ),
    ]);
    if (notify.status === "rejected") console.error("Resume notification error:", notify.reason);

    if (reply.status === "rejected") {
      console.error("Resume auto-reply error:", reply.reason);
      setStatus("error");
      return;
    }
    setStatus("success");
    setTimeout(() => {
      onClose();
      setStatus("idle");
      setEmail("");
    }, 6000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/40 backdrop-blur-md"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg bg-cream border border-line p-8 md:p-10"
          >
            <button
              onClick={onClose}
              disabled={status === "sending"}
              aria-label="Close"
              className="absolute top-5 right-5 text-muted hover:text-accent transition-colors"
            >
              <X size={22} />
            </button>

            <span className="eyebrow text-accent mb-4">Résumé</span>
            <h3 id="resume-title" className="font-display text-3xl font-semibold tracking-tight mb-3">
              {status === "success" ? "On its way." : "Get my résumé"}
            </h3>
            <p className="text-muted text-sm leading-relaxed mb-8">
              {status === "success"
                ? "Check your inbox. It should arrive in a minute or two. Not there? Look in your spam or promotions folder."
                : "Enter your email and I'll send the latest copy straight to your inbox."}
            </p>

            {status === "success" ? (
              <CheckCircle className="text-accent" size={40} />
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  aria-label="Email address"
                  className="w-full bg-white border border-line px-4 py-3.5 text-ink placeholder:text-muted-2 focus:outline-none focus:border-ink transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-ink text-cream py-3.5 text-sm font-semibold hover:bg-accent disabled:opacity-60 transition"
                >
                  {status === "sending" ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {status === "sending" ? "Sending…" : "Send résumé"}
                </button>
                <p className="text-xs text-muted-2">It's an automated email, so it can land in spam. Worth a quick check there.</p>
                {status === "error" && (
                  <p className="text-sm text-accent">Couldn't send right now. Please try again or email me directly.</p>
                )}
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
