import { Link } from "@tanstack/react-router";
import { ChevronLeft, ShoppingBag } from "lucide-react";
import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { cartTotals, useCart } from "@/lib/cart-store";
import { cn } from "@/lib/utils";
export function AppShell({
  title,
  subtitle,
  back,
  showCart = true,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  showCart?: boolean;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const cart = useCart();
  const { count } = cartTotals(cart);
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
          {back ? (
            <Link
              to="/"
              className="grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-foreground active:scale-95"
              aria-label="Back to home"
            >
              <ChevronLeft className="size-5" />
            </Link>
          ) : (
            <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <span className="font-display text-base font-bold">6</span>
            </div>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-foreground">{title}</h1>
            {subtitle ? (
              <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          {showCart ? (
            <Link
              to="/cart"
              aria-label="Open cart"
              className="relative grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-foreground active:scale-95"
            >
              <ShoppingBag className="size-5" />
              {count > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                  {count}
                </span>
              ) : null}
            </Link>
          ) : (
            <div className="size-11" />
          )}
        </div>
      </header>
      <main className={cn("flex-1 px-4 pb-28 pt-4", footer && "pb-44")}>{children}</main>
      {footer ? (
        <div className="fixed inset-x-0 bottom-[76px] z-30 mx-auto max-w-[480px] border-t border-border/70 bg-background/95 px-4 py-3 backdrop-blur">
          {footer}
        </div>
      ) : null}
      <BottomNav />
    </div>
  );
}