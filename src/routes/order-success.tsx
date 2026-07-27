import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Truck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProductLogo } from "@/components/ProductCard";
import { inr } from "@/lib/cart-store";
import { methodLabel, useOrderResult } from "@/lib/checkout-store";
import { getProduct } from "@/lib/mock-data";
export const Route = createFileRoute("/order-success")({
  head: () => ({
    meta: [
      { title: "Order confirmed — SixStore" },
      {
        name: "description",
        content: "Your SixStore subscription order is confirmed and being delivered to your chat.",
      },
      { property: "og:title", content: "Order confirmed — SixStore" },
      { property: "og:description", content: "Order confirmed and delivery in progress on SixStore." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SuccessScreen,
});
function SuccessScreen() {
  const result = useOrderResult();
  const product = getProduct(result?.productId ?? "netflix-premium");
  const orderId = result?.orderId ?? "SX-10510";
  return (
    <AppShell title="Order confirmed" back backTo="/orders" hideNav showCart={false}>
      <div className="flex flex-col gap-5">
        <section className="layer-card float-shadow flex flex-col items-center gap-3 rounded-3xl border border-border p-6 text-center">
          <div className="relative grid size-20 place-items-center">
            <span className="success-halo absolute inset-0 rounded-full bg-success/30" aria-hidden="true" />
            <div className="success-ring relative grid size-20 place-items-center rounded-full bg-success/15">
              <div className="grid size-14 place-items-center rounded-full bg-success/25">
                <svg viewBox="0 0 24 24" className="size-8" aria-hidden="true">
                  <path
                    d="M5 12.5l4.5 4.5L19 7.5"
                    className="success-draw"
                    fill="none"
                    stroke="var(--success)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
          <h2 className="text-lg font-bold text-foreground">Order confirmed</h2>
          <p className="max-w-[30ch] text-sm text-muted-foreground">
            Payment received. We are provisioning your subscription right now.
          </p>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground">
            Order {orderId}
          </span>
        </section>
        <section className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4">
          {product ? (
            <div className="flex items-center gap-3">
              <ProductLogo product={product} size={48} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{product.name}</p>
                <p className="text-xs text-muted-foreground">{result?.planLabel ?? "3 Months"} plan</p>
              </div>
            </div>
          ) : null}
          <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
            <span className="text-muted-foreground">Amount paid</span>
            <span className="font-bold text-foreground">{inr(result?.amount ?? 537)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Payment method</span>
            <span className="font-semibold text-foreground">{methodLabel(result?.method ?? "upi")}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Delivery status</span>
            <span className="flex items-center gap-1 font-semibold text-primary">
              <Truck className="size-3.5" /> Processing
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Estimated delivery</span>
            <span className="flex items-center gap-1 font-semibold text-foreground">
              <Clock className="size-3.5 text-muted-foreground" /> Within 5 minutes
            </span>
          </div>
        </section>
        <section className="flex flex-col gap-2">
          <Link
            to="/order/$orderId"
            params={{ orderId }}
            className="bounce-press ripple flex min-h-12 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
          >
            View order
          </Link>
          <Link
            to="/orders"
            className="bounce-press ripple flex min-h-12 items-center justify-center rounded-full border border-border text-sm font-semibold text-foreground"
          >
            Go to Orders
          </Link>
          <Link
            to="/categories"
            className="bounce-press ripple flex min-h-12 items-center justify-center rounded-full text-sm font-semibold text-muted-foreground"
          >
            Continue shopping
          </Link>
        </section>
      </div>
    </AppShell>
  );
}
