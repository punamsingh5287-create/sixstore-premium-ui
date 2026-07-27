import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, Check, RefreshCw, ShieldCheck, Star, Zap } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { ProductLogo, StockBadge } from "@/components/ProductCard";
import { EmptyState, SkeletonBlock, useScreenLoad } from "@/components/states";
import { cartActions, inr } from "@/lib/cart-store";
import { checkoutActions } from "@/lib/checkout-store";
import { getProduct, getStock } from "@/lib/mock-data";
export const Route = createFileRoute("/product/")({
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
  const stock = getStock(product.id);
  const soldOut = stock === 0;
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
              <p className="text-[11px] text-muted-foreground">
                {plan.label} · {off}% off
              </p>
            </div>
            <button
              onClick={() => {
                cartActions.add(product.id, plan.id);
                toast.success(`${product.name} added to cart`);
              }}
              className="press min-h-12 shrink-0 rounded-full border border-border px-5 text-sm font-semibold text-foreground"
            >
              Add to cart
            </button>
            <button
              disabled={soldOut}
              onClick={() => {
                checkoutActions.start(product.id, plan.id, 1);
                navigate({ to: "/checkout" });
              }}
              className="press min-h-12 flex-1 rounded-full bg-primary text-sm font-semibold text-primary-foreground disabled:bg-secondary disabled:text-muted-foreground"
            >
              {soldOut ? "Sold out" : "Buy now"}
            </button>
          </div>
        ) : null
      }
    >
      {loading ? (
        <div className="flex flex-col gap-4">
          <SkeletonBlock className="h-40" />
          <SkeletonBlock className="h-24" />
          <SkeletonBlock className="h-40" />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <section className="tilt layer-card float-shadow flex flex-col gap-4 rounded-3xl border border-border p-4">
            <div className="flex items-center gap-4">
              <ProductLogo product={product} size={72} />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="truncate text-lg font-bold text-foreground">{product.name}</h2>
                  <BadgeCheck className="size-4 shrink-0 text-primary" />
                </div>
                <p className="truncate text-sm text-muted-foreground">{product.tagline}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="size-3 fill-primary text-primary" />
                    {product.rating} ({product.reviews.toLocaleString("en-IN")})
                  </span>
                  <span>· {product.sold.toLocaleString("en-IN")} sold</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StockBadge stock={stock} />
              <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">
                {off}% off
              </span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                Verified seller
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
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
                    className={`tilt press flex min-h-[64px] items-center justify-between gap-3 rounded-2xl border px-4 text-left ${
                      selected ? "border-primary bg-primary/10" : "layer-card border-border"
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
          <section className="grid gap-2">
            {[
              { icon: Zap, title: "Instant digital delivery", body: "Credentials arrive in chat in ~5 minutes." },
              { icon: ShieldCheck, title: "Full-term warranty", body: "Covered for the entire plan duration." },
              { icon: RefreshCw, title: "Free replacement", body: "Stops working? We replace it, no questions." },
            ].map((r) => (
              <div
                key={r.title}
                className="flex items-start gap-3 rounded-2xl border border-border bg-card p-3"
              >
                <r.icon className="mt-0.5 size-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground">{r.title}</p>
                  <p className="text-[11px] text-muted-foreground">{r.body}</p>
                </div>
              </div>
            ))}
          </section>
          <section className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground">How delivery works</h3>
            <ol className="flex flex-col gap-2 text-xs text-muted-foreground">
              <li>1. Pick a plan and pay securely inside Telegram.</li>
              <li>2. We provision your seat or upgrade your own account ID.</li>
              <li>3. Access details land in Orders and in your chat.</li>
            </ol>
          </section>
        </div>
      )}
    </AppShell>
  );
}
