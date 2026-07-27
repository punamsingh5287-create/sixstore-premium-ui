import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ProductLogo } from "@/components/ProductCard";
import { EmptyState, ErrorState, RowSkeletonList, useScreenLoad } from "@/components/states";
import { inr } from "@/lib/cart-store";
import { getProduct, orders as mockOrders } from "@/lib/mock-data";
export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Your orders — SixStore" },
      {
        name: "description",
        content: "Track delivery status and warranty on your SixStore subscription orders.",
      },
      { property: "og:title", content: "Your orders — SixStore" },
      { property: "og:description", content: "Delivery status and history for every SixStore order." },
    ],
  }),
  component: OrdersScreen,
});
const statusStyles: Record<string, string> = {
  delivered: "bg-success/15 text-success",
  processing: "bg-primary/15 text-primary",
  failed: "bg-destructive/15 text-destructive",
};
function OrdersScreen() {
  const loading = useScreenLoad(500);
  const [failed, setFailed] = useState(false);
  const [filter, setFilter] = useState<"all" | "delivered" | "processing" | "failed">("all");
  const list = mockOrders.filter((o) => filter === "all" || o.status === filter);
  return (
    <AppShell title="Orders" subtitle="Delivery status & history">
      <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4">
        {(["all", "processing", "delivered", "failed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`min-h-10 shrink-0 rounded-full border px-4 text-sm capitalize active:scale-95 ${
              filter === f
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border text-muted-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      {loading ? (
        <RowSkeletonList count={4} />
      ) : failed ? (
        <ErrorState
          message="We couldn't load your order history just now."
          onRetry={() => setFailed(false)}
        />
      ) : list.length === 0 ? (
        <EmptyState
          title="No orders yet"
          body="Once you buy a subscription it will appear here with live delivery status."
          action={
            <Link
              to="/categories"
              className="flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
            >
              Start shopping
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((o) => {
            const product = getProduct(o.productId);
            return (
              <div key={o.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3">
                <div className="flex items-center gap-3">
                  {product ? <ProductLogo product={product} size={44} /> : null}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-card-foreground">
                      {product?.name ?? "Subscription"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {o.planLabel} · {o.placedAt}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${statusStyles[o.status]}`}
                  >
                    {o.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{o.note}</p>
                <div className="flex items-center justify-between border-t border-border pt-2">
                  <span className="text-[11px] text-muted-foreground">Order {o.id}</span>
                  <span className="text-sm font-bold text-foreground">{inr(o.amount)}</span>
                </div>
              </div>
            );
          })}
          <button
            onClick={() => setFailed(true)}
            className="mx-auto mt-2 min-h-11 text-xs text-muted-foreground underline"
          >
            Having trouble loading orders?
          </button>
        </div>
      )}
    </AppShell>
  );
}