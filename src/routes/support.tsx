import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, MessageCircle, Send, Ticket } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { RowSkeletonList, SkeletonBlock, useScreenLoad } from "@/components/states";
import { faqs } from "@/lib/mock-data";
export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Help & support — SixStore" },
      {
        name: "description",
        content: "Delivery times, warranty, refunds and how to reach the SixStore support team.",
      },
      { property: "og:title", content: "Help & support — SixStore" },
      { property: "og:description", content: "FAQs and live chat support for SixStore orders." },
    ],
  }),
  component: SupportScreen,
});
function SupportScreen() {
  const loading = useScreenLoad(400);
  const [open, setOpen] = useState<number | null>(0);
  const [message, setMessage] = useState("");
  return (
    <AppShell title="Support" subtitle="Avg. reply in 4 minutes" back>
      {loading ? (
        <div className="flex flex-col gap-4">
          <SkeletonBlock className="h-24" />
          <RowSkeletonList count={4} />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <section className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 rounded-2xl border border-border bg-card p-4">
              <MessageCircle className="size-5 text-primary" />
              <p className="text-sm font-semibold text-foreground">Live chat</p>
              <p className="text-[11px] text-muted-foreground">24×7 in Telegram</p>
            </div>
            <div className="flex flex-col gap-1 rounded-2xl border border-border bg-card p-4">
              <Ticket className="size-5 text-primary" />
              <p className="text-sm font-semibold text-foreground">2 open tickets</p>
              <p className="text-[11px] text-muted-foreground">SX-10493, SX-10077</p>
            </div>
          </section>
          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-foreground">Frequently asked</h2>
            {faqs.map((f, i) => (
              <div key={f.q} className="rounded-2xl border border-border bg-card">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex min-h-14 w-full items-center gap-3 px-4 text-left"
                  aria-expanded={open === i}
                >
                  <span className="min-w-0 flex-1 text-sm font-medium text-foreground">{f.q}</span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`}
                  />
                </button>
                {open === i ? (
                  <p className="border-t border-border px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </p>
                ) : null}
              </div>
            ))}
          </section>
          <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
            <h2 className="text-sm font-semibold text-foreground">Message support</h2>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Share your order ID and what went wrong…"
              className="w-full resize-none rounded-2xl border border-border bg-background p-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/60"
            />
            <button
              disabled={message.trim().length === 0}
              onClick={() => {
                setMessage("");
                toast.success("Ticket created — support will reply in chat");
              }}
              className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground active:scale-95 disabled:opacity-50"
            >
              <Send className="size-4" /> Send message
            </button>
          </section>
        </div>
      )}
    </AppShell>
  );
}