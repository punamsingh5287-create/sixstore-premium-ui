import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ProductLogo } from "@/components/ProductCard";
import { inr } from "@/lib/cart-store";
import { checkoutActions, methodLabel, summarize, useCheckout } from "@/lib/checkout-store";
export const Route = createFileRoute("/payment")({
  head: () => ({
    meta: [
      { title: "Processing payment — SixStore" },
      {
        name: "description",
        content: "Secure mock payment processing for your SixStore subscription order.",
      },
      { property: "og:title", content: "Processing payment — SixStore" },
      { property: "og:description", content: "Secure payment processing on SixStore." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PaymentScreen,
});
const orderId = () => `SX-${Math.floor(10500 + Math.random() * 400)}`;
function PaymentScreen() {
  const draft = useCheckout();
  const s = summarize(draft);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(8);
  const [awaitingChoice, setAwaitingChoice] = useState(false);
  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 92) {
          clearInterval(t);
          setAwaitingChoice(true);
          return 92;
        }
        return p + 7;
      });
    }, 180);
    return () => clearInterval(t);
  }, []);
  const finish = (status: "success" | "failed") => {
    checkoutActions.setResult({
      orderId: orderId(),
      productId: draft.productId,
      planLabel: s.plan?.label ?? "1 Month",
      amount: s.payable,
      method: draft.method,
      placedAt: "27 Jul 2026, 02:14",
      status,
      reason: status === "failed" ? "Bank declined the transaction (insufficient balance)." : undefined,
    });
    navigate({ to: status === "success" ? "/order-success" : "/order-failed" });
  };
  return (
    <AppShell title="Payment" subtitle="Do not close this screen" back backTo="/checkout" hideNav showCart={false}>
      <div className="flex flex-col gap-5">
        <section className="layer-card float-shadow flex flex-col items-center gap-4 rounded-3xl border border-border p-6 text-center">
          <div className="relative grid size-20 place-items-center">
            <span className="absolute inset-0 rounded-full border-2 border-border" />
            <span className="absolute inset-0 spinner border-transparent" />
            <Lock className="size-7 text-primary" />
          </div>
          <div>
            <p className="text-base font-bold text-foreground">
              {awaitingChoice ? "Awaiting bank confirmation" : "Processing your payment"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {awaitingChoice
                ? "Your bank is confirming the transaction. This can take a few seconds."
                : "Securely contacting your payment provider…"}
            </p>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
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
            <span className="text-muted-foreground">Payment method</span>
            <span className="font-semibold text-foreground">{methodLabel(draft.method)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-bold text-foreground">{inr(s.payable)}</span>
          </div>
          <p className="flex items-center gap-1.5 rounded-2xl bg-secondary/60 p-3 text-[11px] text-muted-foreground">
            <ShieldCheck className="size-3.5 shrink-0 text-primary" />
            256-bit encrypted payment. SixStore never stores your card details.
          </p>
        </section>
        <section className="flex flex-col gap-2 rounded-2xl border border-dashed border-border p-4">
          <p className="text-[11px] text-muted-foreground">
            Demo preview — choose how this mock payment resolves.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => finish("success")}
              className="press min-h-11 flex-1 rounded-full bg-primary text-xs font-semibold text-primary-foreground"
            >
              Preview success
            </button>
            <button
              onClick={() => finish("failed")}
              className="press min-h-11 flex-1 rounded-full border border-destructive/50 text-xs font-semibold text-destructive"
            >
              Preview failure
            </button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
