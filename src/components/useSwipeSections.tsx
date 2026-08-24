import { useEffect, useRef, useState } from "react";
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
 * Page transition bookkeeping only. The main content never moves horizontally
 * with the finger; tab gestures live on the bottom navigation bar itself.
 */
export function useSwipeSections(_enabled: boolean) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const index = navIndexFor(pathname);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const prevIndex = useRef(index);

  useEffect(() => {
    if (index >= 0 && index !== prevIndex.current) {
      setDirection(index > prevIndex.current ? "right" : "left");
      prevIndex.current = index;
    }
  }, [index]);

  return {
    isSection: index >= 0,
    animationClass:
      index < 0 ? "" : direction === "right" ? "slide-from-right" : "slide-from-left",
    key: pathname,
  };
}

/**
 * Horizontal swipe restricted to the bottom navigation bar element.
 * Swipe left -> next tab, swipe right -> previous tab.
 */
export function useNavBarSwipe(activeIndex: number) {
  const navigate = useNavigate();
  const ref = useRef<HTMLElement | null>(null);
  const indexRef = useRef(activeIndex);
  indexRef.current = activeIndex;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let startX = 0;
    let startY = 0;
    let startT = 0;
    let tracking = false;
    let moved = false;

    function onStart(e: TouchEvent) {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startT = e.timeStamp;
      tracking = true;
      moved = false;
    }

    function onMove(e: TouchEvent) {
      if (!tracking) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.4) moved = true;
    }

    function onEnd(e: TouchEvent) {
      if (!tracking) return;
      tracking = false;
      if (!moved) return;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      const dt = Math.max(1, e.timeStamp - startT);
      const velocity = Math.abs(dx) / dt;
      if (Math.abs(dx) < Math.abs(dy) * 1.4) return;
      if (Math.abs(dx) < 40 && !(velocity > 0.45 && Math.abs(dx) > 24)) return;
      const current = indexRef.current;
      const next = dx < 0 ? current + 1 : current - 1;
      if (next < 0 || next >= navSections.length || next === current) return;
      haptic();
      navigate({ to: navSections[next] });
    }

    node.addEventListener("touchstart", onStart, { passive: true });
    node.addEventListener("touchmove", onMove, { passive: true });
    node.addEventListener("touchend", onEnd, { passive: true });
    node.addEventListener("touchcancel", onEnd, { passive: true });
    return () => {
      node.removeEventListener("touchstart", onStart);
      node.removeEventListener("touchmove", onMove);
      node.removeEventListener("touchend", onEnd);
      node.removeEventListener("touchcancel", onEnd);
    };
  }, [navigate]);

  return ref;
}
