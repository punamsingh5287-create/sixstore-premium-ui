import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShieldCheck, Zap } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProductLogo } from "@/components/ProductCard";
import { EmptyState, SkeletonBlock, useScreenLoad } from "@/components/states";
import { inr } from "@/lib/cart-store";
import { checkoutActions, paymentMethods, summarize, useCheckout } from "@/lib/checkout-store";
export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — SixStore" },
      {
        name: "description",
        content: "Review your subscription order, pick a payment method and pay securely on SixStore.",
      },
      { property: "og:title", content: "Checkout — SixStore" },
      { property: "og:description", content: "Order summary, payment method and secure checkout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CheckoutScreen,
});
function Row({ label, value, tone }: { label: string; value: string; tone?: "success" }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={tone === "success" ? "font-semibold text-success" : "font-semibold text-foreground"}>
        {value}
      </span>
    </div>
  );
}
function CheckoutScreen() {
  const loading = useScreenLoad(380);
  const draft = useCheckout();
  const navigate = useNavigate();
  const s = summarize(draft);
  if (!s.product || !s.plan) {
    return (
      <AppShell title="Checkout" back hideNav showCart={false}>
        <EmptyState
          title="Nothing to check out"
          body="Pick a subscription first and it will show up here."
          action={
            <Link
              to="/categories"
              className="flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
            >
              Browse store
            </Link>
          }
        />
      </AppShell>
    );
  }
  const product = s.product;
  return (
    <AppShell
      title="Checkout"
      subtitle="Secure · mock payment"
      back
      backTo={`/product/${product.id}`}
      hideNav
      showCart={false}
      footer={
        !loading ? (
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">Total payable</p>
              <p className="text-base font-bold text-foreground">{inr(s.payable)}</p>
            </div>
            <button
              onClick={() => navigate({ to: "/payment" })}
              className="bounce-press ripple min-h-12 flex-1 rounded-full bg-primary text-sm font-semibold text-primary-foreground"
            >
              Continue to Payment
            </button>
          </div>
        ) : null
      }
    >
      {loading ? (
        <div className="flex flex-col gap-4">
          <SkeletonBlock className="h-28" />
          <SkeletonBlock className="h-36" />
          <SkeletonBlock className="h-40" />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <section className="layer-card flex flex-col gap-3 rounded-3xl border border-border p-4">
            <h2 className="text-sm font-semibold text-foreground">Order item</h2>
            <div className="flex items-center gap-3">
              <ProductLogo product={product} size={52} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{product.name}</p>
                <p className="text-xs text-muted-foreground">{s.plan.label} plan</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  aria-label="Decrease quantity"
                  onClick={() => checkoutActions.patch({ qty: Math.max(1, s.qty - 1) })}
                  className="bounce-press ripple grid size-9 place-items-center rounded-full bg-secondary text-foreground"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-5 text-center text-sm font-semibold text-foreground">{s.qty}</span>
                <button
                  aria-label="Increase quantity"
                  onClick={() => checkoutActions.patch({ qty: s.qty + 1 })}
                  className="bounce-press ripple grid size-9 place-items-center rounded-full bg-secondary text-foreground"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 rounded-2xl bg-secondary/60 p-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Zap className="size-3.5 text-primary" /> Instant delivery in chat
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="size-3.5 text-primary" /> Warranty for full plan term
              </span>
            </div>
          </section>
          <section className="flex flex-col gap-2.5 rounded-3xl border border-border bg-card p-4">
            <h2 className="text-sm font-semibold text-foreground">Price summary</h2>
            <Row label={`Item price × ${s.qty}`} value={inr(s.mrpTotal)} />
            <Row label="Discount" value={`- ${inr(s.discount)}`} tone="success" />
            <Row
              label="Wallet applied"
              value={s.walletApplied > 0 ? `- ${inr(s.walletApplied)}` : "Not applied"}
              tone={s.walletApplied > 0 ? "success" : undefined}
            />
            <Row label="Platform fee" value={inr(s.platformFee)} />
            <div className="mt-1 flex items-center justify-between border-t border-border pt-2.5">
              <span className="text-sm font-semibold text-foreground">Total payable</span>
              <span className="text-base font-bold text-foreground">{inr(s.payable)}</span>
            </div>
            <button
              onClick={() => checkoutActions.patch({ useWallet: !draft.useWallet })}
              className="bounce-press ripple mt-1 min-h-10 rounded-full border border-border text-xs font-semibold text-foreground"
            >
              {draft.useWallet ? "Remove wallet balance" : "Use wallet balance (₹500)"}
            </button>
          </section>
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-foreground">Payment method</h2>
            {paymentMethods.map((m) => {
              const selected = m.id === draft.method;
              return (
                <button
                  key={m.id}
                  onClick={() => checkoutActions.patch({ method: m.id })}
                  className={`press flex min-h-[58px] items-center justify-between gap-3 rounded-2xl border px-4 text-left ${
                    selected ? "border-primary bg-primary/10" : "border-border bg-card"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{m.label}</p>
                    <p className="text-[11px] text-muted-foreground">{m.hint}</p>
                  </div>
                  <span
                    className={`grid size-5 shrink-0 place-items-center rounded-full border ${
                      selected ? "border-primary" : "border-border"
                    }`}
                  >
                    {selected ? <span className="size-2.5 rounded-full bg-primary" /> : null}
                  </span>
                </button>
              );
            })}
          </section>
          <section className="rounded-2xl border border-border bg-card p-4 text-[11px] leading-relaxed text-muted-foreground">
            By continuing you agree to the SixStore terms of service, digital-goods refund policy and
            confirm that subscription details will be delivered to your Telegram chat. This is a demo
            checkout — no real payment is processed.
          </section>
        </div>
      )}
    </AppShell>
  );
}
