import { useState, useRef } from "react";
import {
  Send,
  Code2,
  Share2,
  Target,
  Zap,
  Activity,
  Loader2,
  CheckCircle,
} from "lucide-react";
import emailjs from "@emailjs/browser";
import { SectionHeading } from "../ui/SectionHeading";
import { motion, AnimatePresence } from "framer-motion";

export const Contact = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current!,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );

      setIsSubmitting(false);
      setStatus("success");
      formRef.current?.reset();

      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      console.error("Transmission Error:", error);
      setIsSubmitting(false);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section
      id="contact-form"
      className="py-32 px-6 md:px-24 bg-chassis relative overflow-hidden"
    >
      {/* Background technical elements */}
      <div className="absolute inset-0 checkered-pattern opacity-[0.04]" />
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-ignitionRed to-transparent opacity-20" />

      {/* Aesthetic Aero Glow */}
      <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-ignitionRed/5 blur-[120px] rounded-full" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
        {/* Left Side: Technical Info */}
        <div className="lg:col-span-5">
          <div className="inline-flex items-center gap-3 px-3 py-1 bg-white/5 border-l-2 border-telemetryYellow mb-10">
            <Activity
              size={12}
              className="text-telemetryYellow animate-pulse"
            />
            <span className="text-[9px] font-black text-white/60 uppercase tracking-[0.4em]">
              Signal_Status: Ready
            </span>
          </div>

          <SectionHeading align="left">
            <span className="text-white">RADIO</span> <br />
            <span className="text-ignitionRed italic">UPLINK</span>
          </SectionHeading>

          <p className="text-white/50 text-xl font-display uppercase tracking-tight max-w-sm mt-10 leading-tight border-l border-white/10 pl-8">
            Establish a high-bandwidth connection for{" "}
            <span className="text-white font-bold italic">
              technical architectural
            </span>{" "}
            inquiries and mission-critical collaborations.
          </p>

          <div className="mt-24 grid grid-cols-2 gap-4 max-w-sm">
            {[
              { label: "GitHub", icon: Code2, value: "/DB105" },
              { label: "LinkedIn", icon: Share2, value: "/divyansh-b" },
              { label: "Location", icon: Target, value: "Sector_NCR" },
              { label: "Direct", icon: Zap, value: "Email_Open" },
            ].map((item, i) => (
              <div
                key={i}
                className="p-4 bg-white/5 border-b border-white/5 hover:bg-white/10 transition-colors group cursor-default"
              >
                <item.icon
                  size={16}
                  className="text-telemetryYellow mb-3 group-hover:text-ignitionRed transition-colors"
                />
                <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] block mb-1">
                  {item.label}
                </span>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-7 bg-surface-base p-8 md:p-16 rounded-sm relative shadow-2xl border-t-8 border-ignitionRed">
          {/* Internal technical markings */}
          <div className="absolute top-4 right-6 text-[10px] font-black text-chassis/10 uppercase tracking-widest italic">
            Manual_Override_v4.2
          </div>
          <div className="absolute bottom-4 left-6 w-12 h-1 w-chassis/5 bg-chassis/5" />

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-12">
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* NAME */}
                <div className="relative group">
                  <label className="text-[9px] font-black text-chassis/40 uppercase tracking-[0.3em] block mb-2 ml-1">
                    Pilot_Name
                  </label>
                  <input
                    name="from_name"
                    type="text"
                    placeholder="ENTER NAME"
                    required
                    className="w-full bg-chassis/5 border-b-2 border-chassis/10 py-4 px-6 font-display font-bold uppercase tracking-widest text-chassis placeholder:text-chassis/20 focus:outline-none focus:border-ignitionRed transition-all"
                  />
                </div>

                {/* EMAIL */}
                <div className="relative group">
                  <label className="text-[9px] font-black text-chassis/40 uppercase tracking-[0.3em] block mb-2 ml-1">
                    Return_Channel
                  </label>
                  <input
                    name="from_email"
                    type="email"
                    placeholder="USER@DOMAIN.COM"
                    required
                    className="w-full bg-chassis/5 border-b-2 border-chassis/10 py-4 px-6 font-display font-bold uppercase tracking-widest text-chassis placeholder:text-chassis/20 focus:outline-none focus:border-ignitionRed transition-all"
                  />
                </div>
              </div>

              {/* MESSAGE */}
              <div className="relative group">
                <label className="text-[9px] font-black text-chassis/40 uppercase tracking-[0.3em] block mb-2 ml-1">
                  Data_Payload
                </label>
                <textarea
                  name="message"
                  placeholder="ENCODE YOUR MESSAGE BUFFER HERE..."
                  rows={4}
                  required
                  className="w-full bg-chassis/5 border-b-2 border-chassis/10 py-4 px-6 font-display font-bold uppercase tracking-widest text-chassis placeholder:text-chassis/20 focus:outline-none focus:border-ignitionRed transition-all resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-6 font-black uppercase tracking-[0.4em] text-xs transition-all flex items-center justify-center gap-4 relative overflow-hidden group shadow-2xl ${
                status === "success"
                  ? "bg-green-600 text-white"
                  : "bg-ignitionRed text-white hover:bg-chassis hover:text-telemetryYellow shadow-ignitionRed/30"
              }`}
            >
              {/* High-visibility yellow notch */}
              <div className="absolute top-0 right-0 w-3 h-3 bg-telemetryYellow transform translate-x-1.5 -translate-y-1.5 rotate-45 group-hover:w-4 group-hover:h-4 transition-all" />

              <AnimatePresence mode="wait">
                {isSubmitting ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3"
                  >
                    <Loader2 size={16} className="animate-spin" />
                    <span>Synchronizing...</span>
                  </motion.div>
                ) : status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle size={16} />
                    <span>Signal Received</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3"
                  >
                    <span>Execute Uplink Protocol</span>
                    <Send
                      size={16}
                      className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
