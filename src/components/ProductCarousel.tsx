import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/mock-data";

export function ProductCarousel({ items }: { items: Product[] }) {
  return (
    <div className="snap-x-row no-scrollbar -mx-4 gap-3 px-4 pb-1">
      {items.map((p) => (
        <div key={p.id} className="w-[168px]">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}