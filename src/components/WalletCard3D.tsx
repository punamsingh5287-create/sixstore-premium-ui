import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { inr } from "@/lib/cart-store";
import { wallet } from "@/lib/mock-data";

export function WalletCard3D() {
  return (
    <section className="relative">
      <div className="absolute inset-x-4 -bottom-1.5 h-6 rounded-3xl border border-border/60 bg-card/70" />
      <div
        className="tilt relative overflow-hidden rounded-3xl border border-primary/25 p-4"
        style={{
          backgroundImage:
            "linear-gradient(135deg, color-mix(in oklab, var(--primary) 22%, var(--card)), var(--card) 60%)",
          boxShadow: "var(--shadow-gold), var(--shadow-float)",
        }}
      >
        <span className="pointer-events-none absolute -left-10 -top-14 size-36 rotate-12 rounded-full bg-white/10 blur-2xl" />
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
              {wallet.tier} wallet
            </p>
            <p className="truncate font-display text-2xl font-bold leading-tight text-foreground">
              {inr(wallet.balance)}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">5% back on every top-up</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/wallet"
              className="bounce-press ripple flex min-h-10 items-center rounded-full glass-btn bg-background/40 px-3.5 text-xs font-semibold text-foreground backdrop-blur"
            >
              Top up
            </Link>
            <Link
              to="/categories"
              aria-label="Browse store"
              className="bounce-press ripple grid size-10 place-items-center rounded-full glass-btn-primary"
            >
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}