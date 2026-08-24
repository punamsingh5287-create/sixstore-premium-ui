import { useEffect, useState, type ReactNode } from "react";
import { ShieldCheck, Sparkles } from "lucide-react";

/** Shown once per app load (per page load), as requested. */
let agreedThisLoad = false;

export function TermsGate({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!agreedThisLoad) setOpen(true);
  }, []);

  function accept() {
    if (leaving) return;
    setLeaving(true);
    agreedThisLoad = true;
    window.setTimeout(() => setOpen(false), 340);
  }

  return (
    <>
      {children}
      {mounted && open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Terms and Conditions"
          tabIndex={0}
          onClick={accept}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " " || e.key === "Escape") accept();
          }}
          className={`fixed inset-0 z-[100] cursor-pointer select-none bg-background/95 backdrop-blur-2xl ${
            leaving ? "gate-out" : "gate-in"
          }`}
        >
          <div className="safe-top safe-bottom mx-auto flex h-full w-full max-w-[480px] flex-col justify-center px-6">
            <div className="ios-glass rounded-[30px] p-6">
              <div className="mx-auto grid size-14 place-items-center rounded-2xl border border-primary/30 bg-primary/12">
                <ShieldCheck className="size-7 text-primary" />
              </div>
              <h2 className="mt-4 text-center text-xl font-bold tracking-tight text-foreground">
                Terms &amp; Conditions
              </h2>
              <p className="mt-3 text-center text-sm leading-relaxed text-muted-foreground">
                SixStore sells digital subscriptions and activation services. All plans are
                delivered digitally and covered for their full term. Prices, stock and delivery
                times are shown before payment. Refunds and replacements follow our Refund Policy.
                By continuing you agree to our Terms of Service and Privacy Policy.
              </p>
              <ul className="mt-4 space-y-2 text-[13px] text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
                  Accounts are for personal use and must not be resold.
                </li>
                <li className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
                  Sharing login credentials may void warranty.
                </li>
              </ul>
              <div className="glass-btn-primary mt-6 grid h-12 place-items-center rounded-2xl text-sm font-bold">
                I Agree
              </div>
              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                Tap anywhere to continue
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
