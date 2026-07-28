// Typed client for bot.py's /api/store/* endpoints. Same-origin relative
// paths -- this app is served from the same domain as the bot's API (see
// the integration plan's Serving/hosting decision), so no base URL or CORS
// handling is needed here.
import { getInitData } from "./telegram";
import { reportNetworkFailure } from "./client-error-reporting";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// No response at all within this window (dead upstream, stalled connection
// on flaky mobile data, etc) is treated the same as a network failure below
// -- better an in-app retry prompt at 15s than a Telegram WebView that never
// resolves.
const REQUEST_TIMEOUT_MS = 15_000;
const RETRYABLE_STATUSES = new Set([502, 503, 504]);
const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 300;

function isRetryableStatus(status: number): boolean {
  return RETRYABLE_STATUSES.has(status);
}

/** Merges the caller's own AbortSignal (React Query's per-query signal --
 * aborted on unmount or when a newer call for the same query key supersedes
 * this one) with our own timeout, without requiring AbortSignal.any() --
 * older Android WebViews (Telegram runs whatever system WebView the device
 * ships) may not have it yet. */
function withTimeout(signal: AbortSignal | null | undefined): {
  signal: AbortSignal;
  cleanup: () => void;
} {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new DOMException("Timeout", "TimeoutError")), REQUEST_TIMEOUT_MS);
  const onCallerAbort = () => controller.abort(signal?.reason);
  signal?.addEventListener("abort", onCallerAbort);
  if (signal?.aborted) controller.abort(signal.reason);
  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onCallerAbort);
    },
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function parseErrorBody(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { detail?: string };
    return body.detail ?? res.statusText;
  } catch {
    return res.statusText;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method ?? "GET").toUpperCase();
  // Only idempotent GETs auto-retry -- a checkout or wallet top-up must
  // never be silently replayed just because one response was slow.
  const retriesAllowed = method === "GET" ? MAX_RETRIES : 0;
  const callerSignal = options.signal ?? undefined;

  let attempt = 0;
  for (;;) {
    const { signal, cleanup } = withTimeout(callerSignal);
    try {
      const headers = new Headers(options.headers);
      headers.set("Authorization", `tma ${getInitData()}`);
      if (options.body && !(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
      }
      const res = await fetch(path, { ...options, headers, signal });
      if (!res.ok) {
        if (isRetryableStatus(res.status) && attempt < retriesAllowed) {
          attempt += 1;
          await sleep(RETRY_BASE_DELAY_MS * 2 ** (attempt - 1) + Math.random() * 100);
          continue;
        }
        const message = await parseErrorBody(res);
        if (res.status >= 500) reportNetworkFailure(path, `${res.status} ${message}`);
        throw new ApiError(res.status, message);
      }
      if (res.status === 204) return undefined as T;
      return (await res.json()) as T;
    } catch (error) {
      // Caller-initiated cancellation (unmount, superseded query) is normal
      // and must propagate as-is -- React Query relies on the AbortError to
      // distinguish "cancelled" from "failed".
      if (callerSignal?.aborted) throw error;
      const isOurTimeout = error instanceof DOMException && error.name === "TimeoutError";
      const isNetworkError = error instanceof TypeError;
      if ((isOurTimeout || isNetworkError) && attempt < retriesAllowed) {
        attempt += 1;
        await sleep(RETRY_BASE_DELAY_MS * 2 ** (attempt - 1) + Math.random() * 100);
        continue;
      }
      if (isOurTimeout) {
        reportNetworkFailure(path, "timed out");
        throw new ApiError(504, "Request timed out. Please try again.");
      }
      if (isNetworkError) {
        reportNetworkFailure(path, "network unreachable");
      }
      throw error;
    } finally {
      cleanup();
    }
  }
}

function toQuery(params?: Record<string, string | number | undefined>): string {
  if (!params) return "";
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== "") as [
    string,
    string,
  ][];
  return entries.length ? `?${new URLSearchParams(entries).toString()}` : "";
}

// ---- types (mirror bot.py's /api/store/* response shapes) --------------------

export interface Category {
  id: number;
  name: string;
  emoji: string;
}

export interface StoreStats {
  ordersDelivered: number;
  averageRating: string | null;
  reviewCount: number;
}

export interface Review {
  id: number;
  rating: number;
  body: string;
  createdAt: string;
  reviewerName: string;
}

export interface RatingBreakdownEntry {
  stars: number;
  count: number;
}

export interface ProductReviews {
  items: Review[];
  total: number;
  page: number;
  limit: number;
  averageRating: string | null;
  breakdown: RatingBreakdownEntry[];
  myReview: { id: number; rating: number; body: string } | null;
  canReview: boolean;
}

export interface ProductSummary {
  id: number;
  categoryId: number;
  categoryEmoji: string;
  name: string;
  price: string;
  displayPrice: string;
  originalPrice: string | null;
  currency: string;
  isDeal: boolean;
  soldCount: number;
  stock: number;
  deliveryType: "auto" | "manual";
  imageUrl: string | null;
  rating: string | null;
  reviewCount: number;
}

export interface QtyTier {
  minQty: number;
  discountType: "percent" | "flat";
  value: string;
  /** Normalised USDT string for "flat" tiers (e.g. "5.00"); null for
   * "percent" tiers, which aren't a money amount. */
  displayValue: string | null;
}

export interface ProductDetail {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  price: string;
  displayPrice: string;
  originalPrice: string | null;
  currency: string;
  stock: number;
  soldCount: number;
  deliveryType: "auto" | "manual";
  maxPerUser: number | null;
  imageUrl: string | null;
  videoUrl: string | null;
  rating: string | null;
  reviewCount: number;
  qtyTiers: QtyTier[];
}

export interface StoreUser {
  id: number;
  telegramId: string;
  username: string | null;
  firstName: string;
  language: string;
  currency: string | null;
  walletBalance: string;
  totalSpent: string;
  tier: string;
  referralCode: string;
  isBanned: boolean;
  createdAt: string;
  referralCount: number;
  ordersCount: number;
}

export interface Wallet {
  balance: string;
  displayBalance: string;
  totalSpent: string;
  currency: string;
  tier: string;
  tierDiscountPercent: string;
  referralBonusEarned: string;
  displayReferralBonusEarned: string;
}

export interface WalletTransaction {
  id: number;
  userId: number;
  type: string;
  amount: string;
  /** Normalised USDT string, sign preserved (e.g. "-79.20", "5.00"). */
  displayAmount: string;
  balanceAfter: string;
  description: string;
  refType: string | null;
  refId: number | null;
  createdAt: string;
}

export type PaymentStatus = "pending" | "approved" | "rejected" | "cancelled" | "expired";

export interface Payment {
  id: number;
  orderId: number | null;
  userId: number;
  purpose: "order" | "topup";
  method: string;
  amount: string;
  currency: string;
  expectedAmount: string | null;
  expectedAddress: string | null;
  chain: string | null;
  txId: string | null;
  screenshotFileId: string | null;
  status: PaymentStatus;
  verification: "manual" | "chain" | "cryptomus" | "oxapay";
  verifyAttempts: number;
  verifyNote: string | null;
  confirmations: number | null;
  expiresAt: string | null;
  createdAt: string;
  chainQr?: string;
  checkoutUrl?: string;
  upiId?: string;
  upiQrFileId?: string | null;
}

export interface CartLine {
  productId: number;
  quantity: number;
}

export interface PaymentMethods {
  wallet: { enabled: boolean };
  manualCrypto: { enabled: boolean; chains: string[] };
  cryptomus: { enabled: boolean; chains: string[] };
  oxapay: { enabled: boolean };
  upi: { enabled: boolean };
}

export interface QuoteLine {
  productId: number;
  quantity: number;
  subtotal: string;
  discount: string;
  total: string;
  displaySubtotal: string;
  displayDiscount: string;
  displayTotal: string;
}

export interface Quote {
  lines: QuoteLine[];
  grandTotal: string;
  displayGrandTotal: string;
  currency: string;
  walletBalance: string;
  canPayFromWallet: boolean;
}

export type PaymentMethod = "wallet" | "manual_crypto" | "cryptomus" | "oxapay" | "upi";

export interface CheckoutWalletResult {
  method: "wallet";
  orders: { orderId: number; keys: string[] }[];
}
export interface CheckoutPaymentResult {
  method: Exclude<PaymentMethod, "wallet">;
  payment: Payment;
}
export type CheckoutResult = CheckoutWalletResult | CheckoutPaymentResult;

export type OrderUiStatus = "processing" | "delivered" | "failed" | "refunded";

export interface OrderSummary {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  total: string;
  displayTotal: string;
  currency: string;
  status: OrderUiStatus;
  paymentMethod: string;
  createdAt: string;
  imageUrl: string | null;
}

export interface OrderCredential {
  label: string;
  value: string;
}

export interface OrderDetail extends OrderSummary {
  subtotal: string;
  displaySubtotal: string;
  discount: string;
  displayDiscount: string;
  couponCode: string | null;
  credentials: OrderCredential[];
  deliveredAt: string | null;
  payments: Payment[];
}

export interface Ticket {
  id: number;
  subject: string;
  status: "open" | "closed";
  createdAt: string;
  updatedAt: string;
}

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

// ---- client -------------------------------------------------------------------

// GET (and quote's POST-as-query) endpoints take an optional AbortSignal --
// React Query passes its own per-call signal into every queryFn and aborts
// it automatically when a query is cancelled (component unmounts mid-flight,
// a param changes before the previous request resolved, etc). Without
// forwarding it into fetch(), the request keeps running on the wire and its
// (now-unused) response still finishes downloading -- wasted radio/battery
// on mobile data and, if it lands after a newer request for the same query
// key, a possible flash of stale data. Mutations intentionally don't take
// one: a checkout or wallet top-up must never be left half-sent.
export const storeApi = {
  stats: (signal?: AbortSignal) => request<StoreStats>("/api/store/stats", { signal }),

  categories: (signal?: AbortSignal) =>
    request<{ items: Category[] }>("/api/store/categories", { signal }),

  products: (params?: { categoryId?: number; search?: string }, signal?: AbortSignal) =>
    request<{ items: ProductSummary[] }>(`/api/store/products${toQuery(params)}`, { signal }),

  product: (id: number, signal?: AbortSignal) =>
    request<ProductDetail>(`/api/store/products/${id}`, { signal }),

  productReviews: (id: number, page = 1, signal?: AbortSignal) =>
    request<ProductReviews>(`/api/store/products/${id}/reviews?page=${page}`, { signal }),

  submitReview: (id: number, body: { rating: number; body: string }) =>
    request<{ id: number; rating: number; body: string }>(`/api/store/products/${id}/reviews`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  me: (signal?: AbortSignal) => request<StoreUser>("/api/store/me", { signal }),

  wallet: (signal?: AbortSignal) => request<Wallet>("/api/store/wallet", { signal }),

  walletTransactions: (page = 1, signal?: AbortSignal) =>
    request<Paged<WalletTransaction>>(`/api/store/wallet/transactions?page=${page}`, { signal }),

  paymentMethods: (signal?: AbortSignal) =>
    request<PaymentMethods>("/api/store/payment-methods", { signal }),

  topup: (body: { amount: string; method: PaymentMethod; chain?: string }) =>
    request<Payment>("/api/store/wallet/topup", { method: "POST", body: JSON.stringify(body) }),

  payment: (id: number, signal?: AbortSignal) =>
    request<Payment>(`/api/store/payments/${id}`, { signal }),

  submitTx: (id: number, txId: string) =>
    request<{ ok: true }>(`/api/store/payments/${id}/tx`, {
      method: "POST",
      body: JSON.stringify({ txId }),
    }),

  submitScreenshot: (id: number, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return request<{ ok: true }>(`/api/store/payments/${id}/screenshot`, {
      method: "POST",
      body: form,
    });
  },

  cancelPayment: (id: number) =>
    request<{ ok: true }>(`/api/store/payments/${id}/cancel`, { method: "POST" }),

  quote: (lines: CartLine[], couponCode?: string, signal?: AbortSignal) =>
    request<Quote>("/api/store/quote", {
      method: "POST",
      body: JSON.stringify({ lines, couponCode }),
      signal,
    }),

  checkout: (body: {
    lines: CartLine[];
    couponCode?: string;
    method: PaymentMethod;
    chain?: string;
  }) =>
    request<CheckoutResult>("/api/store/checkout", { method: "POST", body: JSON.stringify(body) }),

  orders: (params?: { status?: string; page?: number }, signal?: AbortSignal) =>
    request<Paged<OrderSummary>>(`/api/store/orders${toQuery(params)}`, { signal }),

  order: (id: number, signal?: AbortSignal) =>
    request<OrderDetail>(`/api/store/orders/${id}`, { signal }),

  createTicket: (text: string) =>
    request<{ id: number; status: string }>("/api/store/tickets", {
      method: "POST",
      body: JSON.stringify({ text }),
    }),

  tickets: (page = 1, signal?: AbortSignal) =>
    request<Paged<Ticket>>(`/api/store/tickets?page=${page}`, { signal }),
};
