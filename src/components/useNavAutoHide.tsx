import { useEffect, useRef, useState } from "react";

/**
 * iOS-style auto-hide: hides the bottom nav when scrolling down the page,
 * reveals it when scrolling back up. Uses a threshold so small accidental
 * movements never toggle it, and always shows near the top of the page.
 */
export function useNavAutoHide(enabled = true, threshold = 24) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const anchorY = useRef(0);

  useEffect(() => {
    if (!enabled) {
      setHidden(false);
      return;
    }
    lastY.current = window.scrollY;
    anchorY.current = window.scrollY;
    let raf = 0;

    const evaluate = () => {
      raf = 0;
      const y = Math.max(0, window.scrollY);
      const goingDown = y > lastY.current;
      const prevDown = y > anchorY.current;

      // reset the anchor whenever direction flips
      if (goingDown !== prevDown) anchorY.current = lastY.current;

      const delta = y - anchorY.current;

      if (y < 48) {
        setHidden(false);
        anchorY.current = y;
      } else if (delta > threshold) {
        setHidden(true);
        anchorY.current = y;
      } else if (delta < -threshold) {
        setHidden(false);
        anchorY.current = y;
      }

      lastY.current = y;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(evaluate);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled, threshold]);

  return hidden;
}
