import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, ChevronRight, Globe, LifeBuoy, Moon, Receipt, Users, Wallet } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RowSkeletonList, SkeletonBlock, useScreenLoad } from "@/components/states";
import { inr } from "@/lib/cart-store";
import { user } from "@/lib/mock-data";
export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — SixStore" },
      {
        name: "description",
        content: "Your SixStore membership, savings, referrals and app preferences.",
      },
      { property: "og:title", content: "Profile — SixStore" },
      { property: "og:description", content: "Membership tier, savings and preferences." },
    ],
  }),
  component: ProfileScreen,
});
function ProfileScreen() {
  const loading = useScreenLoad(400);
  const [notifications, setNotifications] = useState(true);
  return (
    <AppShell title="Profile" subtitle={`${user.tier} member since ${user.memberSince}`}>
      {loading ? (
        <div className="flex flex-col gap-4">
          <SkeletonBlock className="h-28" />
          <RowSkeletonList count={4} />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <section className="flex items-center gap-4 rounded-3xl border border-border bg-card p-4">
            <div className="grid size-16 shrink-0 place-items-center rounded-full bg-primary/15 font-display text-xl font-bold text-primary">
              {user.initials}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-foreground">{user.name}</h2>
              <p className="truncate text-sm text-muted-foreground">{user.handle}</p>
              <span className="mt-1 inline-block rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                {user.tier} tier
              </span>
            </div>
          </section>
          <section className="grid grid-cols-3 gap-2">
            {[
              { label: "Orders", value: String(user.orders) },
              { label: "Saved", value: inr(user.saved) },
              { label: "Referrals", value: String(user.referrals) },
            ].map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card py-3"
              >
                <span className="text-sm font-bold text-foreground">{s.value}</span>
                <span className="text-[11px] text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </section>
          <section className="overflow-hidden rounded-2xl border border-border bg-card">
            <NavRow to="/orders" Icon={Receipt} label="My orders" />
            <NavRow to="/wallet" Icon={Wallet} label="Wallet & payments" />
            <NavRow to="/support" Icon={LifeBuoy} label="Help & support" />
            <NavRow to="/categories" Icon={Users} label="Refer & earn" last />
          </section>
          <section className="flex flex-col rounded-2xl border border-border bg-card">
            <label className="flex min-h-14 items-center gap-3 border-b border-border px-4">
              <Bell className="size-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 text-sm text-foreground">Order notifications</span>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="size-5 accent-[var(--primary)]"
              />
            </label>
            <div className="flex min-h-14 items-center gap-3 border-b border-border px-4">
              <Globe className="size-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 text-sm text-foreground">Language</span>
              <span className="text-sm text-muted-foreground">English</span>
            </div>
            <div className="flex min-h-14 items-center gap-3 px-4">
              <Moon className="size-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 text-sm text-foreground">Appearance</span>
              <span className="text-sm text-muted-foreground">Dark</span>
            </div>
          </section>
          <p className="pb-2 text-center text-[11px] text-muted-foreground">
            SixStore Mini App · v1.0.0 (demo data)
          </p>
        </div>
      )}
    </AppShell>
  );
}
function NavRow({
  to,
  Icon,
  label,
  last,
}: {
  to: string;
  Icon: typeof Receipt;
  label: string;
  last?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex min-h-14 items-center gap-3 px-4 active:bg-secondary ${last ? "" : "border-b border-border"}`}
    >
      <Icon className="size-4 shrink-0 text-muted-foreground" />
      <span className="min-w-0 flex-1 truncate text-sm text-foreground">{label}</span>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}