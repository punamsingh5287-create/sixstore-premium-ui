import { useSyncExternalStore } from "react";
import { getProduct, type Plan, type Product } from "./mock-data";

export type PaymentMethodId = "upi" | "card" | "wallet" | "netbanking";
export type PaymentMethod = { id: PaymentMethodId; label: string; hint: string };
export const paymentMethods: PaymentMethod[] = [
  { id: "upi", label: "UPI", hint: "GPay · PhonePe · Paytm" },
  { id: "card", label: "Card", hint: "Visa · Mastercard · Rupay" },
  { id: "wallet", label: "SixStore Wallet", hint: "Balance ₹2,480" },
  { id: "netbanking", label: "Net banking", hint: "All major banks" },
];

export type CheckoutDraft = {
  productId: string;
  planId: string;
  qty: number;
  method: PaymentMethodId;
  useWallet: boolean;
};

export type MockOrderResult = {
  orderId: string;
  productId: string;
  planLabel: string;
  amount: number;
  method: PaymentMethodId;
  placedAt: string;
  status: "success" | "failed";
  reason?: string;
};

let draft: CheckoutDraft = {
  productId: "netflix-premium",
  planId: "3m",
  qty: 1,
  method: "upi",
  useWallet: true,
};
let result: MockOrderResult | null = null;

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

export const checkoutActions = {
  start(productId: string, planId: string, qty = 1) {
    draft = { ...draft, productId, planId, qty };
    result = null;
    emit();
  },
  patch(next: Partial<CheckoutDraft>) {
    draft = { ...draft, ...next };
    emit();
  },
  setResult(next: MockOrderResult | null) {
    result = next;
    emit();
  },
};

export function useCheckout() {
  return useSyncExternalStore(
    subscribe,
    () => draft,
    () => draft,
  );
}
export function useOrderResult() {
  return useSyncExternalStore(
    subscribe,
    () => result,
    () => result,
  );
}

export type CheckoutSummary = {
  product: Product | undefined;
  plan: Plan | undefined;
  qty: number;
  itemTotal: number;
  mrpTotal: number;
  discount: number;
  walletApplied: number;
  platformFee: number;
  payable: number;
};

export function summarize(d: CheckoutDraft): CheckoutSummary {
  const product = getProduct(d.productId);
  const plan = product?.plans.find((p) => p.id === d.planId) ?? product?.plans[0];
  const qty = Math.max(1, d.qty);
  const itemTotal = (plan?.price ?? 0) * qty;
  const mrpTotal = (plan?.mrp ?? 0) * qty;
  const walletApplied = d.useWallet ? Math.min(itemTotal, 500) : 0;
  const platformFee = itemTotal > 0 ? 9 : 0;
  return {
    product,
    plan,
    qty,
    itemTotal,
    mrpTotal,
    discount: mrpTotal - itemTotal,
    walletApplied,
    platformFee,
    payable: Math.max(0, itemTotal - walletApplied + platformFee),
  };
}

export const methodLabel = (id: PaymentMethodId) =>
  paymentMethods.find((m) => m.id === id)?.label ?? "UPI";
