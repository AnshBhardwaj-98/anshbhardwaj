import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  // Smooth spring-based position for the main cursor
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  // Faster spring for the inner dot
  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);
  const fastSpringConfig = { damping: 20, stiffness: 500, mass: 0.3 };
  const fastSmoothX = useSpring(dotX, fastSpringConfig);
  const fastSmoothY = useSpring(dotY, fastSpringConfig);

  // Update positions on mouse move
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [cursorX, cursorY, dotX, dotY]);

  // Detect hover over interactive elements
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.matches(
        'a, button, [role="button"], input, textarea, select, .interactive, [data-cursor="pointer"]',
      );
      setIsHovering(isInteractive);
    };
    const handleMouseOut = () => setIsHovering(false);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Hide default cursor
  useEffect(() => {
    document.body.style.cursor = "none";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <>
      {/* Main glowing orb */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-9999"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          width: isHovering ? 64 : 32,
          height: isHovering ? 64 : 32,
          background:
            "radial-gradient(circle, rgba(0,243,255,0.4) 0%, rgba(188,19,254,0.2) 70%)",
          boxShadow: `0 0 ${isHovering ? 30 : 15}px rgba(0, 243, 255, 0.6)`,
          border: "1px solid rgba(0, 243, 255, 0.8)",
          backdropFilter: "blur(2px)",
          transition: "width 0.2s ease, height 0.2s ease, box-shadow 0.2s ease",
        }}
        animate={{
          scale: isClicking ? 0.8 : 1,
          rotate: isHovering ? 45 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {/* Inner animated glow */}
        <div
          className="absolute inset-0 rounded-full animate-pulse opacity-70"
          style={{
            background:
              "radial-gradient(circle, rgba(188,19,254,0.6) 0%, rgba(0,243,255,0) 80%)",
          }}
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-9999"
        style={{
          x: fastSmoothX,
          y: fastSmoothY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: "#ffffff",
          boxShadow: "0 0 8px #bc13fe",
        }}
        animate={{
          scale: isHovering ? 1.8 : 1,
          opacity: isHovering ? 0.9 : 0.7,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
      />

      {/* Particle trail (optional) – spawns small particles behind cursor */}
      <CursorTrail />
    </>
  );
};

// Optional: particle trail effect
const CursorTrail = () => {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const lastPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let lastTimestamp = 0;
    const spawnInterval = 30; // ms between particles

    const onMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTimestamp > spawnInterval) {
        lastTimestamp = now;
        const newParticle = {
          id: now,
          x: e.clientX,
          y: e.clientY,
        };
        setParticles((prev) => [...prev.slice(-8), newParticle]); // keep last 8 particles
        lastPosition.current = { x: e.clientX, y: e.clientY };
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  // Remove old particles after animation
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => prev.slice(1));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="fixed w-1 h-1 rounded-full bg-neonPurple pointer-events-none z-9998"
          style={{
            left: p.x,
            top: p.y,
            translateX: "-50%",
            translateY: "-50%",
          }}
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      ))}
    </>
  );
};
