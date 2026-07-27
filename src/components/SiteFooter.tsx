import { Link } from "@tanstack/react-router";
import { ExternalLink, Send, ShieldCheck } from "lucide-react";
import brandLogo from "@/assets/sixstore-logo.jpg.asset.json";

const columns: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/legal/privacy" },
      { label: "Terms of Service", to: "/legal/terms" },
      { label: "Refund Policy", to: "/legal/refund" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Support", to: "/support" },
      { label: "My Orders", to: "/orders" },
      { label: "Wallet", to: "/wallet" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="layer-card mt-2 flex flex-col gap-5 rounded-3xl border border-border p-5">
      <div className="flex items-center gap-3">
        <img
          src={brandLogo.url}
          alt="SixStore logo"
          className="logo-3d size-10 rounded-xl object-cover"
          loading="lazy"
        />
        <div className="min-w-0">
          <p className="font-display text-base font-bold tracking-tight text-foreground">SixStore</p>
          <p className="text-[11px] text-muted-foreground">
            Premium OTT & AI subscriptions, delivered instantly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {columns.map((col) => (
          <div key={col.title} className="flex flex-col gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {col.title}
            </p>
            {col.links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="text-xs text-foreground/80 transition-colors hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <a
        href="https://t.me/sixstore"
        target="_blank"
        rel="noreferrer"
        className="bounce-press ripple glass-chip flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold text-foreground"
      >
        <Send className="size-4 text-primary" />
        Join us on Telegram
        <ExternalLink className="size-3.5 text-muted-foreground" />
      </a>

      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="size-3.5 text-primary" />
          Secure payments · Full-term warranty
        </span>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>© {new Date().getFullYear()} SixStore. All rights reserved.</span>
          <span className="rounded-full bg-secondary px-2 py-0.5">v1.4.0</span>
        </div>
      </div>
    </footer>
  );
}