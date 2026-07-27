import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

const slides = [
  {
    id: "ott",
    eyebrow: "Festive drop",
    title: "OTT packs from ₹99",
    body: "Netflix, Prime & Hotstar · instant delivery",
    to: "/categories" as const,
    grad: "linear-gradient(135deg, oklch(0.42 0.12 25), oklch(0.24 0.05 300))",
  },
  {
    id: "ai",
    eyebrow: "AI toolkit",
    title: "ChatGPT & Claude seats",
    body: "Priority models for creators and devs",
    to: "/categories" as const,
    grad: "linear-gradient(135deg, oklch(0.40 0.10 195), oklch(0.24 0.05 260))",
  },
  {
    id: "wallet",
    eyebrow: "Wallet perk",
    title: "5% back on every top-up",
    body: "Pay faster, save more with Gold wallet",
    to: "/wallet" as const,
    grad: "linear-gradient(135deg, oklch(0.44 0.11 84), oklch(0.24 0.04 60))",
  },
];

export function HeroSlider() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const id = window.setInterval(() => {
      const next = (Math.round(el.scrollLeft / el.clientWidth) + 1) % slides.length;
      el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section aria-label="Featured offers" className="flex flex-col gap-2">
      <div
        ref={ref}
        onScroll={(e) => {
          const el = e.currentTarget;
          setActive(Math.round(el.scrollLeft / el.clientWidth));
        }}
        className="snap-x-row no-scrollbar -mx-4 gap-3 px-4"
      >
        {slides.map((s) => (
          <Link
            key={s.id}
            to={s.to}
            style={{ backgroundImage: s.grad }}
            className="tilt float-shadow relative w-[calc(100vw-2rem)] max-w-[448px] overflow-hidden rounded-3xl border border-border p-4"
          >
            <span className="pointer-events-none absolute -right-8 -top-10 size-32 rounded-full bg-white/10 blur-2xl" />
            <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
              {s.eyebrow}
            </p>
            <p className="mt-1 font-display text-lg font-bold leading-tight text-foreground">
              {s.title}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{s.body}</p>
          </Link>
        ))}
      </div>
      <div className="flex justify-center gap-1.5">
        {slides.map((s, i) => (
          <span
            key={s.id}
            className={`h-1.5 rounded-full transition-all duration-200 ${
              i === active ? "w-5 bg-primary" : "w-1.5 bg-border"
            }`}
          />
        ))}
      </div>
    </section>
  );
}