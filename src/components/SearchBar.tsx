import { Search } from "lucide-react";
const shell =
  "flex h-12 items-center gap-2 rounded-2xl border border-border bg-card px-3.5 transition-colors focus-within:border-primary/60";
const PLACEHOLDER = "Search Netflix, ChatGPT, Spotify…";
export function SearchBar({
  value,
  onChange,
  placeholder = PLACEHOLDER,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className={shell}>
      <Search className="size-4 shrink-0 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search products"
        className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}
export function SearchBarButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`press w-full ${shell}`}>
      <Search className="size-4 shrink-0 text-muted-foreground" />
      <span className="truncate text-sm text-muted-foreground">{PLACEHOLDER}</span>
    </button>
  );
}