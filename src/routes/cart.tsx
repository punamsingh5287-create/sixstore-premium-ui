import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { ProductLogo } from "@/components/ProductCard";
import { EmptyState, RowSkeletonList, useScreenLoad } from "@/components/states";
import { cartActions, cartTotals, inr, useCart } from "@/lib/cart-store";
export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your cart — SixStore" },
      {
        name: "description",
        content: "Review your OTT and AI tool subscriptions, apply wallet balance and check out.",
      },
      { property: "og:title", content: "Your cart — SixStore" },
      { property: "og:description", content: "Review subscriptions and check out on SixStore." },
    ],
  }),
  component: CartScreen,
});
function CartScreen() {
  const loading = useScreenLoad(400);
  const cart = useCart();
  const { detailed, subtotal, savings, walletApplied, payable, count } = cartTotals(cart);
  const [useWallet, setUseWallet] = useState(true);
  const [method, setMethod] = useState("upi");
  const total = useWallet ? payable : subtotal;
  return (
    <AppShell
      title="Cart"
      subtitle={count > 0 ? `${count} item${count > 1 ? "s" : ""}` : "Nothing here yet"}
      showCart={false}
      footer={
        detailed.length > 0 && !loading ? (
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">Payable</p>
              <p className="text-base font-bold text-foreground">{inr(total)}</p>
            </div>
            <button
              onClick={() => toast.success("Order placed — this is a demo checkout")}
              className="min-h-12 flex-1 rounded-full bg-primary text-sm font-semibold text-primary-foreground active:scale-95"
            >
              Place order
            </button>
          </div>
        ) : null
      }
    >
      {loading ? (
        <RowSkeletonList count={3} />
      ) : detailed.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          body="Add an OTT subscription or an AI tool seat and it will show up here."
          action={
            <Link
              to="/categories"
              className="flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
            >
              Browse store
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-5">
          <section className="flex flex-col gap-3">
            {detailed.map((l) => (
              <div
                key={`${l.productId}-${l.planId}`}
                className="flex gap-3 rounded-2xl border border-border bg-card p-3"
              >
                <ProductLogo product={l.product} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-card-foreground">
                    {l.product.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{l.planLabel}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      aria-label="Decrease quantity"
                      onClick={() => cartActions.setQty(l.productId, l.planId, l.qty - 1)}
                      className="grid size-9 place-items-center rounded-full bg-secondary text-foreground active:scale-95"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold text-foreground">
                      {l.qty}
                    </span>
                    <button
                      aria-label="Increase quantity"
                      onClick={() => cartActions.setQty(l.productId, l.planId, l.qty + 1)}
                      className="grid size-9 place-items-center rounded-full bg-secondary text-foreground active:scale-95"
                    >
                      <Plus className="size-4" />
                    </button>
                    <button
                      aria-label={`Remove ${l.product.name}`}
                      onClick={() => cartActions.remove(l.productId, l.planId)}
                      className="ml-auto grid size-9 place-items-center rounded-full bg-secondary text-muted-foreground active:scale-95"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold text-foreground">{inr(l.price * l.qty)}</p>
                  <p className="text-[11px] text-muted-foreground line-through">
                    {inr(l.mrp * l.qty)}
                  </p>
                </div>
              </div>
            ))}
          </section>
          <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
            <h2 className="text-sm font-semibold text-foreground">Payment</h2>
            <label className="flex min-h-11 items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">
                Use wallet balance ({inr(walletApplied)})
              </span>
              <input
                type="checkbox"
                checked={useWallet}
                onChange={(e) => setUseWallet(e.target.checked)}
                className="size-5 accent-[var(--primary)]"
              />
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "upi", label: "UPI" },
                { id: "card", label: "Card" },
                { id: "crypto", label: "Crypto" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`min-h-11 rounded-xl border text-sm font-medium active:scale-95 ${
                    method === m.id
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </section>
          <section className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 text-sm">
            <Row label="Subtotal" value={inr(subtotal)} />
            <Row label="You save" value={`- ${inr(savings)}`} accent />
            {useWallet ? <Row label="Wallet applied" value={`- ${inr(walletApplied)}`} accent /> : null}
            <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
              <span className="font-semibold text-foreground">Total payable</span>
              <span className="font-bold text-foreground">{inr(total)}</span>
            </div>
          </section>
        </div>
      )}
    </AppShell>
  );
}
function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={accent ? "font-medium text-success" : "text-foreground"}>{value}</span>
    </div>
  );
}