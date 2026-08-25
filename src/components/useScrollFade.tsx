import { useEffect, useRef, useState } from "react";

/**
 * Premium iOS-style content fade: while the user scrolls, the whole page
 * content softly fades/recedes (with a light blur); when scrolling settles
 * it eases back to full clarity. Nav buttons are never hidden.
 * Small accidental scroll jitters are ignored via a movement threshold.
 */
export function useScrollFade(enabled = true) {
  const [scrolling, setScrolling] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      setScrolling(false);
      return;
    }
    let raf = 0;
    let lastY = window.scrollY;

    const settle = () => {
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setScrolling(false), 240);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const moved = Math.abs(y - lastY) > 6;
      lastY = y;
      if (!moved) return;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          setScrolling(true);
        });
      }
      settle();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [enabled]);

  return scrolling;
}
