import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import heroOtt from "@/assets/hero-ott.jpg";
import heroAi from "@/assets/hero-ai.jpg";
import heroWallet from "@/assets/hero-wallet.jpg";

const slides = [
  {
    id: "ott",
    eyebrow: "Festive drop",
    title: "OTT packs from ₹99",
    body: "Netflix, Prime & Hotstar · instant delivery",
    to: "/categories" as const,
    image: heroOtt,
  },
  {
    id: "ai",
    eyebrow: "AI toolkit",
    title: "ChatGPT & Claude seats",
    body: "Priority models for creators and devs",
    to: "/categories" as const,
    image: heroAi,
  },
  {
    id: "wallet",
    eyebrow: "Wallet perk",
    title: "5% back on every top-up",
    body: "Pay faster, save more with Gold wallet",
    to: "/wallet" as const,
    image: heroWallet,
  },
];

export function HeroSlider() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const active = Math.round(progress);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const id = window.setInterval(() => {
      const next = (Math.round(el.scrollLeft / el.clientWidth) + 1) % slides.length;
      el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    }, 4000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section aria-label="Featured offers" className="flex flex-col gap-3">
      <div
        ref={ref}
        onScroll={(e) => {
          const el = e.currentTarget;
          setProgress(el.clientWidth ? el.scrollLeft / el.clientWidth : 0);
        }}
        className="snap-x-row no-scrollbar -mx-4 gap-0"
      >
        {slides.map((s, i) => (
          <Link
            key={s.id}
            to={s.to}
            className="press float-shadow relative flex h-[168px] w-full shrink-0 flex-col justify-end overflow-hidden rounded-[28px] border border-border/70 p-4"
          >
            <img
              src={s.image}
              alt=""
              aria-hidden="true"
              width={1024}
              height={640}
              className="pointer-events-none absolute inset-0 size-full scale-[1.18] object-cover"
              style={{ transform: `translate3d(${(progress - i) * 26}px, 0, 0) scale(1.18)` }}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"
            />
            <div
              className="relative"
              style={{ transform: `translate3d(${(progress - i) * -10}px, 0, 0)` }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                {s.eyebrow}
              </p>
              <p className="mt-1 font-display text-xl font-bold leading-tight text-foreground">
                {s.title}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{s.body}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-center gap-1.5" role="tablist" aria-label="Slide indicator">
        {slides.map((s, i) => (
          <span
            key={s.id}
            className={`h-1.5 rounded-full transition-all duration-300 ease-out ${
              i === active ? "w-6 bg-primary shadow-[0_0_10px_var(--primary)]" : "w-1.5 bg-border"
            }`}
          />
        ))}
      </div>
    </section>
  );
}