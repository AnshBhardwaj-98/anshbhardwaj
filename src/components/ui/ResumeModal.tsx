import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Loader2,
  CheckCircle,
  Activity,
  Gauge,
  Send,
} from "lucide-react";
import emailjs from "@emailjs/browser";

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

    const data = {
      user_email: email,
      time: new Date().toLocaleString(),
    };

    try {
      // 1️⃣ Notify YOU (Account A)
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE2_ID, // notify template
        data,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );

      // 2️⃣ Send resume to USER (Account B)
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID_B,
        import.meta.env.VITE_EMAILJS_TEMPLATE3_ID, // auto-reply template
        data,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY_B,
      );

      setIsSuccess(true);

      setTimeout(() => {
        onClose();
        setIsSubmitting(false);
        setIsSuccess(false);
        setEmail("");
      }, 3000);
    } catch (error) {
      console.error("Transmission Error:", error);
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
            className="absolute inset-0 bg-chassis/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.98, opacity: 0, x: 20 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0.98, opacity: 0, x: 20 }}
            transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
            className="relative w-full max-w-lg z-10"
          >
            {/* The Aerodynamic Edge Container */}
            <div className="bg-surface-base border-t-8 border-ignitionRed p-8 md:p-12 shadow-2xl relative overflow-hidden">
              {/* Pattern Overlay */}
              <div className="absolute top-0 right-0 w-32 h-32 carbon-fiber opacity-[0.05] pointer-events-none" />

              <button
                onClick={onClose}
                className="absolute top-6 right-6 text-chassis/40 hover:text-ignitionRed transition-colors"
                disabled={isSubmitting}
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-4 mb-10">
                <div className="bg-chassis p-3 rounded-none">
                  <Gauge className="text-telemetryYellow" size={20} />
                </div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-chassis/40 leading-none mb-1">
                    System / Request
                  </h3>
                  <p className="text-2xl font-black text-chassis uppercase italic tracking-tighter leading-none">
                    Telemetry Fetch
                  </p>
                </div>
              </div>

              <div className="text-center mb-10 bg-surface-container p-8 relative">
                {/* Success/Action Icon */}
                <div
                  className={`w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-xl ${isSuccess ? "bg-vibrantEmerald bg-green-600 shadow-green-600/20" : "bg-ignitionRed shadow-ignitionRed/20"}`}
                >
                  {isSuccess ? (
                    <CheckCircle className="text-white" size={40} />
                  ) : (
                    <Activity className="text-white animate-pulse" size={40} />
                  )}
                </div>

                <h3 className="text-xl font-black text-chassis mb-3 uppercase italic tracking-tight">
                  {isSuccess ? "Transmission Success" : "Establish Link"}
                </h3>
                <p className="text-chassis/60 text-sm font-medium leading-relaxed max-w-xs mx-auto">
                  {isSuccess
                    ? "Packet received. Data payload arriving in your inbox shortly."
                    : "Authorize connection to receive the technical resume buffer."}
                </p>
              </div>

              {!isSuccess && (
                <form onSubmit={handleDownload} className="space-y-8">
                  <div className="relative group">
                    <div className="absolute left-0 bottom-0 w-full h-0.5 bg-chassis/10 group-focus-within:bg-ignitionRed transition-colors duration-500" />
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-chassis/40 block mb-2 ml-1">
                      Endpoint Address
                    </label>
                    <div className="flex items-center gap-4 px-1 pb-4">
                      <Mail
                        className="text-chassis/20 group-focus-within:text-ignitionRed transition-colors"
                        size={18}
                      />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="USER@DOMAIN.COM"
                        className="w-full bg-transparent font-display font-bold uppercase tracking-widest text-chassis placeholder:text-chassis/10 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-6 bg-chassis text-telemetryYellow font-black uppercase tracking-[0.4em] text-xs shadow-xl shadow-chassis/20 hover:bg-ignitionRed hover:text-white transition-all flex items-center justify-center gap-4 group"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        <span>Synchronizing...</span>
                      </>
                    ) : (
                      <>
                        <span>Execute Protocol</span>
                        <Send
                          size={16}
                          className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                        />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Technical detail footer */}
              <div className="mt-12 flex justify-between items-center text-[8px] font-black uppercase tracking-[0.3em] text-chassis/20 border-t border-chassis/5 pt-6">
                <span>Ref: DB-RESUME-REQ</span>
                <span className="italic">Velocity Mode: Active</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
