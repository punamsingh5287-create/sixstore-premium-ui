export type ProductKind = "ott" | "ai";
export type Plan = { id: string; label: string; months: number; price: number; mrp: number };
export type Product = {
  id: string;
  name: string;
  tagline: string;
  kind: ProductKind;
  category: string;
  accent: string;
  initials: string;
  rating: number;
  reviews: number;
  sold: number;
  plans: Plan[];
  highlights: string[];
  description: string;
  badge?: string;
};
export const categories: {
  id: string;
  name: string;
  kind: ProductKind;
  blurb: string;
}[] = [
  { id: "streaming", name: "Streaming", kind: "ott", blurb: "Movies & series" },
  { id: "music", name: "Music", kind: "ott", blurb: "Ad-free listening" },
  { id: "sports", name: "Live Sports", kind: "ott", blurb: "Match day passes" },
  { id: "ai-chat", name: "AI Assistants", kind: "ai", blurb: "Chat & reasoning" },
  { id: "ai-image", name: "AI Design", kind: "ai", blurb: "Image & video gen" },
  { id: "ai-code", name: "AI Coding", kind: "ai", blurb: "Dev copilots" },
];
const plans = (base: number, off = 1.6): Plan[] => [
  { id: "1m", label: "1 Month", months: 1, price: base, mrp: Math.round(base * off) },
  {
    id: "3m",
    label: "3 Months",
    months: 3,
    price: Math.round(base * 2.7),
    mrp: Math.round(base * 2.7 * off * 1.05),
  },
  {
    id: "12m",
    label: "12 Months",
    months: 12,
    price: Math.round(base * 9),
    mrp: Math.round(base * 9 * off * 1.12),
  },
];
export const products: Product[] = [
  {
    id: "netflix-premium",
    name: "Netflix Premium",
    tagline: "4K UHD · 4 screens",
    kind: "ott",
    category: "streaming",
    accent: "oklch(0.62 0.22 25)",
    initials: "NF",
    rating: 4.8,
    reviews: 2140,
    sold: 9820,
    plans: plans(199, 1.85),
    badge: "Bestseller",
    highlights: ["Instant delivery", "4K + HDR", "Works on TV & mobile", "30-day warranty"],
    description:
      "A private profile on a Netflix Premium plan. Stream in 4K UHD with Dolby Atmos on any device. Credentials arrive in chat within 5 minutes of purchase.",
  },
  {
    id: "prime-video",
    name: "Prime Video",
    tagline: "HD · Includes Prime perks",
    kind: "ott",
    category: "streaming",
    accent: "oklch(0.68 0.14 235)",
    initials: "PV",
    rating: 4.6,
    reviews: 1180,
    sold: 5310,
    plans: plans(99, 1.45),
    highlights: ["Instant delivery", "Full HD streaming", "Mobile + TV", "Replacement warranty"],
    description:
      "Prime Video access with the full catalogue of originals, plus delivery perks on the linked storefront.",
  },
  {
    id: "spotify-premium",
    name: "Spotify Premium",
    tagline: "Ad-free · Offline downloads",
    kind: "ott",
    category: "music",
    accent: "oklch(0.75 0.17 150)",
    initials: "SP",
    rating: 4.9,
    reviews: 3320,
    sold: 14200,
    plans: plans(129, 1.72),
    badge: "Top rated",
    highlights: ["Upgrade on your own ID", "Offline downloads", "No ads", "Lossless tier"],
    description:
      "Premium upgrade applied directly to your existing Spotify account — keep every playlist, lose every ad.",
  },
  {
    id: "hotstar-sports",
    name: "Hotstar Sports",
    tagline: "Live cricket & football",
    kind: "ott",
    category: "sports",
    accent: "oklch(0.7 0.15 265)",
    initials: "HS",
    rating: 4.5,
    reviews: 870,
    sold: 4020,
    plans: plans(149, 2.05),
    highlights: ["Live match streams", "Multi-cam angles", "2 screens", "Season pass option"],
    description: "Season-long access to live sport with multi-language commentary and multi-cam angles.",
  },
  {
    id: "chatgpt-plus",
    name: "ChatGPT Plus",
    tagline: "Priority model access",
    kind: "ai",
    category: "ai-chat",
    accent: "oklch(0.76 0.13 170)",
    initials: "GP",
    rating: 4.9,
    reviews: 2760,
    sold: 11800,
    plans: plans(1499, 1.35),
    badge: "Bestseller",
    highlights: ["Priority access", "Advanced data analysis", "Voice mode", "Larger context"],
    description:
      "A Plus-tier assistant seat with faster responses, larger context and priority availability at peak hours.",
  },
  {
    id: "claude-pro",
    name: "Claude Pro",
    tagline: "Long context · Projects",
    kind: "ai",
    category: "ai-chat",
    accent: "oklch(0.78 0.12 60)",
    initials: "CL",
    rating: 4.8,
    reviews: 1440,
    sold: 6100,
    plans: plans(1699, 1.55),
    highlights: ["200K context", "Projects & artifacts", "File analysis", "5x usage limits"],
    description: "A Pro seat tuned for long-document work, research and writing with generous usage limits.",
  },
  {
    id: "midjourney",
    name: "Midjourney",
    tagline: "Standard plan · Fast hours",
    kind: "ai",
    category: "ai-image",
    accent: "oklch(0.72 0.16 320)",
    initials: "MJ",
    rating: 4.7,
    reviews: 980,
    sold: 3560,
    plans: plans(1299, 1.28),
    highlights: ["15 fast hours", "Unlimited relax mode", "Commercial usage", "Stealth add-on"],
    description: "An image generation seat with fast GPU hours and commercial usage rights for client work.",
  },
  {
    id: "cursor-pro",
    name: "Cursor Pro",
    tagline: "Agentic coding IDE",
    kind: "ai",
    category: "ai-code",
    accent: "oklch(0.7 0.14 240)",
    initials: "CU",
    rating: 4.7,
    reviews: 720,
    sold: 2480,
    plans: plans(1599, 1.62),
    highlights: ["Unlimited completions", "Agent mode", "Repo-wide context", "Fast requests"],
    description: "A Pro seat for the agentic code editor with repo-wide context and fast premium requests.",
  },
];
export const getProduct = (id: string) => products.find((p) => p.id === id);
export const stockById: Record<string, number> = {
  "netflix-premium": 42,
  "prime-video": 7,
  "spotify-premium": 68,
  "hotstar-sports": 3,
  "chatgpt-plus": 15,
  "claude-pro": 9,
  midjourney: 0,
  "cursor-pro": 24,
};
export const getStock = (id: string) => stockById[id] ?? 0;
export type Order = {
  id: string;
  productId: string;
  planLabel: string;
  placedAt: string;
  amount: number;
  status: "delivered" | "processing" | "failed" | "refunded";
  note: string;
  method: string;
  qty: number;
  deliveryType: string;
  credentials?: { label: string; value: string }[];
  eligibility: string;
};
export const orders: Order[] = [
  {
    id: "SX-10493",
    productId: "chatgpt-plus",
    planLabel: "1 Month",
    placedAt: "26 Jul 2026, 10:42",
    amount: 1499,
    status: "processing",
    note: "Seat is being provisioned — usually under 10 minutes.",
    method: "UPI",
    qty: 1,
    deliveryType: "Account seat invite",
    eligibility: "Replacement available once delivered.",
  },
  {
    id: "SX-10388",
    productId: "netflix-premium",
    planLabel: "3 Months",
    placedAt: "18 Jul 2026, 21:07",
    amount: 537,
    status: "delivered",
    note: "Credentials sent in chat. Warranty active till 18 Oct 2026.",
    method: "SixStore Wallet",
    qty: 1,
    deliveryType: "Login credentials",
    credentials: [
      { label: "Email", value: "sx-nf-4821@sixstore.mail" },
      { label: "Password", value: "••••••••••" },
      { label: "Profile", value: "Profile 3" },
    ],
    eligibility: "Free replacement till 18 Oct 2026. Refund not applicable after delivery.",
  },
  {
    id: "SX-10201",
    productId: "spotify-premium",
    planLabel: "12 Months",
    placedAt: "02 Jun 2026, 08:15",
    amount: 1161,
    status: "delivered",
    note: "Upgrade applied to your Spotify ID.",
    method: "Card",
    qty: 1,
    deliveryType: "Upgrade on your own ID",
    credentials: [{ label: "Upgraded ID", value: "aarav.mehta@gmail.com" }],
    eligibility: "Free replacement till 02 Jun 2027.",
  },
  {
    id: "SX-10077",
    productId: "midjourney",
    planLabel: "1 Month",
    placedAt: "11 May 2026, 19:30",
    amount: 1299,
    status: "failed",
    note: "Payment reversed to wallet. You can retry any time.",
    method: "UPI",
    qty: 1,
    deliveryType: "Account seat invite",
    eligibility: "Nothing was charged — retry any time.",
  },
  {
    id: "SX-09984",
    productId: "prime-video",
    planLabel: "1 Month",
    placedAt: "28 Apr 2026, 12:05",
    amount: 99,
    status: "refunded",
    note: "Refunded to SixStore wallet on 29 Apr 2026.",
    method: "SixStore Wallet",
    qty: 1,
    deliveryType: "Login credentials",
    eligibility: "Refund completed. No further action needed.",
  },
];
export const getOrder = (id: string) => orders.find((o) => o.id === id);
export type WalletTx = {
  id: string;
  label: string;
  at: string;
  amount: number;
  kind: "topup" | "spend" | "refund" | "cashback";
};
export const wallet = {
  balance: 2480,
  cashbackEarned: 615,
  tier: "Gold",
  transactions: [
    {
      id: "w1",
      label: "Order SX-10493 · ChatGPT Plus",
      at: "26 Jul, 10:42",
      amount: -1499,
      kind: "spend",
    },
    { id: "w2", label: "Wallet top-up · UPI", at: "26 Jul, 10:39", amount: 2000, kind: "topup" },
    { id: "w3", label: "Cashback · Order SX-10388", at: "18 Jul, 21:08", amount: 27, kind: "cashback" },
    {
      id: "w4",
      label: "Order SX-10388 · Netflix Premium",
      at: "18 Jul, 21:07",
      amount: -537,
      kind: "spend",
    },
    { id: "w5", label: "Refund · Order SX-10077", at: "11 May, 20:02", amount: 1299, kind: "refund" },
  ] as WalletTx[],
};
export const user = {
  name: "Aarav Mehta",
  handle: "@aaravm",
  memberSince: "Mar 2025",
  tier: "Gold",
  initials: "AM",
  orders: 24,
  saved: 4310,
  referrals: 6,
};
export const faqs = [
  {
    q: "How fast is delivery after I order?",
    a: "Most OTT subscriptions land in your chat within 5 minutes. AI tool seats can take up to 30 minutes at peak hours.",
  },
  {
    q: "What does the warranty cover?",
    a: "If a subscription stops working within the plan duration we replace it free of charge — just open a ticket with your order ID.",
  },
  {
    q: "Can I pay with wallet balance?",
    a: "Yes. Wallet balance is applied at checkout automatically and the remainder goes to your chosen payment method.",
  },
  {
    q: "Do you support refunds?",
    a: "Failed or undelivered orders are refunded to your SixStore wallet instantly, and to the source account within 5-7 days on request.",
  },
];