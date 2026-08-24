import { Link, useRouterState } from "@tanstack/react-router";
import { Home, LayoutGrid, Receipt, User, Wallet } from "lucide-react";
import { navIndexFor } from "@/lib/nav-sections";
import { useNavBarSwipe } from "./useSwipeSections";
const items = [
  { to: "/", label: "Home", Icon: Home, exact: true },
  { to: "/categories", label: "Browse", Icon: LayoutGrid, exact: false },
  { to: "/orders", label: "Orders", Icon: Receipt, exact: false },
  { to: "/wallet", label: "Wallet", Icon: Wallet, exact: false },
  { to: "/profile", label: "Profile", Icon: User, exact: false },
] as const;
export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const activeIndex = navIndexFor(pathname);
  const navRef = useNavBarSwipe(activeIndex);
  return (
    <nav
      ref={navRef}
      style={{ touchAction: "pan-y" }}
      className="safe-bottom fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] px-3 pt-2"
    >
      <ul className="glass-nav relative grid grid-cols-5 rounded-[28px]">
        {activeIndex >= 0 ? (
          <li
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-1/5 transition-transform duration-[340ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
            style={{ transform: `translate3d(${activeIndex * 100}%,0,0)` }}
          >
            <span className="absolute left-1/2 top-2 h-8 w-12 -translate-x-1/2 rounded-full border border-primary/25 bg-primary/15 shadow-[inset_0_1px_0_color-mix(in_oklab,white_22%,transparent)]" />
          </li>
        ) : null}
        {items.map(({ to, label, Icon, exact }, i) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact }}
              className="press group flex min-h-[58px] flex-col items-center justify-center gap-0.5 text-muted-foreground data-[status=active]:text-primary"
            >
              <span className="relative grid h-8 w-12 place-items-center rounded-full">
                {i === activeIndex ? (
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

