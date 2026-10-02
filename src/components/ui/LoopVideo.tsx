import { useEffect, useRef } from "react";

// Muted background loop. By default it plays only while on screen; pass `playing` to control it
// directly (e.g. a sticky footer that is technically always "on screen" but hidden behind the page).
// Reduced-motion users get the poster frame.
export const LoopVideo = ({ src, className = "", playing }: { src: string; className?: string; playing?: boolean }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const controlled = playing !== undefined;

  useEffect(() => {
    const video = ref.current;
    if (!video || controlled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting)
        video.play().catch(() => {}); // autoplay can be refused; poster stays
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, [controlled]);

  useEffect(() => {
    const video = ref.current;
    if (!video || !controlled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (playing) video.play().catch(() => {});
    else video.pause();
  }, [controlled, playing]);

  return (
    <video
      ref={ref}
      src={src}
      // controlled (footer) videos skip even the poster download until they are actually needed
      poster={controlled && !playing ? undefined : src.replace(/\.mp4$/, ".jpg")}
      muted
      loop
      playsInline
      preload={controlled ? "none" : "metadata"} // controlled (footer) videos load only when told to play
      aria-hidden
      className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${className}`}
    />
  );
};
