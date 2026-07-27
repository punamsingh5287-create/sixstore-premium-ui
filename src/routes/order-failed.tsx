import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProductLogo } from "@/components/ProductCard";
import { inr } from "@/lib/cart-store";
import { methodLabel, summarize, useCheckout, useOrderResult } from "@/lib/checkout-store";
export const Route = createFileRoute("/order-failed")({
  head: () => ({
    meta: [
      { title: "Payment failed — SixStore" },
      {
        name: "description",
        content: "Your SixStore payment could not be completed. Retry or change your payment method.",
      },
      { property: "og:title", content: "Payment failed — SixStore" },
      { property: "og:description", content: "Retry the payment or pick another method on SixStore." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FailureScreen,
});
function FailureScreen() {
  const result = useOrderResult();
  const draft = useCheckout();
  const s = summarize(draft);
  const navigate = useNavigate();
  return (
    <AppShell title="Payment failed" back backTo="/checkout" hideNav showCart={false}>
      <div className="flex flex-col gap-5">
        <section className="layer-card float-shadow flex flex-col items-center gap-3 rounded-3xl border border-destructive/40 p-6 text-center">
          <div className="pop-in grid size-20 place-items-center rounded-full bg-destructive/15">
            <AlertTriangle className="size-9 text-destructive" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Payment failed</h2>
          <p className="max-w-[32ch] text-sm text-muted-foreground">
            We could not complete this payment. No amount has been deducted — any hold is released
            within a few minutes.
          </p>
          <p className="w-full rounded-2xl bg-destructive/10 p-3 text-xs text-destructive">
            Reason: {result?.reason ?? "Bank declined the transaction."}
          </p>
        </section>
        <section className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-4">
          {s.product ? (
            <div className="flex items-center gap-3">
              <ProductLogo product={s.product} size={44} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{s.product.name}</p>
                <p className="text-xs text-muted-foreground">{s.plan?.label}</p>
              </div>
            </div>
          ) : null}
          <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
            <span className="text-muted-foreground">Attempted amount</span>
            <span className="font-bold text-foreground">{inr(result?.amount ?? s.payable)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Payment method</span>
            <span className="font-semibold text-foreground">{methodLabel(result?.method ?? draft.method)}</span>
          </div>
        </section>
        <section className="flex flex-col gap-2">
          <button
            onClick={() => navigate({ to: "/payment" })}
            className="bounce-press ripple min-h-12 rounded-full bg-primary text-sm font-semibold text-primary-foreground"
          >
            Retry payment
          </button>
          <Link
            to="/checkout"
            className="bounce-press ripple flex min-h-12 items-center justify-center rounded-full border border-border text-sm font-semibold text-foreground"
          >
            Change payment method
          </Link>
          <Link
            to="/checkout"
            className="bounce-press ripple flex min-h-12 items-center justify-center rounded-full text-sm font-semibold text-muted-foreground"
          >
            Return to checkout
          </Link>
        </section>
      </div>
    </AppShell>
  );
}
