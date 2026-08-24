import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { navIndexFor, navSections } from "@/lib/nav-sections";

function haptic() {
  try {
    const tg = (window as unknown as {
      Telegram?: { WebApp?: { HapticFeedback?: { impactOccurred?: (s: string) => void } } };
    }).Telegram;
    tg?.WebApp?.HapticFeedback?.impactOccurred?.("light");
  } catch {
    /* noop */
  }
  try {
    navigator.vibrate?.(8);
  } catch {
    /* noop */
  }
}

/**
 * Native-feeling horizontal swipe between bottom-nav sections.
 * The content follows the finger, then settles with iOS-style easing.
 * Vertical scrolling and horizontal scrollers are never hijacked.
 */
export function useSwipeSections(enabled: boolean) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const index = navIndexFor(pathname);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const prevIndex = useRef(index);
  const ref = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (index >= 0 && index !== prevIndex.current) {
      setDirection(index > prevIndex.current ? "right" : "left");
      prevIndex.current = index;
    }
  }, [index]);

  const setContentRef = useCallback((node: HTMLElement | null) => {
    contentRef.current = node;
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node || !enabled || index < 0) return;

    let startX = 0;
    let startY = 0;
    let startT = 0;
    let tracking = false;
    let decided: "h" | "v" | null = null;
    let frame = 0;
    let offset = 0;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function content() {
      return contentRef.current;
    }

    function paint() {
      frame = 0;
      const el = content();
      if (!el) return;
      el.style.transform = offset === 0 ? "" : `translate3d(${offset}px,0,0)`;
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(paint);
    }

    function beginDrag() {
      const el = content();
      if (!el) return;
      el.style.transition = "none";
      el.style.willChange = "transform";
    }

    function settle() {
      const el = content();
      if (!el) return;
      offset = 0;
      el.style.transition = "transform 0.34s cubic-bezier(0.32, 0.72, 0, 1)";
      el.style.transform = "";
      window.setTimeout(() => {
        if (!contentRef.current) return;
        contentRef.current.style.transition = "";
        contentRef.current.style.willChange = "";
      }, 360);
    }

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
      startT = e.timeStamp;
      tracking = true;
      decided = null;
      offset = 0;
    }

    function onMove(e: TouchEvent) {
      if (!tracking) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (!decided && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
        decided = Math.abs(dx) > Math.abs(dy) * 1.4 ? "h" : "v";
        if (decided === "h" && !reduceMotion) beginDrag();
      }
      if (decided === "v") {
        tracking = false;
        return;
      }
      if (decided !== "h" || reduceMotion) return;
      // Rubber-band at the ends of the tab list.
      const atEdge = (dx < 0 && index === navSections.length - 1) || (dx > 0 && index === 0);
      offset = (atEdge ? dx * 0.22 : dx * 0.75);
      schedule();
    }

    function onEnd(e: TouchEvent) {
      if (!tracking || decided !== "h") {
        tracking = false;
        return;
      }
      tracking = false;
      const dx = e.changedTouches[0].clientX - startX;
      const dt = Math.max(1, e.timeStamp - startT);
      const velocity = Math.abs(dx) / dt;
      const threshold = Math.min(96, Math.max(56, node.clientWidth * 0.18));
      const shouldSwitch = Math.abs(dx) > threshold || (velocity > 0.5 && Math.abs(dx) > 28);
      const next = dx < 0 ? index + 1 : index - 1;
      if (shouldSwitch && next >= 0 && next < navSections.length) {
        haptic();
        settle();
        navigate({ to: navSections[next] });
        return;
      }
      settle();
    }

    node.addEventListener("touchstart", onStart, { passive: true });
    node.addEventListener("touchmove", onMove, { passive: true });
    node.addEventListener("touchend", onEnd, { passive: true });
    node.addEventListener("touchcancel", onEnd, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      node.removeEventListener("touchstart", onStart);
      node.removeEventListener("touchmove", onMove);
      node.removeEventListener("touchend", onEnd);
      node.removeEventListener("touchcancel", onEnd);
      const el = contentRef.current;
      if (el) {
        el.style.transform = "";
        el.style.transition = "";
        el.style.willChange = "";
      }
    };
  }, [enabled, index, navigate]);

  return {
    ref,
    setContentRef,
    isSection: index >= 0,
    animationClass:
      index < 0 ? "" : direction === "right" ? "slide-from-right" : "slide-from-left",
    key: pathname,
  };
}
