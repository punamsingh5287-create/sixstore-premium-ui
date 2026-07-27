import { useEffect, useState } from "react";
import { AlertTriangle, Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
export function useScreenLoad(delay = 650) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return loading;
}
export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-2xl", className)} />;
}
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3">
      <div className="flex items-start justify-between">
        <SkeletonBlock className="size-12" />
        <SkeletonBlock className="h-5 w-14 rounded-full" />
      </div>
      <SkeletonBlock className="h-3.5 w-2/3 rounded-md" />
      <SkeletonBlock className="h-3 w-1/2 rounded-md" />
      <SkeletonBlock className="h-4 w-1/3 rounded-md" />
      <SkeletonBlock className="h-10 w-full rounded-full" />
    </div>
  );
}
export function CardSkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
export function RowSkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
        >
          <SkeletonBlock className="size-11" />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <SkeletonBlock className="h-3.5 w-1/2 rounded-md" />
            <SkeletonBlock className="h-3 w-3/4 rounded-md" />
          </div>
          <SkeletonBlock className="h-9 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}
export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
      <div className="grid size-14 place-items-center rounded-full bg-secondary text-muted-foreground">
        <Inbox className="size-6" />
      </div>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <p className="max-w-[26ch] text-sm text-muted-foreground">{body}</p>
      {action}
    </div>
  );
}
export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 px-6 py-10 text-center">
      <div className="grid size-14 place-items-center rounded-full bg-destructive/20 text-destructive">
        <AlertTriangle className="size-6" />
      </div>
      <h2 className="text-base font-semibold text-foreground">Something went wrong</h2>
      <p className="max-w-[28ch] text-sm text-muted-foreground">{message}</p>
      <button
        onClick={onRetry}
        className="press min-h-11 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
      >
        Try again
      </button>
    </div>
  );
}