import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ProductRow } from "@/components/ProductCard";
import { SearchBar } from "@/components/SearchBar";
import { CardSkeletonGrid, EmptyState, RowSkeletonList, useScreenLoad } from "@/components/states";
import { categories, products } from "@/lib/mock-data";
export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Browse categories — SixStore" },
      {
        name: "description",
        content: "Browse OTT subscriptions and AI tool seats by category on SixStore.",
      },
      { property: "og:title", content: "Browse categories — SixStore" },
      {
        property: "og:description",
        content: "Streaming, music, sports, AI assistants, AI design and coding copilots.",
      },
    ],
  }),
  component: CategoriesScreen,
});
function CategoriesScreen() {
  const loading = useScreenLoad();
  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState("");
  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (active === "all" || p.category === active) &&
        (q === "" || p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q)),
    );
  }, [active, query]);
  return (
    <AppShell
      title="Browse"
      subtitle="OTT subscriptions & AI tools"
      search={<SearchBar value={query} onChange={setQuery} />}
    >
      {loading ? (
        <div className="flex flex-col gap-4">
          <CardSkeletonGrid count={4} />
          <RowSkeletonList count={3} />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3">
            {categories.map((c) => {
              const count = products.filter((p) => p.category === c.id).length;
              const isActive = active === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActive(isActive ? "all" : c.id)}
                  className={`press flex min-h-[86px] flex-col items-start justify-center gap-1 rounded-2xl border p-3 text-left ${
                    isActive
                      ? "border-primary/60 bg-primary/10"
                      : "border-border bg-card"
                  }`}
                >
                  <span className="text-sm font-semibold text-foreground">{c.name}</span>
                  <span className="text-xs text-muted-foreground">{c.blurb}</span>
                  <span className="text-[11px] text-muted-foreground">{count} products</span>
                </button>
              );
            })}
          </div>
          <section className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-foreground">
              {active === "all"
                ? "All products"
                : categories.find((c) => c.id === active)?.name}
            </h2>
            {list.length === 0 ? (
              <EmptyState
                title="No matches"
                body="Nothing here yet for that search. Try a different name or category."
              />
            ) : (
              list.map((p) => <ProductRow key={p.id} product={p} />)
            )}
          </section>
        </div>
      )}
    </AppShell>
  );
}