import { motion, AnimatePresence } from "framer-motion";
import type { CSSProperties } from "react";
import { useEffect, useState, useRef } from "react";

const GLITCH_STYLES = `
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes chromatic-shift {
    0%   { text-shadow: 3px 0 #ff0028, -3px 0 #00e5ff, 0 0 rgba(255,255,255,0); }
    25%  { text-shadow: -4px 0 #ff0028,  4px 0 #00e5ff, 0 0 rgba(255,255,255,0); }
    50%  { text-shadow:  2px 0 #ff0028, -2px 0 #00e5ff, 0 0 rgba(255,255,255,0); }
    75%  { text-shadow: -5px 0 #ff0028,  5px 0 #00e5ff, 0 0 rgba(255,255,255,0); }
    100% { text-shadow:  3px 0 #ff0028, -3px 0 #00e5ff, 0 0 rgba(255,255,255,0); }
  }
  @keyframes glitch-clip-1 {
    0%   { clip-path: polygon(0 15%, 100% 15%, 100% 30%, 0 30%); transform: translate(-6px, 0); }
    20%  { clip-path: polygon(0 55%, 100% 55%, 100% 65%, 0 65%); transform: translate(6px, 0); }
    40%  { clip-path: polygon(0 40%, 100% 40%, 100% 50%, 0 50%); transform: translate(-4px, 0); }
    60%  { clip-path: polygon(0 75%, 100% 75%, 100% 85%, 0 85%); transform: translate(4px, 0); }
    80%  { clip-path: polygon(0 5%,  100% 5%,  100% 15%, 0 15%); transform: translate(-3px, 0); }
    100% { clip-path: polygon(0 90%, 100% 90%, 100% 100%, 0 100%); transform: translate(0, 0); }
  }
  @keyframes glitch-clip-2 {
    0%   { clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%); transform: translate(8px, 0); }
    33%  { clip-path: polygon(0 20%, 100% 20%, 100% 35%, 0 35%); transform: translate(-8px, 0); }
    66%  { clip-path: polygon(0 70%, 100% 70%, 100% 80%, 0 80%); transform: translate(5px, 0); }
    100% { clip-path: polygon(0 10%, 100% 10%, 100% 20%, 0 20%); transform: translate(0, 0); }
  }
  @keyframes flicker-idle {
    0%, 93%, 100% { opacity: 1; }
    94% { opacity: 0.6; }
    95% { opacity: 1; }
    96% { opacity: 0.2; }
    97% { opacity: 1; }
    98% { opacity: 0.7; }
    99% { opacity: 1; }
  }
  @keyframes drs-glow {
    0%, 100% { box-shadow: 0 0 8px #00ff88, 0 0 20px #00ff8860; background: #00cc66; }
    50%       { box-shadow: 0 0 20px #00ff88, 0 0 50px #00ff8880; background: #00ff88; }
  }
  @keyframes red-glow-pulse {
    0%, 100% { text-shadow: 0 0 15px rgba(187,0,22,0.4); }
    50%       { text-shadow: 0 0 40px rgba(187,0,22,0.9), 0 0 80px rgba(187,0,22,0.3); }
  }
  @keyframes spin-wheel {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes radio-static {
    0%, 100% { opacity: 0.2; transform: scaleY(0.3); }
    50%       { opacity: 1;   transform: scaleY(1);   }
  }
  @keyframes sector-flash {
    0%   { opacity: 1; }
    50%  { opacity: 0.4; }
    100% { opacity: 1; }
  }
  @keyframes corner-pulse {
    0%, 100% { opacity: 0.4; }
    50%       { opacity: 1; }
  }
  @keyframes speed-vignette {
    0%, 100% { opacity: 0; }
    50%       { opacity: 0.6; }
  }
`;

const CornerDecor = ({ style }: { style: CSSProperties }) => (
  <motion.svg
    width="70"
    height="70"
    viewBox="0 0 70 70"
    style={{ position: "absolute", ...style }}
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <path
      d="M5 65 L5 5 L65 5"
      stroke="#bb0016"
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
      style={{ animation: "corner-pulse 2s ease-in-out infinite" }}
    />
    <circle cx="5" cy="5" r="3" fill="#bb0016" />
  </motion.svg>
);

interface Spark {
  id: number;
  cx: number;
  cy: number;
  dx: number;
  dy: number;
}

export const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [tick, setTick] = useState(0);
  const [glitch, setGlitch] = useState(false);
  const [shake, setShake] = useState(false);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [carKey, setCarKey] = useState(0);
  const [carVisible, setCarVisible] = useState(false);
  const [drsActive, setDrsActive] = useState(false);
  const [sectorCrossed, setSectorCrossed] = useState(0);
  const [radioActive, setRadioActive] = useState(false);
  const [flashColor, setFlashColor] = useState<string | null>(null);
  const sparkIdRef = useRef(0);
  const progressRef = useRef(0);

  // Ticker for live telemetry animations
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 80);
    return () => clearInterval(t);
  }, []);

  // Main progress
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + Math.random() * 11, 100);
        progressRef.current = next;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFinished(true);
            document.body.style.overflow = "auto";
          }, 900);
        }
        return next;
      });
    }, 160);
    return () => {
      clearInterval(interval);
      document.body.style.overflow = "auto";
    };
  }, []);

  // Sector crossing effects
  useEffect(() => {
    if (progress > 33 && sectorCrossed < 1) {
      setSectorCrossed(1);
      triggerShake();
      triggerFlash("#f1c100");
      triggerSparks(15, 50, 50);
    }
    if (progress > 66 && sectorCrossed < 2) {
      setSectorCrossed(2);
      triggerShake();
      triggerFlash("#bb0016");
      triggerSparks(20, 50, 50);
    }
    if (progress > 90) setDrsActive(true);
    if (progress >= 99) {
      triggerFlash("#bb0016");
      triggerShake();
    }
  }, [progress]);

  // Glitch interval
  useEffect(() => {
    const schedule = () => {
      const delay = 1800 + Math.random() * 2500;
      return setTimeout(() => {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 120 + Math.random() * 100);
        scheduleRef.current = schedule();
      }, delay);
    };
    const scheduleRef = { current: schedule() };
    return () => clearTimeout(scheduleRef.current);
  }, []);

  // Car flyby events
  useEffect(() => {
    const checkpoints = [22, 55, 82];
    checkpoints.forEach((cp) => {
      if (progress > cp && progress < cp + 4) {
        setCarVisible(true);
        setCarKey((k) => k + 1);
        setTimeout(() => setCarVisible(false), 800);
      }
    });
  }, [Math.floor(progress / 2)]);

  // Radio chatter
  useEffect(() => {
    const radio = setInterval(
      () => {
        setRadioActive(true);
        setTimeout(() => setRadioActive(false), 400 + Math.random() * 600);
      },
      3000 + Math.random() * 2000,
    );
    return () => clearInterval(radio);
  }, []);

  // Spark spawner
  useEffect(() => {
    if (progress <= 0 || progress >= 100) return;
    const iv = setInterval(() => {
      triggerSparks(5, 50 + Math.random() * 30, 40 + Math.random() * 20);
    }, 700);
    return () => clearInterval(iv);
  }, [progress > 0]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };
  const triggerFlash = (color: string) => {
    setFlashColor(color);
    setTimeout(() => setFlashColor(null), 250);
  };
  const triggerSparks = (count: number, cx: number, cy: number) => {
    const newSparks = Array.from({ length: count }, () => {
      const id = ++sparkIdRef.current;
      const angle = Math.random() * 360;
      const dist = 80 + Math.random() * 200;
      return {
        id,
        cx,
        cy,
        dx: Math.cos((angle * Math.PI) / 180) * dist,
        dy: Math.sin((angle * Math.PI) / 180) * dist,
      };
    });
    setSparks((prev) => [...prev, ...newSparks]);
    setTimeout(
      () =>
        setSparks((prev) =>
          prev.filter((s) => !newSparks.find((n) => n.id === s.id)),
        ),
      1200,
    );
  };

  // Live telemetry values
  const t = tick * 0.08;
  const throttle = Math.max(
    20,
    Math.min(100, progress + Math.sin(t * 2.3) * 15),
  );
  const brake = Math.max(
    0,
    Math.min(80, (100 - progress) * 0.4 + Math.abs(Math.sin(t * 3.7)) * 20),
  );
  const steering = 50 + Math.sin(t * 1.1) * 35;
  const gForce = 2.8 + Math.sin(t * 1.7) * 1.4 + Math.cos(t * 2.1) * 0.6;
  const speedKph = Math.round(progress * 3.2 + Math.sin(t * 1.9) * 18);
  const rpm = Math.round(8000 + progress * 120 + Math.sin(t * 4) * 1500);

  const getLightColor = (i: number) => {
    const pct = (i / 15) * 100;
    if (progress < pct) return "#e2e8f0";
    if (i < 5) return "#22c55e";
    if (i < 10) return "#dc2626";
    return "#3b82f6";
  };
  const getLightGlow = (i: number) => {
    const pct = (i / 15) * 100;
    if (progress < pct) return "none";
    if (i < 5) return "0 0 12px #22c55e, 0 0 30px #22c55e60";
    if (i < 10) return "0 0 12px #dc2626, 0 0 30px #dc262660";
    return "0 0 12px #3b82f6, 0 0 30px #3b82f660";
  };

  const sectorColor = (s: number) => {
    if (sectorCrossed > s) return "#f1c100";
    if (Math.floor(sectorCrossed) === s) return "#bb0016";
    return "#e2e8f0";
  };

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08, filter: "blur(8px)" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          animate={
            shake
              ? {
                  x: [0, -10, 10, -7, 7, -4, 4, -2, 2, 0],
                  y: [0, 5, -5, 4, -4, 2, -2, 1, -1, 0],
                  rotate: [0, -0.5, 0.5, -0.3, 0.3, 0],
                }
              : { x: 0, y: 0, rotate: 0 }
          }
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#f8fafc",
            overflow: "hidden",
          }}
        >
          <style>{GLITCH_STYLES}</style>

          {/* Scanline */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: 2,
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.02) 3px, rgba(0,0,0,0.02) 4px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background:
                "linear-gradient(90deg, transparent, rgba(187,0,22,0.3), transparent)",
              animation: "scanline 2.5s linear infinite",
              pointerEvents: "none",
              zIndex: 3,
            }}
          />

          {/* Grid bg */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              backgroundImage:
                "linear-gradient(rgba(187,0,22,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(187,0,22,0.06) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Speed vignette effect */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, transparent 40%, rgba(187,0,22,0.04) 100%)",
              animation: "speed-vignette 1.5s ease-in-out infinite",
            }}
          />

          {/* Corner decorations */}
          <CornerDecor style={{ top: 16, left: 16 }} />
          <CornerDecor
            style={{ top: 16, right: 16, transform: "rotate(90deg)" }}
          />
          <CornerDecor
            style={{ bottom: 16, left: 16, transform: "rotate(270deg)" }}
          />
          <CornerDecor
            style={{ bottom: 16, right: 16, transform: "rotate(180deg)" }}
          />

          {/* DRS OPEN indicator */}
          <AnimatePresence>
            {drsActive && (
              <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{
                  position: "absolute",
                  top: 20,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#00cc66",
                  color: "#fff",
                  padding: "4px 20px",
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.25em",
                  clipPath:
                    "polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)",
                  animation: "drs-glow 0.5s ease-in-out infinite",
                  zIndex: 20,
                }}
              >
                ▶ DRS DETECTION ZONE
              </motion.div>
            )}
          </AnimatePresence>

          {/* TOP LEFT: Team broadcast bar */}
          <motion.div
            initial={{ x: -120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.3,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            style={{ position: "absolute", top: 52, left: 24, zIndex: 10 }}
          >
            <div style={{ display: "flex", marginBottom: 4 }}>
              <div
                style={{
                  background: "#bb0016",
                  padding: "4px 14px",
                  color: "white",
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                }}
              >
                P1
              </div>
              <div
                style={{
                  background: "#f1c100",
                  padding: "4px 14px",
                  color: "#000",
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                }}
              >
                DIVYANSH • RBR
              </div>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {["S1", "S2", "S3"].map((s, i) => (
                <div
                  key={s}
                  style={{
                    background: sectorColor(i),
                    color:
                      sectorCrossed > i
                        ? "#000"
                        : sectorCrossed === i
                          ? "white"
                          : "#94a3b8",
                    fontFamily: "'Orbitron', monospace",
                    fontSize: "8px",
                    padding: "2px 8px",
                    letterSpacing: "0.12em",
                    transition: "all 0.4s ease",
                    animation:
                      sectorCrossed === i
                        ? "sector-flash 0.3s ease infinite"
                        : "none",
                  }}
                >
                  {s}
                </div>
              ))}
              <div
                style={{
                  background: "#f1f5f9",
                  border: "1px solid #e2e8f0",
                  padding: "2px 8px",
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "8px",
                  color: "#64748b",
                  letterSpacing: "0.1em",
                }}
              >
                {Math.round(progress * 0.019 + 1)
                  .toString()
                  .padStart(2, "0")}
                :
                {Math.round(progress * 0.18)
                  .toString()
                  .padStart(2, "0")}
                .
                {Math.round((progress % 5) * 193)
                  .toString()
                  .padStart(3, "0")}
              </div>
            </div>
          </motion.div>

          {/* TOP RIGHT: Data readouts */}
          <motion.div
            initial={{ x: 120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              position: "absolute",
              top: 52,
              right: 24,
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              gap: 4,
              alignItems: "flex-end",
            }}
          >
            {[
              { label: "SPEED", value: `${speedKph} KM/H` },
              { label: "RPM", value: rpm.toLocaleString() },
              {
                label: "GEAR",
                value: Math.max(1, Math.floor(progress / 14)).toString(),
              },
              {
                label: "ERS",
                value: `${Math.floor(progress)}%`,
                highlight: true,
              },
            ].map(({ label, value, highlight }) => (
              <div key={label} style={{ display: "flex", gap: 0 }}>
                <div
                  style={{
                    background: "#f1f5f9",
                    border: "1px solid #e2e8f0",
                    padding: "2px 8px",
                    color: "#64748b",
                    fontFamily: "'Orbitron', monospace",
                    fontSize: "8px",
                    letterSpacing: "0.12em",
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    background: highlight ? "#bb0016" : "#ffffff",
                    border: highlight ? "none" : "1px solid #cbd5e1",
                    padding: "2px 10px",
                    color: highlight ? "white" : "#0f172a",
                    fontFamily: "'Orbitron', monospace",
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    boxShadow: highlight
                      ? "0 0 12px rgba(187,0,22,0.4)"
                      : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  {value}
                </div>
              </div>
            ))}
          </motion.div>

          {/* RADIO indicator */}
          <AnimatePresence>
            {radioActive && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  position: "absolute",
                  bottom: 80,
                  right: 24,
                  zIndex: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(255,255,255,0.9)",
                  border: "1px solid #e2e8f0",
                  padding: "5px 10px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#22c55e",
                    boxShadow: "0 0 10px #22c55e",
                    animation: "radio-static 0.15s ease infinite",
                  }}
                />
                <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 2,
                        height: 4 + Math.abs(Math.sin(i * 1.2 + t * 8)) * 14,
                        background: "#22c55e",
                        opacity: 0.6 + Math.random() * 0.4,
                        animation: `radio-static ${0.1 + Math.random() * 0.15}s ease infinite`,
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: "7px",
                    color: "#22c55e",
                    letterSpacing: "0.15em",
                  }}
                >
                  TEAM RADIO
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SPARKS particle system */}
          {sparks.map((spark) => (
            <motion.div
              key={spark.id}
              initial={{
                x: `${spark.cx}vw`,
                y: `${spark.cy}vh`,
                scale: 1,
                opacity: 1,
              }}
              animate={{
                x: `calc(${spark.cx}vw + ${spark.dx}px)`,
                y: `calc(${spark.cy}vh + ${spark.dy}px)`,
                scale: 0,
                opacity: 0,
              }}
              transition={{
                duration: 0.7 + Math.random() * 0.5,
                ease: "easeOut",
              }}
              style={{
                position: "absolute",
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: Math.random() > 0.5 ? "#f1c100" : "#ff4400",
                boxShadow: "0 0 8px #f1c100",
                pointerEvents: "none",
                zIndex: 50,
                left: 0,
                top: 0,
              }}
            />
          ))}

          {/* CAR FLYBY */}
          <AnimatePresence>
            {carVisible && (
              <motion.div
                key={carKey}
                initial={{ x: "-20vw", opacity: 0 }}
                animate={{ x: "120vw", opacity: [0, 0, 1, 1, 1, 0] }}
                transition={{ duration: 0.65, ease: [0.25, 0, 0.9, 1] }}
                style={{
                  position: "absolute",
                  top: "38%",
                  zIndex: 40,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {/* Flame / exhaust tail */}
                <motion.div
                  animate={{ scaleX: [0.8, 1.4, 0.9], opacity: [0.5, 1, 0.6] }}
                  transition={{ duration: 0.08, repeat: Infinity }}
                  style={{
                    width: 180,
                    height: 4,
                    marginRight: -8,
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,70,0,0.4), rgba(187,0,22,0.8))",
                    filter: "blur(3px)",
                    transformOrigin: "right center",
                  }}
                />
                <svg
                  width="200"
                  height="60"
                  viewBox="0 0 200 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Car body */}
                  <path
                    d="M8 42 L18 25 L35 20 L60 16 L85 13 L115 11 L140 13 L162 18 L178 26 L182 36 L168 40 L148 38 L120 36 L100 35 L78 36 L55 38 L30 42 L15 48 Z"
                    fill="#cc0000"
                  />
                  {/* Airbox / intake */}
                  <path
                    d="M100 11 L112 5 L135 4 L148 9 L135 13 Z"
                    fill="#f1c100"
                  />
                  {/* Halo */}
                  <path
                    d="M80 14 Q100 8 120 14"
                    stroke="#888"
                    strokeWidth="3"
                    fill="none"
                  />
                  {/* Front wing */}
                  <path d="M15 44 L8 50 L2 52 L12 46 Z" fill="#990000" />
                  <path d="M15 44 L12 50 L30 48 L30 44 Z" fill="#770000" />
                  {/* Rear wing */}
                  <path d="M165 28 L180 22 L186 26 L172 32 Z" fill="#990000" />
                  <path d="M165 28 L168 32 L182 32 L182 28 Z" fill="#770000" />
                  {/* Wheels */}
                  <circle
                    cx="48"
                    cy="47"
                    r="11"
                    fill="#111"
                    stroke="#333"
                    strokeWidth="2"
                  />
                  <circle cx="48" cy="47" r="5" fill="#222" />
                  <circle
                    cx="160"
                    cy="47"
                    r="11"
                    fill="#111"
                    stroke="#333"
                    strokeWidth="2"
                  />
                  <circle cx="160" cy="47" r="5" fill="#222" />
                  {/* Cockpit */}
                  <path
                    d="M88 12 L105 6 L118 6 L118 13 Z"
                    fill="#1a1aee"
                    opacity="0.7"
                  />
                  {/* Number */}
                  <text
                    x="108"
                    y="30"
                    fontSize="9"
                    fill="white"
                    fontFamily="Orbitron"
                    fontWeight="900"
                    opacity="0.9"
                  >
                    1
                  </text>
                </svg>
                {/* Speed lines behind car */}
                <div
                  style={{
                    position: "absolute",
                    right: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  {[200, 140, 80, 50, 30].map((w, i) => (
                    <div
                      key={i}
                      style={{
                        width: w,
                        height: i === 0 ? 2 : 1,
                        background: `rgba(187,0,22,${0.7 - i * 0.1})`,
                        filter: "blur(1px)",
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MAIN CONTENT */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0,
              position: "relative",
            }}
          >
            {/* LOGO */}
            <div
              style={{
                textAlign: "center",
                marginBottom: 20,
                position: "relative",
              }}
            >
              {/* Glitch overlay layers */}
              {glitch && (
                <>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      fontFamily: "'Orbitron', monospace",
                      fontSize: "clamp(28px, 5vw, 50px)",
                      fontWeight: 900,
                      letterSpacing: "0.1em",
                      color: "#ff0028",
                      textTransform: "uppercase",
                      lineHeight: 1,
                      animation: "glitch-clip-1 0.15s steps(1) infinite",
                      zIndex: 2,
                      userSelect: "none",
                    }}
                  >
                    DIVYANSH'S
                    <br />
                    <span style={{ color: "#bb0016" }}>PORTFOLIO</span>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      fontFamily: "'Orbitron', monospace",
                      fontSize: "clamp(28px, 5vw, 50px)",
                      fontWeight: 900,
                      letterSpacing: "0.1em",
                      color: "#00e5ff",
                      textTransform: "uppercase",
                      lineHeight: 1,
                      animation: "glitch-clip-2 0.15s steps(1) infinite",
                      zIndex: 1,
                      userSelect: "none",
                    }}
                  >
                    DIVYANSH'S
                    <br />
                    <span>PORTFOLIO</span>
                  </div>
                </>
              )}
              <div
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "clamp(28px, 5vw, 50px)",
                  fontWeight: 900,
                  letterSpacing: "0.1em",
                  color: "#0f172a",
                  textTransform: "uppercase",
                  lineHeight: 1,
                  animation: glitch
                    ? "chromatic-shift 0.1s linear infinite"
                    : "flicker-idle 6s ease-in-out infinite",
                }}
              >
                DIVYANSH'S
              </div>
              <div
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "clamp(30px, 5.5vw, 56px)",
                  fontWeight: 900,
                  letterSpacing: "0.1em",
                  color: "#bb0016",
                  textTransform: "uppercase",
                  lineHeight: 1,
                  animation: "red-glow-pulse 1.8s ease-in-out infinite",
                }}
              >
                PORTFOLIO
              </div>

              {/* Accent line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  delay: 0.6,
                  duration: 0.8,
                  ease: [0.76, 0, 0.24, 1],
                }}
                style={{
                  height: 2,
                  margin: "10px 0 6px",
                  background:
                    "linear-gradient(90deg, transparent 0%, #bb0016 20%, #f1c100 50%, #bb0016 80%, transparent 100%)",
                }}
              />
              <div
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "9px",
                  letterSpacing: "0.35em",
                  color: "#f1c100",
                  textTransform: "uppercase",
                }}
              >
                CHASSIS: RB20 • UNIT: RBPT-H001 • SEASON: 2024
              </div>
            </div>

            {/* REV LIGHTS */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                display: "flex",
                gap: 5,
                marginBottom: 22,
                background: "#f1f5f9",
                padding: "10px 18px",
                border: "1px solid #e2e8f0",
                clipPath:
                  "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
              }}
            >
              {[...Array(15)].map((_, i) => {
                const lit = progress >= (i / 15) * 100;
                return (
                  <motion.div
                    key={i}
                    style={{
                      width: 13,
                      height: 13,
                      borderRadius: "50%",
                      background: getLightColor(i),
                      boxShadow: getLightGlow(i),
                      transition: "all 0.08s ease",
                    }}
                    animate={lit ? { scale: [1, 1.35, 1] } : {}}
                    transition={{ duration: 0.12 }}
                  />
                );
              })}
            </motion.div>

            {/* CIRCUIT MAP + TELEMETRY BARS */}
            <div
              style={{
                display: "flex",
                gap: 28,
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              {/* G-force gauge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    fontSize: 7,
                    color: "#64748b",
                    letterSpacing: "0.18em",
                  }}
                >
                  LATERAL G
                </div>
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="#e2e8f0"
                    strokeWidth="7"
                    fill="none"
                  />
                  {/* Tick marks */}
                  {[...Array(9)].map((_, i) => {
                    const angle = ((-135 + i * 33.75) * Math.PI) / 180;
                    return (
                      <line
                        key={i}
                        x1={40 + Math.cos(angle) * 27}
                        y1={40 + Math.sin(angle) * 27}
                        x2={40 + Math.cos(angle) * 32}
                        y2={40 + Math.sin(angle) * 32}
                        stroke="#cbd5e1"
                        strokeWidth="1.5"
                      />
                    );
                  })}
                  <motion.circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="#bb0016"
                    strokeWidth="7"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 32}`}
                    animate={{
                      strokeDashoffset:
                        2 * Math.PI * 32 * (1 - Math.min(gForce / 5, 1) * 0.75),
                    }}
                    style={{
                      transformOrigin: "40px 40px",
                      transform: "rotate(-135deg)",
                    }}
                    transition={{ duration: 0.1 }}
                  />
                  <text
                    x="40"
                    y="43"
                    textAnchor="middle"
                    fill="#0f172a"
                    fontFamily="Orbitron, monospace"
                    fontSize="11"
                    fontWeight="700"
                  >
                    {gForce.toFixed(1)}G
                  </text>
                </svg>
              </motion.div>

              {/* Spa Circuit */}
              <div style={{ position: "relative", width: 150, height: 150 }}>
                <svg
                  viewBox="0 0 200 200"
                  style={{ width: "100%", height: "100%", opacity: 0.12 }}
                  fill="none"
                >
                  <path
                    d="M40,140 L45,155 C50,165 65,170 80,165 L160,110 C175,100 180,85 170,70 L160,40 C155,25 140,20 125,30 L80,60 C70,65 60,60 55,50 L45,30 C40,20 25,25 20,40 L30,100 C32,115 25,125 15,130 L10,135 C5,140 10,150 20,150 L40,140 Z"
                    stroke="#1e293b"
                    strokeWidth="6"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg
                  viewBox="0 0 200 200"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                  }}
                  fill="none"
                >
                  <motion.path
                    d="M40,140 L45,155 C50,165 65,170 80,165 L160,110 C175,100 180,85 170,70 L160,40 C155,25 140,20 125,30 L80,60 C70,65 60,60 55,50 L45,30 C40,20 25,25 20,40 L30,100 C32,115 25,125 15,130 L10,135 C5,140 10,150 20,150 L40,140 Z"
                    stroke="#bb0016"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: progress / 100 }}
                    transition={{ type: "spring", stiffness: 25, damping: 12 }}
                    style={{
                      filter: "drop-shadow(0 0 8px rgba(187,0,22,0.9))",
                    }}
                  />
                </svg>
                {/* Spinning wheel dot */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    position: "absolute",
                    top: "25%",
                    left: "48%",
                    width: 10,
                    height: 10,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      border: "2px solid #f1c100",
                      borderTopColor: "transparent",
                    }}
                  />
                </motion.div>
                <div
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -4,
                    background: "#f1f5f9",
                    border: "1px solid #e2e8f0",
                    padding: "2px 6px",
                    fontFamily: "'Orbitron', monospace",
                    fontSize: 6,
                    color: "#64748b",
                    letterSpacing: "0.1em",
                  }}
                >
                  SPA-FRANCORCHAMPS
                </div>
              </div>

              {/* Pedal/Steer bars */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                style={{ display: "flex", flexDirection: "column", gap: 7 }}
              >
                {[
                  { label: "THROTTLE", value: throttle, color: "#22c55e" },
                  { label: "BRAKE", value: brake, color: "#dc2626" },
                  { label: "STEER", value: steering, color: "#3b82f6" },
                  {
                    label: "MGU-K",
                    value: Math.min(100, progress + 5),
                    color: "#f1c100",
                  },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    style={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <div
                      style={{
                        fontFamily: "'Orbitron', monospace",
                        fontSize: 7,
                        color: "#94a3b8",
                        letterSpacing: "0.15em",
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        width: 110,
                        height: 5,
                        background: "#f1f5f9",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <motion.div
                        animate={{ width: `${value}%` }}
                        style={{
                          height: "100%",
                          background: color,
                          boxShadow: `0 0 6px ${color}`,
                        }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* PROGRESS BAR SECTION */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                alignItems: "center",
                width: "100%",
              }}
            >
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: 9,
                  letterSpacing: "0.35em",
                  color: "#f1c100",
                  textTransform: "uppercase",
                }}
              >
                ● SYNCING TELEMETRY DATA
              </motion.div>

              <div style={{ position: "relative", width: 340 }}>
                {/* Floating % */}
                <motion.div
                  animate={{ left: `${Math.min(Math.max(progress, 2), 97)}%` }}
                  style={{
                    position: "absolute",
                    top: -20,
                    fontSize: 10,
                    fontFamily: "'Orbitron', monospace",
                    color: "#bb0016",
                    fontWeight: 700,
                    transform: "translateX(-50%)",
                    textShadow: "0 0 12px rgba(187,0,22,0.9)",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {Math.floor(progress)}%
                </motion.div>

                <div
                  style={{
                    width: "100%",
                    height: 10,
                    background: "#f1f5f9",
                    border: "1px solid #e2e8f0",
                    clipPath:
                      "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    style={{
                      height: "100%",
                      background:
                        "linear-gradient(90deg, #550000, #bb0016 60%, #ff3344)",
                      boxShadow: "0 0 20px rgba(187,0,22,0.6)",
                    }}
                    transition={{ duration: 0.15 }}
                  />
                  {/* Shimmer on bar */}
                  <motion.div
                    animate={{ x: ["-100%", "300%"] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "30%",
                      height: "100%",
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                    }}
                  />
                </div>

                {/* Sector marker lines */}
                {[33, 66].map((pct) => (
                  <div
                    key={pct}
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: `${pct}%`,
                      width: 1,
                      background:
                        sectorCrossed >= (pct > 50 ? 2 : 1)
                          ? "#f1c100"
                          : "#cbd5e1",
                      transition: "background 0.3s ease",
                    }}
                  />
                ))}
              </div>

              <div
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: 8,
                  color: "#94a3b8",
                  letterSpacing: "0.2em",
                }}
              >
                ENGINE: RBPT-H001 | TYRES: SOFT C5 | TEMP:{" "}
                {Math.round(85 + progress * 0.12)}°C
              </div>
            </motion.div>
          </motion.div>

          {/* SCREEN FLASH on sector / finish */}
          <AnimatePresence>
            {flashColor && (
              <motion.div
                key={flashColor + Date.now()}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.25, 0.1, 0.2, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: flashColor,
                  pointerEvents: "none",
                  zIndex: 60,
                }}
              />
            )}
          </AnimatePresence>

          {/* SPEED LINES */}
          {[...Array(14)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                background:
                  i % 4 === 0
                    ? "rgba(187,0,22,0.15)"
                    : i % 3 === 0
                      ? "rgba(241,193,0,0.1)"
                      : "rgba(15,23,42,0.05)",
                height: i % 5 === 0 ? 2 : 1,
                pointerEvents: "none",
              }}
              initial={{
                width: 40 + Math.random() * 180,
                x: -250,
                y: `${5 + Math.random() * 90}%`,
              }}
              animate={{ x: "120vw" }}
              transition={{
                duration: 0.15 + Math.random() * 0.35,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "linear",
              }}
            />
          ))}

          {/* Bottom status line */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            style={{
              position: "absolute",
              bottom: 20,
              left: "50%",
              transform: "translateX(-50%)",
              fontFamily: "'Orbitron', monospace",
              fontSize: 7,
              color: "#94a3b8",
              letterSpacing: "0.25em",
              whiteSpace: "nowrap",
            }}
          >
            © DIVYANSH PORTFOLIO — FIA HOMOLOGATED — CONFIDENTIAL TECHNICAL DATA
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
