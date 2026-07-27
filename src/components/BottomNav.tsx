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
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[480px] border-t border-border/70 bg-sidebar/98 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="grid grid-cols-5">
        {items.map(({ to, label, Icon, exact }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact }}
              className="press group flex min-h-[64px] flex-col items-center justify-center gap-1 text-muted-foreground data-[status=active]:text-primary"
            >
              <span className="relative grid h-8 w-14 place-items-center rounded-full transition-colors group-data-[status=active]:bg-primary/15">
                <span className="absolute -top-[13px] h-[3px] w-0 rounded-full bg-primary transition-all duration-200 group-data-[status=active]:w-8" />
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