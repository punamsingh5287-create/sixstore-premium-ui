import { Link } from "@tanstack/react-router";
import { ChevronLeft, Crown, ShoppingBag, Wallet } from "lucide-react";
import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { useSwipeSections } from "./useSwipeSections";
import { cartTotals, inr, useCart } from "@/lib/cart-store";

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
  membership,
  walletBalance,
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
  membership?: string;
  walletBalance?: number;
}) {
  const cart = useCart();
  const { count } = cartTotals(cart);
  const swipe = useSwipeSections(!hideNav);
  return (
    <div
      ref={swipe.ref}
      className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-background"
    >

      <header className="safe-top sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 pb-3">
          {back ? (
            onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="bounce-press ripple grid size-11 shrink-0 place-items-center rounded-full glass-btn text-foreground"
                aria-label="Go back"
              >
                <ChevronLeft className="size-5" />
              </button>
            ) : (
            <Link
              to={backTo ?? "/"}
              className="bounce-press ripple grid size-11 shrink-0 place-items-center rounded-full glass-btn text-foreground"
              aria-label="Go back"
            >
              <ChevronLeft className="size-5" />
            </Link>
            )
          ) : (
            <Link to="/" aria-label="SixStore home" className="press relative grid size-11 shrink-0 place-items-center">
              <span
                aria-hidden="true"
                className="glow-breathe accent-glow absolute -inset-2 rounded-full blur-xl"
              />
              <span className="logo-3d float-soft relative grid size-11 place-items-center overflow-hidden rounded-2xl border border-primary/30">
                <img
                  src={brandLogo.url}
                  alt="SixStore"
                  className="size-11 scale-[1.35] object-contain mix-blend-screen invert drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-2xl bg-gradient-to-b from-white/20 to-transparent"
                />
              </span>
            </Link>
          )}
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-1.5">
              <h1 className="truncate text-[17px] font-bold leading-tight tracking-tight text-foreground">
                {title}
              </h1>
              {membership ? (
                <span className="glass-chip inline-flex shrink-0 items-center gap-1 rounded-full border border-primary/35 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                  <Crown className="size-3" />
                  {membership}
                </span>
              ) : null}
            </div>
            {subtitle ? (
              <p className="truncate text-xs leading-tight text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {typeof walletBalance === "number" ? (
              <Link
                to="/wallet"
                aria-label={`Wallet balance ${inr(walletBalance)}`}
                className="bounce-press ripple glass-chip flex h-11 items-center gap-1.5 rounded-full border border-border/70 px-3"
              >
                <Wallet className="size-4 text-primary" />
                <span className="text-xs font-bold text-foreground">{inr(walletBalance)}</span>
              </Link>
            ) : null}
            {showCart ? (
            <Link
              to="/cart"
              aria-label="Open cart"
              className="bounce-press ripple glass-chip relative grid size-11 shrink-0 place-items-center rounded-full border border-border/70 text-foreground"
            >
              <ShoppingBag className="size-5" />
              {count > 0 ? (
                <span className="pop-in absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
                  {count}
                </span>
              ) : null}
            </Link>
            ) : typeof walletBalance === "number" ? null : (
              <div className="size-11" />
            )}
          </div>
        </div>
        {search ? <div className="px-4 pb-3">{search}</div> : null}
      </header>
      <main
        key={swipe.isSection ? swipe.key : undefined}
        className={cn(
          "flex-1 px-4 pt-4",
          swipe.isSection ? swipe.animationClass : "page-in",
          hideNav ? "pb-10" : "pb-32",
          footer && (hideNav ? "pb-32" : "pb-48"),
        )}
      >
        {children}
      </main>
      {footer ? (
        <div
          className={cn(
            "glass-nav safe-bottom fixed inset-x-0 z-30 mx-auto max-w-[480px] px-4 py-3",
            hideNav ? "bottom-0 rounded-t-[28px]" : "bottom-[86px] rounded-[24px]",
          )}
        >
          {footer}
        </div>
      ) : null}

      {hideNav ? null : <BottomNav />}
    </div>
  );
}