import { useEffect, useRef } from "react";

// Muted background loop that only plays while on screen; reduced-motion users get the poster frame.
export const LoopVideo = ({ src, className = "" }: { src: string; className?: string }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {}); // autoplay can be refused; poster stays
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={src.replace(/\.mp4$/, ".jpg")}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
      className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${className}`}
    />
  );
};
