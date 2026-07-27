import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { inr } from "@/lib/cart-store";
import type { Product } from "@/lib/mock-data";
export function ProductLogo({ product, size = 48 }: { product: Product; size?: number }) {
  return (
    <div
      className="grid shrink-0 place-items-center rounded-2xl font-display font-bold text-foreground"
      style={{
        width: size,
        height: size,
        background: `color-mix(in oklab, ${product.accent} 28%, transparent)`,
        border: `1px solid color-mix(in oklab, ${product.accent} 45%, transparent)`,
        color: product.accent,
        fontSize: size / 2.8,
      }}
    >
      {product.initials}
    </div>
  );
}
export function ProductCard({ product }: { product: Product }) {
  const from = product.plans[0];
  return (
    <Link
      to="/product/$productId"
      params={{ productId: product.id }}
      className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-2">
        <ProductLogo product={product} />
        {product.badge ? (
          <span className="rounded-full bg-primary/15 px-2 py-1 text-[10px] font-semibold text-primary">
            {product.badge}
          </span>
        ) : null}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-card-foreground">{product.name}</p>
        <p className="truncate text-xs text-muted-foreground">{product.tagline}</p>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground">{inr(from.price)}</p>
          <p className="text-[11px] text-muted-foreground line-through">{inr(from.mrp)}</p>
        </div>
        <span className="flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground">
          <Star className="size-3 fill-primary text-primary" />
          {product.rating}
        </span>
      </div>
    </Link>
  );
}
export function ProductRow({ product }: { product: Product }) {
  const from = product.plans[0];
  return (
    <Link
      to="/product/$productId"
      params={{ productId: product.id }}
      className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 active:scale-[0.99]"
    >
      <ProductLogo product={product} size={44} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-card-foreground">{product.name}</p>
        <p className="truncate text-xs text-muted-foreground">{product.tagline}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-bold text-foreground">{inr(from.price)}</p>
        <p className="text-[11px] text-muted-foreground">from</p>
      </div>
    </Link>
  );
}