import { useEffect, useRef, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { navIndexFor, navSections } from "@/lib/nav-sections";

/**
 * Horizontal swipe between bottom-nav sections.
 * Ignores vertical scrolling and swipes that start inside horizontal scrollers.
 */
export function useSwipeSections(enabled: boolean) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const index = navIndexFor(pathname);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const prevIndex = useRef(index);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (index >= 0 && index !== prevIndex.current) {
      setDirection(index > prevIndex.current ? "right" : "left");
      prevIndex.current = index;
    }
  }, [index]);

  useEffect(() => {
    const node = ref.current;
    if (!node || !enabled || index < 0) return;

    let startX = 0;
    let startY = 0;
    let tracking = false;
    let decided: "h" | "v" | null = null;

    function inHorizontalScroller(target: EventTarget | null) {
      let el = target as HTMLElement | null;
      while (el && el !== node) {
        if (el.scrollWidth > el.clientWidth + 8) {
          const style = getComputedStyle(el);
          if (/(auto|scroll)/.test(style.overflowX)) return true;
        }
        el = el.parentElement;
      }
      return false;
    }

    function onStart(e: TouchEvent) {
      if (e.touches.length !== 1) return;
      if (inHorizontalScroller(e.target)) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      tracking = true;
      decided = null;
    }

    function onMove(e: TouchEvent) {
      if (!tracking) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (!decided && (Math.abs(dx) > 12 || Math.abs(dy) > 12)) {
        decided = Math.abs(dx) > Math.abs(dy) * 1.4 ? "h" : "v";
      }
      if (decided === "v") tracking = false;
    }

    function onEnd(e: TouchEvent) {
      if (!tracking || decided !== "h") {
        tracking = false;
        return;
      }
      tracking = false;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) < 60) return;
      const next = dx < 0 ? index + 1 : index - 1;
      if (next < 0 || next >= navSections.length) return;
      navigate({ to: navSections[next] });
    }

    node.addEventListener("touchstart", onStart, { passive: true });
    node.addEventListener("touchmove", onMove, { passive: true });
    node.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      node.removeEventListener("touchstart", onStart);
      node.removeEventListener("touchmove", onMove);
      node.removeEventListener("touchend", onEnd);
    };
  }, [enabled, index, navigate]);

  return {
    ref,
    isSection: index >= 0,
    animationClass:
      index < 0 ? "" : direction === "right" ? "slide-from-right" : "slide-from-left",
    key: pathname,
  };
}
