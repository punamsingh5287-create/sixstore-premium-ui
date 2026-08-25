import { useEffect, useRef, useState } from "react";

/**
 * Premium iOS-style content fade: while the user scrolls, the page content
 * softly dims/recedes; when scrolling settles it eases back to full clarity.
 * Nav buttons are never hidden.
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

    const settle = () => {
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setScrolling(false), 220);
    };

    const onScroll = () => {
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
