import { createFileRoute, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

type LegalDoc = { title: string; intro: string; sections: { h: string; p: string }[] };

const docs: Record<string, LegalDoc> = {
  privacy: {
    title: "Privacy Policy",
    intro:
      "SixStore collects only what is needed to deliver your subscription orders inside Telegram.",
    sections: [
      { h: "What we collect", p: "Your Telegram display name, order history and wallet activity." },
      { h: "How we use it", p: "To deliver credentials, process refunds and provide support." },
      { h: "Sharing", p: "We never sell your data. Payment partners receive only what a transaction requires." },
      { h: "Your control", p: "Ask support at any time to export or delete your SixStore account data." },
    ],
  },
  terms: {
    title: "Terms of Service",
    intro: "By purchasing on SixStore you agree to the terms below.",
    sections: [
      { h: "Accounts", p: "One SixStore account per Telegram user. Reselling delivered credentials is not allowed." },
      { h: "Delivery", p: "Orders are usually delivered within 5 minutes and always within 24 hours." },
      { h: "Warranty", p: "Every plan carries a full-term warranty with free replacement." },
      { h: "Fair use", p: "Accounts abused, shared beyond the plan limits or charged back may be suspended." },
    ],
  },
  refund: {
    title: "Refund Policy",
    intro: "If we cannot deliver or replace your order, you get your money back.",
    sections: [
      { h: "Eligible", p: "Undelivered orders, or products we cannot replace within 24 hours." },
      { h: "Not eligible", p: "Orders where credentials were changed or shared by the buyer." },
      { h: "How it works", p: "Refunds are credited to your SixStore wallet instantly, or to source in 5-7 days." },
      { h: "Raising a request", p: "Open the order, tap Support and choose Request refund." },
    ],
  },
};

export const Route = createFileRoute("/legal/$doc")({
  loader: ({ params }) => {
    const doc = docs[params.doc];
    if (!doc) throw notFound();
    return doc;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Legal"} — SixStore` },
      { name: "description", content: loaderData?.intro ?? "SixStore legal information." },
      { property: "og:title", content: `${loaderData?.title ?? "Legal"} — SixStore` },
      { property: "og:description", content: loaderData?.intro ?? "SixStore legal information." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LegalScreen,
});

function LegalScreen() {
  const doc = Route.useLoaderData() as LegalDoc;
  return (
    <AppShell title={doc.title} subtitle="SixStore" back showCart={false}>
      <div className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed text-muted-foreground">{doc.intro}</p>
        {doc.sections.map((s) => (
          <section key={s.h} className="layer-card flex flex-col gap-1.5 rounded-2xl border border-border p-4">
            <h2 className="text-sm font-semibold text-foreground">{s.h}</h2>
            <p className="text-xs leading-relaxed text-muted-foreground">{s.p}</p>
          </section>
        ))}
        <p className="text-[11px] text-muted-foreground">Last updated · July 2026 · v1.4.0</p>
      </div>
    </AppShell>
  );
}