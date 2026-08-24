import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Home, LayoutGrid, Receipt, User, Wallet } from "lucide-react";
import { navIndexFor, navSections } from "@/lib/nav-sections";

const items = [
  { to: "/", label: "Home", Icon: Home, exact: true },
  { to: "/categories", label: "Browse", Icon: LayoutGrid, exact: false },
  { to: "/orders", label: "Orders", Icon: Receipt, exact: false },
  { to: "/wallet", label: "Wallet", Icon: Wallet, exact: false },
  { to: "/profile", label: "Profile", Icon: User, exact: false },
] as const;

function haptic() {
  try {
    const tg = (window as unknown as {
      Telegram?: { WebApp?: { HapticFeedback?: { selectionChanged?: () => void } } };
    }).Telegram;
    tg?.WebApp?.HapticFeedback?.selectionChanged?.();
  } catch {
    /* noop */
  }
  try {
    navigator.vibrate?.(6);
  } catch {
    /* noop */
  }
}

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const activeIndex = navIndexFor(pathname);
  const listRef = useRef<HTMLUListElement | null>(null);
  const [dragPos, setDragPos] = useState<number | null>(null);
  const dragging = dragPos !== null;
  const draggedRef = useRef(false);
  const stateRef = useRef({ startX: 0, startPos: 0, cell: 0, index: 0, active: false });

  const cellWidth = () => (listRef.current ? listRef.current.clientWidth / items.length : 0);

  const move = useCallback(
    (clientX: number) => {
      const s = stateRef.current;
      if (!s.active) return;
      const dx = clientX - s.startX;
      if (Math.abs(dx) > 4) draggedRef.current = true;
      const max = s.cell * (items.length - 1);
      const pos = Math.min(max, Math.max(0, s.startPos + dx));
      setDragPos(pos);
      const nearest = Math.round(pos / s.cell);
      if (nearest !== s.index && nearest >= 0 && nearest < items.length) {
        s.index = nearest;
        haptic();
        navigate({ to: navSections[nearest] });
      }
    },
    [navigate],
  );

  const endDrag = useCallback(() => {
    const s = stateRef.current;
    if (!s.active) return;
    s.active = false;
    setDragPos(null);
    window.setTimeout(() => {
      draggedRef.current = false;
    }, 60);
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!stateRef.current.active) return;
      move(e.clientX);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!stateRef.current.active) return;
      e.preventDefault();
      move(e.touches[0].clientX);
    };
    const onUp = () => endDrag();
    document.addEventListener("pointermove", onMove);
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("pointerup", onUp);
    document.addEventListener("pointercancel", onUp);
    document.addEventListener("touchend", onUp);
    document.addEventListener("touchcancel", onUp);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);
      document.removeEventListener("touchend", onUp);
      document.removeEventListener("touchcancel", onUp);
      document.removeEventListener("mouseup", onUp);
    };
  }, [move, endDrag]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLUListElement>) => {
      if (activeIndex < 0 || !listRef.current) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const rect = listRef.current.getBoundingClientRect();
      const cell = rect.width / items.length;
      const x = e.clientX - rect.left;
      // Only start dragging from the active tab's own icon/label area.
      if (x < activeIndex * cell || x > (activeIndex + 1) * cell) return;
      stateRef.current = {
        startX: e.clientX,
        startPos: activeIndex * cell,
        cell,
        index: activeIndex,
        active: true,
      };
      draggedRef.current = false;
      setDragPos(activeIndex * cell);
    },
    [activeIndex],
  );


  useEffect(() => {
    if (!dragging) return;
    const prev = document.body.style.userSelect;
    document.body.style.userSelect = "none";
    return () => {
      document.body.style.userSelect = prev;
    };
  }, [dragging]);

  const indicatorX = dragPos ?? (activeIndex >= 0 ? activeIndex * cellWidth() : 0);

  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] px-3 pt-2">
      <ul
        ref={listRef}
        onPointerDown={onPointerDown}
        onPointerUp={endDrag}

        onClickCapture={(e) => {
          if (draggedRef.current) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        style={{ touchAction: "none" }}
        className="glass-nav relative grid grid-cols-5 rounded-[28px]"
      >
        {activeIndex >= 0 ? (
          <li
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-1/5"
            style={{
              transform: `translate3d(${indicatorX}px,0,0)`,
              transition: dragging
                ? "none"
                : "transform 420ms cubic-bezier(0.34, 1.42, 0.44, 1)",
            }}
          >
            <span
              className="absolute left-1/2 top-2 h-8 w-12 -translate-x-1/2 rounded-full border border-primary/25 bg-primary/15 backdrop-blur-md shadow-[inset_0_1px_0_color-mix(in_oklab,white_22%,transparent),0_0_18px_-4px_hsl(var(--primary)/0.55)] transition-transform duration-200"
              style={{ transform: dragging ? "translateX(-50%) scale(1.08)" : undefined }}
            />
          </li>
        ) : null}
        {items.map(({ to, label, Icon, exact }, i) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact }}
              draggable={false}
              className="press group flex min-h-[58px] flex-col items-center justify-center gap-0.5 text-muted-foreground data-[status=active]:text-primary"
            >
              <span className="relative grid h-8 w-12 place-items-center rounded-full">
                {i === activeIndex && !dragging ? (
                  <span key={pathname} aria-hidden="true" className="nav-pulse absolute inset-0 rounded-full" />
                ) : null}
                <Icon className="relative size-[21px] transition-transform duration-200 group-data-[status=active]:-translate-y-px group-data-[status=active]:scale-110" />
              </span>
              <span className="text-[11px] font-medium group-data-[status=active]:font-semibold">
                {label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
