import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Check, CreditCard, Download, Headphones, KeyRound, RefreshCw, Truck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProductLogo } from "@/components/ProductCard";
import { EmptyState, SkeletonBlock, useScreenLoad } from "@/components/states";
import { inr } from "@/lib/cart-store";
import { methodLabel, useOrderResult } from "@/lib/checkout-store";
import { getOrder, getProduct, type Order } from "@/lib/mock-data";
export const Route = createFileRoute("/order/$orderId")({
  head: ({ params }) => {
    const title = `Order ${params.orderId} — SixStore`;
    const description = `Status timeline, payment and delivery details for SixStore order ${params.orderId}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  component: OrderDetailsScreen,
});
const statusTone: Record<string, string> = {
  delivered: "bg-success/15 text-success",
  processing: "bg-primary/15 text-primary",
  failed: "bg-destructive/15 text-destructive",
  refunded: "bg-secondary text-muted-foreground",
};
function timelineFor(status: string) {
  const base = [
    { key: "placed", label: "Order placed", body: "We received your order." },
    { key: "paid", label: "Payment confirmed", body: "Amount authorised by your bank." },
    { key: "processing", label: "Provisioning", body: "Preparing your subscription access." },
    { key: "delivered", label: "Delivered", body: "Access details shared in chat." },
  ];
  const reached: Record<string, number> = {
    processing: 2,
    delivered: 3,
    failed: 0,
    refunded: 3,
  };
  const upto = reached[status] ?? 0;
  return base.map((step, i) => {
    if (status === "failed" && step.key === "paid")
      return { ...step, done: false, label: "Payment failed", body: "Your bank declined the transaction." };
    if (status === "refunded" && step.key === "delivered")
      return { ...step, done: true, label: "Refunded to wallet", body: "Amount credited back to your SixStore wallet." };
    return { ...step, done: i <= upto };
  });
}
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate font-semibold text-foreground">{value}</span>
    </div>
  );
}
function OrderDetailsScreen() {
  const { orderId } = Route.useParams();
  const loading = useScreenLoad(420);
  const result = useOrderResult();
  const justPlaced: Order | undefined =
    result && result.orderId === orderId
      ? {
          id: result.orderId,
          productId: result.productId,
          planLabel: result.planLabel,
          placedAt: result.placedAt,
          amount: result.amount,
          status: result.status === "success" ? "processing" : "failed",
          note:
            result.status === "success"
              ? "We are provisioning your subscription — access details arrive in chat shortly."
              : (result.reason ?? "Payment failed. Nothing was charged."),
          method: methodLabel(result.method),
          qty: 1,
          deliveryType: "Instant digital delivery",
          eligibility:
            result.status === "success"
              ? "Replacement available for the full plan term once delivered."
              : "Nothing was charged — retry any time.",
        }
      : undefined;
  const order = getOrder(orderId) ?? justPlaced;
  if (!order) {
    return (
      <AppShell title="Order" back backTo="/orders" showCart={false}>
        <EmptyState
          title="Order not found"
          body="We couldn't find this order. Check your order history for the latest purchases."
          action={
            <Link
              to="/orders"
              className="flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
            >
              Go to Orders
            </Link>
          }
        />
      </AppShell>
    );
  }
  const product = getProduct(order.productId);
  const steps = timelineFor(order.status);
  return (
    <AppShell title={`Order ${order.id}`} subtitle={order.placedAt} back backTo="/orders" showCart={false}>
      {loading ? (
        <div className="flex flex-col gap-4">
          <SkeletonBlock className="h-28" />
          <SkeletonBlock className="h-44" />
          <SkeletonBlock className="h-36" />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <section className="layer-card flex items-center gap-3 rounded-3xl border border-border p-4">
            {product ? <ProductLogo product={product} size={52} /> : null}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {product?.name ?? "Subscription"}
              </p>
              <p className="text-xs text-muted-foreground">
                {order.planLabel} · Qty {order.qty}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${statusTone[order.status]}`}
            >
              {order.status}
            </span>
          </section>
          <section className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4">
            <h2 className="text-sm font-semibold text-foreground">Status timeline</h2>
            <ol className="flex flex-col">
              {steps.map((s, i) => (
                <li key={s.key} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={`grid size-6 shrink-0 place-items-center rounded-full ${
                        s.done ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      <Check className="size-3.5" />
                    </span>
                    {i < steps.length - 1 ? (
                      <span className={`w-px flex-1 ${s.done ? "bg-primary/50" : "bg-border"}`} />
                    ) : null}
                  </div>
                  <div className="pb-4">
                    <p className={`text-xs font-semibold ${s.done ? "text-foreground" : "text-muted-foreground"}`}>
                      {s.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
          <section className="flex flex-col gap-2.5 rounded-3xl border border-border bg-card p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <CreditCard className="size-4 text-primary" /> Payment information
            </h2>
            <InfoRow label="Order ID" value={order.id} />
            <InfoRow label="Placed on" value={order.placedAt} />
            <InfoRow label="Payment method" value={order.method} />
            <InfoRow label="Amount" value={inr(order.amount)} />
          </section>
          <section className="flex flex-col gap-2.5 rounded-3xl border border-border bg-card p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Truck className="size-4 text-primary" /> Delivery information
            </h2>
            <InfoRow label="Delivery type" value={order.deliveryType} />
            <InfoRow label="Delivered to" value="Telegram chat · @aaravm" />
            <p className="text-[11px] text-muted-foreground">{order.note}</p>
          </section>
          <section className="flex flex-col gap-2.5 rounded-3xl border border-border bg-card p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <KeyRound className="size-4 text-primary" /> Access details
            </h2>
            {order.credentials?.length ? (
              order.credentials.map((c) => <InfoRow key={c.label} label={c.label} value={c.value} />)
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-4 text-center text-[11px] text-muted-foreground">
                Access details will appear here once the order is delivered.
              </div>
            )}
          </section>
          <section className="flex items-start gap-3 rounded-3xl border border-border bg-card p-4">
            <RefreshCw className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <p className="text-xs font-semibold text-foreground">Replacement & refund</p>
              <p className="text-[11px] text-muted-foreground">{order.eligibility}</p>
            </div>
          </section>
          <section className="flex flex-col gap-2">
            <button
              onClick={() => toast.success("Receipt download started (demo)")}
              className="press flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground"
            >
              <Download className="size-4" /> Download receipt
            </button>
            <Link
              to="/support"
              className="press flex min-h-12 items-center justify-center gap-2 rounded-full border border-border text-sm font-semibold text-foreground"
            >
              <Headphones className="size-4" /> Contact support
            </Link>
          </section>
        </div>
      )}
    </AppShell>
  );
}
