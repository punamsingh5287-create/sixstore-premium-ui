import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ShieldCheck, Wallet as WalletIcon, Zap } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { HeroSlider } from "@/components/HeroSlider";
import { ProductCarousel } from "@/components/ProductCarousel";
import { WalletCard3D } from "@/components/WalletCard3D";
import { ProductCard, ProductRow } from "@/components/ProductCard";
import { SearchBarButton } from "@/components/SearchBar";
import { WhySixStore } from "@/components/WhySixStore";
import { SiteFooter } from "@/components/SiteFooter";
import { CardSkeletonGrid, RowSkeletonList, SkeletonBlock, useScreenLoad } from "@/components/states";
import { categories, products, user, wallet } from "@/lib/mock-data";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SixStore — OTT & AI subscriptions, delivered instantly" },
      {
        name: "description",
        content:
          "Buy Netflix, Spotify, ChatGPT, Claude and more at member prices. Instant delivery, wallet payments and warranty on every order.",
      },
      { property: "og:title", content: "SixStore — OTT & AI subscriptions" },
      {
        property: "og:description",
        content: "Member-priced OTT subscriptions and AI tool seats with instant delivery.",
      },
    ],
  }),
  component: HomeScreen,
});
function HomeScreen() {
  const loading = useScreenLoad();
  const navigate = useNavigate();
  const trending = products.filter((p) => p.badge).concat(products.filter((p) => !p.badge)).slice(0, 4);
  const aiTools = products.filter((p) => p.kind === "ai").slice(0, 3);
  const carousel = products.slice(0, 6);
  return (
    <AppShell
      title={`Hi, ${user.name.split(" ")[0]}`}
      subtitle="Member prices"
      membership={user.tier}
      walletBalance={wallet.balance}
      search={<SearchBarButton onClick={() => navigate({ to: "/categories" })} />}
    >
      {loading ? (
        <div className="flex flex-col gap-5">
          <SkeletonBlock className="h-[124px] rounded-3xl" />
          <SkeletonBlock className="h-[92px] rounded-3xl" />
          <div className="grid grid-cols-3 gap-2">
            <SkeletonBlock className="h-16" />
            <SkeletonBlock className="h-16" />
            <SkeletonBlock className="h-16" />
          </div>
          <CardSkeletonGrid count={4} />
          <RowSkeletonList count={3} />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <HeroSlider />
          <WalletCard3D />
          <section className="grid grid-cols-3 gap-2">
            {[
              { Icon: Zap, label: "Instant delivery" },
              { Icon: ShieldCheck, label: "Warranty" },
              { Icon: WalletIcon, label: "Wallet cashback" },
            ].map(({ Icon, label }) => (
              <div
                key={label}
                className="layer-card flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-2xl border border-border px-2 py-3 text-center"
              >
                <Icon className="size-5 text-primary" />
                <span className="text-[11px] leading-tight text-muted-foreground">{label}</span>
              </div>
            ))}
          </section>
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Categories</h2>
              <Link to="/categories" className="text-xs font-medium text-primary">
                See all
              </Link>
            </div>
            <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  to="/categories"
                  className="bounce-press lift layer-card flex min-h-11 shrink-0 items-center rounded-full glass-btn px-4 text-sm text-foreground"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </section>
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Trending now</h2>
              <Link to="/categories" className="text-xs font-medium text-primary">
                See all
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {trending.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-foreground">Fresh picks</h2>
            <ProductCarousel items={carousel} />
          </section>
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-foreground">AI tools for creators</h2>
            {aiTools.map((p) => (
              <ProductRow key={p.id} product={p} />
            ))}
          </section>
          <WhySixStore />
          <SiteFooter />
        </div>
      )}
    </AppShell>
  );
}
