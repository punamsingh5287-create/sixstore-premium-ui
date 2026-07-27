import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Gift } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { RowSkeletonList, SkeletonBlock, useScreenLoad } from "@/components/states";
import { inr } from "@/lib/cart-store";
import { wallet } from "@/lib/mock-data";
export const Route = createFileRoute("/wallet")({
  head: () => ({
    meta: [
      { title: "Wallet — SixStore" },
      {
        name: "description",
        content: "Check your SixStore wallet balance, cashback and recent transactions.",
      },
      { property: "og:title", content: "Wallet — SixStore" },
      { property: "og:description", content: "Balance, cashback and transaction history." },
    ],
  }),
  component: WalletScreen,
});
const amounts = [500, 1000, 2000];
function WalletScreen() {
  const loading = useScreenLoad(450);
  const [selected, setSelected] = useState(1000);
  return (
    <AppShell title="Wallet" subtitle={`${wallet.tier} tier · instant refunds`}>
      {loading ? (
        <div className="flex flex-col gap-4">
          <SkeletonBlock className="h-36" />
          <RowSkeletonList count={4} />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <section className="rounded-3xl border border-primary/25 bg-card p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Available balance</p>
            <p className="mt-1 font-display text-3xl font-bold text-foreground">
              {inr(wallet.balance)}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1">
                <Gift className="size-3 text-primary" /> {inr(wallet.cashbackEarned)} cashback earned
              </span>
            </div>
          </section>
          <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
            <h2 className="text-sm font-semibold text-foreground">Add money</h2>
            <div className="grid grid-cols-3 gap-2">
              {amounts.map((a) => (
                <button
                  key={a}
                  onClick={() => setSelected(a)}
                  className={`min-h-11 rounded-xl border text-sm font-semibold active:scale-95 ${
                    selected === a
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {inr(a)}
                </button>
              ))}
            </div>
            <button
              onClick={() => toast.success(`Demo top-up of ${inr(selected)} — no real payment taken`)}
              className="min-h-12 rounded-full bg-primary text-sm font-semibold text-primary-foreground active:scale-95"
            >
              Top up {inr(selected)}
            </button>
          </section>
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-foreground">Recent activity</h2>
            {wallet.transactions.map((t) => {
              const credit = t.amount > 0;
              return (
                <div
                  key={t.id}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
                >
                  <div
                    className={`grid size-10 shrink-0 place-items-center rounded-full ${
                      credit ? "bg-success/15 text-success" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {credit ? (
                      <ArrowDownLeft className="size-4" />
                    ) : (
                      <ArrowUpRight className="size-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-card-foreground">{t.label}</p>
                    <p className="text-[11px] capitalize text-muted-foreground">
                      {t.kind} · {t.at}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-sm font-bold ${credit ? "text-success" : "text-foreground"}`}
                  >
                    {credit ? "+" : "-"}
                    {inr(Math.abs(t.amount))}
                  </span>
                </div>
              );
            })}
          </section>
        </div>
      )}
    </AppShell>
  );
}