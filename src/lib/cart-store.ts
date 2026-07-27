import { useSyncExternalStore } from "react";
import { getProduct, type Product } from "./mock-data";
export type CartLine = { productId: string; planId: string; qty: number };
let lines: CartLine[] = [
  { productId: "netflix-premium", planId: "3m", qty: 1 },
  { productId: "chatgpt-plus", planId: "1m", qty: 1 },
];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
export const cartActions = {
  add(productId: string, planId: string) {
    const existing = lines.find((l) => l.productId === productId && l.planId === planId);
    lines = existing
      ? lines.map((l) => (l === existing ? { ...l, qty: l.qty + 1 } : l))
      : [...lines, { productId, planId, qty: 1 }];
    emit();
  },
  setQty(productId: string, planId: string, qty: number) {
    lines =
      qty <= 0
        ? lines.filter((l) => !(l.productId === productId && l.planId === planId))
        : lines.map((l) =>
            l.productId === productId && l.planId === planId ? { ...l, qty } : l,
          );
    emit();
  },
  remove(productId: string, planId: string) {
    lines = lines.filter((l) => !(l.productId === productId && l.planId === planId));
    emit();
  },
  clear() {
    lines = [];
    emit();
  },
};
const emptyLines: CartLine[] = [];
export function useCart() {
  return useSyncExternalStore(
    subscribe,
    () => lines,
    () => emptyLines,
  );
}
export type DetailedLine = CartLine & {
  product: Product;
  planLabel: string;
  price: number;
  mrp: number;
};
export function detailLines(cart: CartLine[]): DetailedLine[] {
  return cart.flatMap((l) => {
    const product = getProduct(l.productId);
    const plan = product?.plans.find((p) => p.id === l.planId);
    if (!product || !plan) return [];
    return [{ ...l, product, planLabel: plan.label, price: plan.price, mrp: plan.mrp }];
  });
}
export function cartTotals(cart: CartLine[]) {
  const detailed = detailLines(cart);
  const subtotal = detailed.reduce((s, l) => s + l.price * l.qty, 0);
  const mrpTotal = detailed.reduce((s, l) => s + l.mrp * l.qty, 0);
  const walletApplied = Math.min(subtotal, 500);
  return {
    detailed,
    count: detailed.reduce((s, l) => s + l.qty, 0),
    subtotal,
    savings: mrpTotal - subtotal,
    walletApplied,
    payable: subtotal - walletApplied,
  };
}
export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;