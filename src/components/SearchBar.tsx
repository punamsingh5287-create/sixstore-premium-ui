import { Search } from "lucide-react";
export function SearchBar({
  value,
  onChange,
  placeholder = "Search Netflix, ChatGPT, Spotify…",
  readOnlyHint,
}: {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  readOnlyHint?: boolean;
}) {
  return (
    <div className="flex h-12 items-center gap-2 rounded-2xl border border-border bg-card px-3.5 transition-colors focus-within:border-primary/60">
      <Search className="size-4 shrink-0 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={readOnlyHint}
        placeholder={placeholder}
        aria-label="Search products"
        className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}