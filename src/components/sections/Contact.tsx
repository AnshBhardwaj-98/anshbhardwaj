import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  User,
  Mail,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Code2,
  Zap,
  Share2,
  X,
} from "lucide-react";
import emailjs from "@emailjs/browser";
import { SectionHeading } from "../ui/SectionHeading";
import { GlassCard } from "../ui/GlassCard";

export const Contact = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [toastVisible, setToastVisible] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false,
  });

  // Validation logic
  const validateField = (name: string, value: string) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < 2)
          return "Name must be at least 2 characters";
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value))
          return "Please enter a valid email address";
        return "";
      case "message":
        if (!value.trim()) return "Message is required";
        if (value.trim().length < 10)
          return "Message must be at least 10 characters";
        return "";
      default:
        return "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (touched[name as keyof typeof touched]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    // Validate all fields
    const newErrors = {
      name: validateField("name", formState.name),
      email: validateField("email", formState.email),
      message: validateField("message", formState.message),
    };
    setErrors(newErrors);
    setTouched({ name: true, email: true, message: true });

    if (Object.values(newErrors).some((err) => err !== "")) {
      // Shake animation on error fields
      const errorElements = document.querySelectorAll(".input-error");
      errorElements.forEach((el) => {
        el.classList.add("animate-shake");
        setTimeout(() => el.classList.remove("animate-shake"), 500);
      });
      return;
    }

    setIsSubmitting(true);
    setStatus("idle");

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || "",
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "",
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "",
      )
      .then(
        () => {
          setStatus("success");
          setToastVisible(true);
          setFormState({ name: "", email: "", message: "" });
          setTouched({ name: false, email: false, message: false });
          setTimeout(() => {
            setToastVisible(false);
            setStatus("idle");
          }, 5000);
        },
        (error) => {
          console.error("EmailJS Error:", error);
          setStatus("error");
          setToastVisible(true);
          setTimeout(() => {
            setToastVisible(false);
            setStatus("idle");
          }, 5000);
        },
      )
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    if (toastVisible) {
      const timer = setTimeout(() => setToastVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [toastVisible]);

  const socialLinks = [
    {
      icon: Code2,
      href: "https://github.com/yourusername",
      label: "GitHub",
      color: "hover:text-neonBlue",
    },
    {
      icon: Share2,
      href: "https://linkedin.com/in/yourusername",
      label: "LinkedIn",
      color: "hover:text-neonPurple",
    },
    {
      icon: Zap,
      href: "https://twitter.com/yourusername",
      label: "Twitter",
      color: "hover:text-neonPink",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section
      id="contact-form"
      className="py-24 px-6 md:px-20 max-w-5xl mx-auto relative z-10"
    >
      <SectionHeading>Get In Touch</SectionHeading>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
      >
        <GlassCard className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 md:p-8">
          {/* Animated gradient orbs */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-neonBlue/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-neonPink/20 rounded-full blur-3xl animate-pulse delay-1000" />

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="relative z-10 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Input */}
              <motion.div variants={itemVariants} className="space-y-1">
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="from_name"
                    value={formState.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`peer w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-transparent focus:outline-none transition-all duration-200 ${
                      touched.name && errors.name
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                        : "border-white/10 focus:border-neonBlue focus:ring-1 focus:ring-neonBlue/50"
                    }`}
                    placeholder=" "
                  />
                  <label
                    htmlFor="name"
                    className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-neonBlue peer-focus:-translate-y-1/2 ${
                      formState.name ? "top-0 text-xs -translate-y-1/2" : ""
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <User size={14} /> Name *
                    </span>
                  </label>
                </div>
                <AnimatePresence>
                  {touched.name && errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-400 text-xs mt-1 ml-1"
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Email Input */}
              <motion.div variants={itemVariants} className="space-y-1">
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="from_email"
                    value={formState.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`peer w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-transparent focus:outline-none transition-all duration-200 ${
                      touched.email && errors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                        : "border-white/10 focus:border-neonPurple focus:ring-1 focus:ring-neonPurple/50"
                    }`}
                    placeholder=" "
                  />
                  <label
                    htmlFor="email"
                    className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-neonPurple peer-focus:-translate-y-1/2 ${
                      formState.email ? "top-0 text-xs -translate-y-1/2" : ""
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      <Mail size={14} /> Email *
                    </span>
                  </label>
                </div>
                <AnimatePresence>
                  {touched.email && errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-400 text-xs mt-1 ml-1"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Hidden Time Field */}
            <input
              type="hidden"
              name="time"
              value={new Date().toLocaleString()}
            />

            {/* Message Input */}
            <motion.div variants={itemVariants} className="space-y-1">
              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formState.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`peer w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-transparent focus:outline-none transition-all duration-200 resize-none ${
                    touched.message && errors.message
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/50"
                      : "border-white/10 focus:border-neonPink focus:ring-1 focus:ring-neonPink/50"
                  }`}
                  placeholder=" "
                />
                <label
                  htmlFor="message"
                  className={`absolute left-4 top-4 text-gray-400 transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-neonPink ${
                    formState.message ? "top-0 text-xs" : ""
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <MessageSquare size={14} /> Message *
                  </span>
                </label>
              </div>
              <AnimatePresence>
                {touched.message && errors.message && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-400 text-xs mt-1 ml-1"
                  >
                    {errors.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={status === "error" ? { x: [-10, 10, -5, 5, 0] } : {}}
                transition={{ duration: 0.3 }}
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 relative overflow-hidden ${
                  status === "success"
                    ? "bg-linear-to-r from-green-500 to-emerald-500 shadow-green-500/20"
                    : status === "error"
                      ? "bg-linear-to-r from-red-500 to-rose-500 shadow-red-500/20"
                      : "bg-linear-to-r from-neonBlue via-neonPurple to-neonPink hover:shadow-neonBlue/50 hover:shadow-xl"
                } ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : status === "success" ? (
                  <>
                    <CheckCircle size={20} className="animate-bounce" />
                    <span>Message Sent!</span>
                  </>
                ) : status === "error" ? (
                  <>
                    <AlertCircle size={20} />
                    <span>Failed to Send</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Send Message</span>
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* Social Links */}
            <motion.div variants={itemVariants} className="pt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white/5 text-gray-400 rounded-full">
                    Or connect via
                  </span>
                </div>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                {socialLinks.map((social, idx) => (
                  <motion.a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`text-gray-400 transition-all duration-200 ${social.color}`}
                    aria-label={social.label}
                  >
                    <social.icon size={22} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </form>
        </GlassCard>
      </motion.div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div
              className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md border ${
                status === "success"
                  ? "bg-green-500/20 border-green-500/50 text-green-400"
                  : "bg-red-500/20 border-red-500/50 text-red-400"
              }`}
            >
              {status === "success" ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <span className="font-medium">
                {status === "success"
                  ? "Thanks for reaching out! I'll get back to you soon."
                  : "Oops! Something went wrong. Please try again later."}
              </span>
              <button
                onClick={() => setToastVisible(false)}
                className="ml-2 hover:opacity-70 transition"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add shake animation to global styles or inline */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </section>
  );
};
