import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Loader2, CheckCircle } from "lucide-react";
import emailjs from "@emailjs/browser";
import { GlassCard } from "./GlassCard";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeUrl: string;
}

export const ResumeModal = ({ isOpen, onClose }: ResumeModalProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send notification via EmailJS
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || "",
        import.meta.env.VITE_EMAILJS_TEMPLATE2_ID || "",
        {
          user_email: email,
          time: new Date().toLocaleString(),
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ""
      );

      setIsSuccess(true);

      // Close modal after a short delay to show success state
      setTimeout(() => {
        onClose();
        setIsSubmitting(false);
        setIsSuccess(false);
        setEmail("");
      }, 3000);
    } catch (error) {
      console.error("EmailJS Error:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md z-10"
          >
            <GlassCard className="p-8! border-white/20">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                disabled={isSubmitting}
              >
                <X size={24} />
              </button>

              <div className="text-center mb-8">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-neon transition-colors duration-500 ${isSuccess ? "bg-green-500" : "bg-linear-to-r from-neonBlue to-neonPurple"}`}
                >
                  {isSuccess ? (
                    <CheckCircle className="text-white" size={32} />
                  ) : (
                    <Mail className="text-white" size={32} />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {isSuccess ? "Request Sent!" : "Request Resume"}
                </h3>
                <p className="text-gray-400">
                  {isSuccess
                    ? "I've received your request and will get back to you shortly."
                    : "Please enter your email to request a copy of my technical resume."}
                </p>
              </div>

              {!isSuccess && (
                <form onSubmit={handleDownload} className="space-y-4">
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                      size={20}
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-neonBlue transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-white text-black font-bold hover:bg-neonBlue hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      "Send Request"
                    )}
                  </button>
                </form>
              )}
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
