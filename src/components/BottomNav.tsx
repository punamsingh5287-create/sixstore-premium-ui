import { Link } from "@tanstack/react-router";
import { Home, LayoutGrid, Receipt, User, Wallet } from "lucide-react";
const items = [
  { to: "/", label: "Home", Icon: Home, exact: true },
  { to: "/categories", label: "Browse", Icon: LayoutGrid, exact: false },
  { to: "/orders", label: "Orders", Icon: Receipt, exact: false },
  { to: "/wallet", label: "Wallet", Icon: Wallet, exact: false },
  { to: "/profile", label: "Profile", Icon: User, exact: false },
] as const;
export function BottomNav() {
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] px-3 pt-2">
      <ul className="glass-nav grid grid-cols-5 rounded-[28px]">
        {items.map(({ to, label, Icon, exact }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact }}
              className="press group flex min-h-[58px] flex-col items-center justify-center gap-0.5 text-muted-foreground data-[status=active]:text-primary"
            >
              <span className="relative grid h-8 w-12 place-items-center overflow-hidden rounded-full transition-colors duration-200 group-data-[status=active]:border group-data-[status=active]:border-primary/25 group-data-[status=active]:bg-primary/15 group-data-[status=active]:shadow-[inset_0_1px_0_color-mix(in_oklab,white_22%,transparent)]">
                <Icon className="size-[21px] transition-transform duration-200 group-data-[status=active]:-translate-y-px group-data-[status=active]:scale-110" />
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
