import { Link } from "@tanstack/react-router";
import { ChevronLeft, ShoppingBag } from "lucide-react";
import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { cartTotals, useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";
import brandLogo from "@/assets/sixstore-logo.jpg.asset.json";
export function AppShell({
  title,
  subtitle,
  back,
  backTo,
  onBack,
  hideNav = false,
  showCart = true,
  children,
  footer,
  search,
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  backTo?: string;
  onBack?: () => void;
  hideNav?: boolean;
  showCart?: boolean;
  children: ReactNode;
  footer?: ReactNode;
  search?: ReactNode;
}) {
  const cart = useCart();
  const { count } = cartTotals(cart);
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-background">
      <header className="safe-top sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 pb-3">
          {back ? (
            onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="press grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-foreground"
                aria-label="Go back"
              >
                <ChevronLeft className="size-5" />
              </button>
            ) : (
            <Link
              to={backTo ?? "/"}
              className="press grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-foreground"
              aria-label="Go back"
            >
              <ChevronLeft className="size-5" />
            </Link>
            )
          ) : (
            <Link
              to="/"
              aria-label="SixStore home"
              className="press grid size-11 shrink-0 place-items-center overflow-hidden rounded-2xl border border-primary/25 bg-primary/10"
            >
              <img
                src={brandLogo.url}
                alt="SixStore"
                className="size-11 scale-[1.35] object-contain mix-blend-screen invert"
              />
            </Link>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-[17px] font-bold leading-tight tracking-tight text-foreground">
              {title}
            </h1>
            {subtitle ? (
              <p className="truncate text-xs leading-tight text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          {showCart ? (
            <Link
              to="/cart"
              aria-label="Open cart"
              className="press relative grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-foreground"
            >
              <ShoppingBag className="size-5" />
              {count > 0 ? (
                <span className="pop-in absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                  {count}
                </span>
              ) : null}
            </Link>
          ) : (
            <div className="size-11" />
          )}
        </div>
        {search ? <div className="px-4 pb-3">{search}</div> : null}
      </header>
      <main
        className={cn(
          "page-in flex-1 px-4 pt-4",
          hideNav ? "pb-10" : "pb-32",
          footer && (hideNav ? "pb-32" : "pb-48"),
        )}
      >
        {children}
      </main>
      {footer ? (
        <div
          className={cn(
            "float-shadow safe-bottom fixed inset-x-0 z-30 mx-auto max-w-[480px] border-y border-border/70 bg-background/92 px-4 py-3 backdrop-blur-xl",
            hideNav ? "bottom-0" : "bottom-[86px]",
          )}
        >
          {footer}
        </div>
      ) : null}
      {hideNav ? null : <BottomNav />}
    </div>
  );
}