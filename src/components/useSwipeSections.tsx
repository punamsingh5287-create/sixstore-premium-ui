import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { navIndexFor } from "@/lib/nav-sections";

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
