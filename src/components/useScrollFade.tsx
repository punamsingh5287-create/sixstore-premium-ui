import { useEffect, useState } from "react";

/**
 * Returns true once the page is scrolled past a small threshold.
 * Used to reveal the premium top-edge fade: content scrolling up
 * softly disappears under the header instead of being cut off hard.
 */
export function useScrollFade(threshold = 10) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setScrolled(window.scrollY > threshold);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [threshold]);

  return scrolled;
}
