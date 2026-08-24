import { Clock, Headphones, ShieldCheck, Sparkles, Users, Zap } from "lucide-react";
import { AnimatedCounter } from "./Reviews";

const reasons = [
  { Icon: Zap, title: "Fast delivery", body: "Most orders land in under 5 minutes." },
  { Icon: Sparkles, title: "Instant activation", body: "Seats go live the moment payment clears." },
  { Icon: ShieldCheck, title: "Secure payments", body: "Encrypted UPI, cards and wallet." },
  { Icon: Users, title: "Trusted by thousands", body: "Verified buyers across India." },
  { Icon: Headphones, title: "24×7 support", body: "Real humans, any hour of the night." },
  { Icon: Clock, title: "Full-term warranty", body: "Free replacement for the whole plan." },
];

const stats = [
  { value: 48200, suffix: "+", label: "Orders delivered" },
  { value: 4.9, decimals: 1, label: "Average rating" },
  { value: 4, suffix: " min", label: "Median delivery" },
  { value: 99.4, decimals: 1, suffix: "%", label: "Success rate" },
];

export function WhySixStore() {
  return (
    <section className="flex flex-col gap-3" aria-label="Why SixStore">
      <div className="flex items-end justify-between gap-3">
        <h2 className="font-display text-lg font-bold tracking-tight text-foreground">
          Why SixStore
        </h2>
        <span className="text-[11px] text-muted-foreground">Built for trust</span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {reasons.map(({ Icon, title, body }) => (
          <div
            key={title}
            className="press lift layer-card flex flex-col gap-2 rounded-2xl glass-btn p-3"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/20">
              <Icon className="size-4.5" />
            </span>
            <span className="text-sm font-semibold leading-tight text-foreground">{title}</span>
            <span className="text-[11px] leading-snug text-muted-foreground">{body}</span>
          </div>
        ))}
      </div>

      <div className="layer-card grid grid-cols-2 gap-3 rounded-3xl border border-border p-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-0.5">
            <AnimatedCounter
              value={s.value}
              decimals={s.decimals ?? 0}
              suffix={s.suffix ?? ""}
              className="font-display text-xl font-bold leading-none text-foreground"
            />
            <span className="text-[11px] text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}