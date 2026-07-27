import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ShieldCheck, Star, Zap } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { ProductLogo, StockBadge } from "@/components/ProductCard";
import { EmptyState, SkeletonBlock, useScreenLoad } from "@/components/states";
import { cartActions, inr } from "@/lib/cart-store";
import { getProduct, getStock } from "@/lib/mock-data";
export const Route = createFileRoute("/product/$productId")({
  head: ({ params }) => {
    const product = getProduct(params.productId);
    const title = product ? `${product.name} — SixStore` : "Product — SixStore";
    const description = product
      ? `${product.name}: ${product.tagline}. From ${product.plans[0].price} with instant delivery and warranty.`
      : "This SixStore product is unavailable.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ProductScreen,
});
function ProductScreen() {
  const { productId } = Route.useParams();
  const product = getProduct(productId);
  const loading = useScreenLoad(450);
  const navigate = useNavigate();
  const [planId, setPlanId] = useState(product?.plans[1]?.id ?? "1m");
  if (!product) {
    return (
      <AppShell title="Product" back>
        <EmptyState
          title="Product not found"
          body="This listing is no longer available. Browse the store for similar subscriptions."
          action={
            <Link
              to="/categories"
              className="flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
            >
              Browse store
            </Link>
          }
        />
      </AppShell>
    );
  }
  const plan = product.plans.find((p) => p.id === planId) ?? product.plans[0];
  const off = Math.round(((plan.mrp - plan.price) / plan.mrp) * 100);
  return (
    <AppShell
      title={product.name}
      subtitle={product.tagline}
      back
      footer={
        !loading ? (
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <p className="text-base font-bold text-foreground">{inr(plan.price)}</p>
              <p className="text-[11px] text-muted-foreground">{plan.label} · {off}% off</p>
            </div>
            <button
              onClick={() => {
                cartActions.add(product.id, plan.id);
                toast.success(`${product.name} added to cart`);
              }}
              className="min-h-12 flex-1 rounded-full border border-border text-sm font-semibold text-foreground press"
            >
              Add to cart
            </button>
            <button
              onClick={() => {
                cartActions.add(product.id, plan.id);
                navigate({ to: "/cart" });
              }}
              className="min-h-12 flex-1 rounded-full bg-primary text-sm font-semibold text-primary-foreground press"
            >
              Buy now
            </button>
          </div>
        ) : null
      }
    >
      {loading ? (
        <div className="flex flex-col gap-4">
          <SkeletonBlock className="h-36" />
          <SkeletonBlock className="h-24" />
          <SkeletonBlock className="h-40" />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <section className="flex items-center gap-4 rounded-3xl border border-border bg-card p-4">
            <ProductLogo product={product} size={64} />
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-foreground">{product.name}</h2>
              <p className="truncate text-sm text-muted-foreground">{product.tagline}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="size-3 fill-primary text-primary" />
                  {product.rating} ({product.reviews.toLocaleString("en-IN")})
                </span>
                <span>· {product.sold.toLocaleString("en-IN")} sold</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StockBadge stock={getStock(product.id)} />
                <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">
                  {off}% off
                </span>
              </div>
            </div>
          </section>
          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-foreground">Choose a plan</h3>
            <div className="flex flex-col gap-2">
              {product.plans.map((p) => {
                const selected = p.id === plan.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPlanId(p.id)}
                    className={`flex min-h-[60px] items-center justify-between gap-3 rounded-2xl border px-4 text-left press ${
                      selected ? "border-primary bg-primary/10" : "border-border bg-card"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{p.label}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {inr(Math.round(p.price / p.months))}/mo effective
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-foreground">{inr(p.price)}</p>
                      <p className="text-[11px] text-muted-foreground line-through">{inr(p.mrp)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-foreground">What you get</h3>
            <ul className="grid grid-cols-2 gap-2">
              {product.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-2 rounded-2xl border border-border bg-card p-3 text-xs text-muted-foreground"
                >
                  <Check className="mt-0.5 size-3.5 shrink-0 text-success" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground">About this listing</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
            <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Zap className="size-3.5 text-primary" /> Delivery in ~5 min
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="size-3.5 text-primary" /> Full-term warranty
              </span>
            </div>
          </section>
        </div>
      )}
    </AppShell>
  );
}