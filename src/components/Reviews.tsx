import { useEffect, useRef, useState } from "react";
import { BadgeCheck, Star } from "lucide-react";
import { getReviews, ratingBreakdown, type Product } from "@/lib/mock-data";

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setSeen(true)),
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);
  return { ref, seen };
}

export function AnimatedCounter({
  value,
  decimals = 0,
  suffix = "",
  className,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}) {
  const { ref, seen } = useInView<HTMLSpanElement>();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!seen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }
    const start = performance.now();
    const dur = 900;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, value]);

  const text =
    decimals > 0
      ? shown.toFixed(decimals)
      : Math.round(shown).toLocaleString("en-IN");

  return (
    <span ref={ref} className={className}>
      {text}
      {suffix}
    </span>
  );
}

function Stars({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={i <= Math.round(rating) ? "fill-primary text-primary" : "text-border"}
        />
      ))}
    </span>
  );
}

function Avatar({ initials, accent }: { initials: string; accent: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-foreground"
      style={{
        backgroundImage: `linear-gradient(140deg, color-mix(in oklab, ${accent} 55%, transparent), color-mix(in oklab, ${accent} 12%, transparent))`,
        boxShadow: "inset 0 1px 0 color-mix(in oklab, white 22%, transparent)",
      }}
    >
      {initials}
    </span>
  );
}

export function ReviewsCarousel({ product }: { product: Product }) {
  const reviews = getReviews(product.id);
  const breakdown = ratingBreakdown(product.reviews);
  const [active, setActive] = useState(0);

  return (
    <section className="flex flex-col gap-3" aria-label="Customer reviews">
      <div className="flex items-end justify-between gap-3">
        <h3 className="font-display text-lg font-bold tracking-tight text-foreground">
          Loved by buyers
        </h3>
        <span className="text-[11px] text-muted-foreground">
          <AnimatedCounter value={product.reviews} className="font-semibold text-foreground" />{" "}
          verified reviews
        </span>
      </div>

      <div className="layer-card float-shadow flex items-center gap-4 rounded-3xl border border-border p-4">
        <div className="flex shrink-0 flex-col items-center gap-1">
          <AnimatedCounter
            value={product.rating}
            decimals={1}
            className="font-display text-3xl font-bold leading-none text-foreground"
          />
          <Stars rating={product.rating} />
          <span className="text-[10px] text-muted-foreground">out of 5</span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {breakdown.map((b) => (
            <div key={b.stars} className="flex items-center gap-2">
              <span className="w-3 text-[10px] text-muted-foreground">{b.stars}</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                <span
                  className="block h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
                  style={{ width: `${Math.round((b.count / product.reviews) * 100)}%` }}
                />
              </span>
              <span className="w-9 text-right text-[10px] text-muted-foreground">
                {Math.round((b.count / product.reviews) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        onScroll={(e) => {
          const el = e.currentTarget;
          const card = el.firstElementChild as HTMLElement | null;
          const step = card ? card.offsetWidth + 12 : el.clientWidth;
          setActive(Math.round(el.scrollLeft / step));
        }}
        className="snap-x-row no-scrollbar -mx-4 gap-3 px-4"
      >
        {reviews.map((r) => (
          <article
            key={r.id}
            className="press lift layer-card flex w-[80%] max-w-[320px] flex-col gap-3 rounded-3xl glass-btn p-4"
          >
            <div className="flex items-center gap-3">
              <Avatar initials={r.initials} accent={product.accent} />
              <div className="min-w-0">
                <p className="flex items-center gap-1 truncate text-sm font-semibold text-foreground">
                  {r.name}
                  <BadgeCheck className="size-3.5 shrink-0 text-primary" />
                </p>
                <p className="truncate text-[11px] text-muted-foreground">
                  Verified buyer · {r.plan}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Stars rating={r.rating} />
              <span className="text-[10px] text-muted-foreground">{r.when}</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">{r.body}</p>
          </article>
        ))}
      </div>

      <div className="flex justify-center gap-1.5">
        {reviews.map((r, i) => (
          <span
            key={r.id}
            className={`h-1.5 rounded-full transition-all duration-300 ease-out ${
              i === active ? "w-5 bg-primary" : "w-1.5 bg-border"
            }`}
          />
        ))}
      </div>
    </section>
  );
}