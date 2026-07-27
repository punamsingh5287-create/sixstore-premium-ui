import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Star } from "lucide-react";
import { BrandMark } from "./BrandMark";
import { inr } from "@/lib/cart-store";
import { getStock, type Product } from "@/lib/mock-data";
export function ProductLogo({ product, size = 48 }: { product: Product; size?: number }) {
  return <BrandMark product={product} size={size} />;
}
function discountOf(product: Product) {
  const p = product.plans[0];
  return Math.round(((p.mrp - p.price) / p.mrp) * 100);
}
export function StockBadge({ stock, className = "" }: { stock: number; className?: string }) {
  const tone =
    stock === 0
      ? "bg-destructive/15 text-destructive"
      : stock <= 10
        ? "bg-primary/15 text-primary"
        : "bg-success/15 text-success";
  const label = stock === 0 ? "Out of stock" : stock <= 10 ? `Only ${stock} left` : "In stock";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${tone} ${className}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
export function ProductCard({ product }: { product: Product }) {
  const from = product.plans[0];
  const stock = getStock(product.id);
  return (
    <Link
      to="/product/$productId"
      params={{ productId: product.id }}
      aria-label={`View ${product.name}`}
      className="tilt layer-card press relative flex h-full flex-col gap-2.5 rounded-2xl border border-border p-3"
    >
      <div className="flex items-start justify-between gap-2">
        <BrandMark product={product} />
        <span className="rounded-full bg-success/15 px-2 py-1 text-[10px] font-bold text-success">
          {discountOf(product)}% off
        </span>
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-card-foreground">{product.name}</p>
        <p className="truncate text-xs text-muted-foreground">{product.tagline}</p>
      </div>
      <div className="flex items-center justify-between gap-2">
        <StockBadge stock={stock} />
        <span className="flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground">
          <Star className="size-3 fill-primary text-primary" />
          {product.rating}
        </span>
      </div>
      <div className="mt-auto flex items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">From</p>
          <p className="text-sm font-bold text-foreground">{inr(from.price)}</p>
        </div>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      </div>
    </Link>
  );
}
export function ProductRow({ product }: { product: Product }) {
  const from = product.plans[0];
  const stock = getStock(product.id);
  return (
    <Link
      to="/product/$productId"
      params={{ productId: product.id }}
      aria-label={`View ${product.name}`}
      className="tilt layer-card press relative flex items-center gap-3 rounded-2xl border border-border p-3"
    >
      <BrandMark product={product} size={44} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-card-foreground">{product.name}</p>
        <p className="truncate text-xs text-muted-foreground">{product.tagline}</p>
        <div className="mt-1 flex items-center gap-2">
          <StockBadge stock={stock} />
          <span className="text-[10px] font-semibold text-success">{discountOf(product)}% off</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">From</p>
          <p className="text-sm font-bold text-foreground">{inr(from.price)}</p>
        </div>
        <ChevronRight className="size-4 text-muted-foreground" />
      </div>
    </Link>
  );
}