import type { Product } from "@/lib/mock-data";
const glyphs: Record<string, React.ReactNode> = {
  "netflix-premium": (
    <>
      <path d="M6 3h4.2l7.6 14.4V3H22v18h-4.2L10.2 6.6V21H6z" fill="currentColor" />
    </>
  ),
  "prime-video": (
    <>
      <path
        d="M3 15.4c3.6 2.4 7.2 3.6 11 3.6 2.6 0 5.2-.5 7.7-1.6.5-.2.9.4.4.8C19.7 20.4 16.5 21.6 13 21.6c-4.2 0-8-1.6-11-4.6-.3-.3 0-.8.4-.6z"
        fill="currentColor"
      />
      <path
        d="M8 4h2.4l2.1 7.1L14.7 4h2.3l-3.4 10h-2.3z"
        fill="currentColor"
      />
    </>
  ),
  "spotify-premium": (
    <>
      <circle cx="12" cy="12" r="9.5" fill="currentColor" opacity="0.18" />
      <path
        d="M7 9.4c3.2-1 6.9-.7 9.8 1M7.6 12.5c2.7-.8 5.7-.5 8.1.9M8.2 15.4c2.1-.6 4.4-.4 6.3.7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),
  "hotstar-sports": (
    <>
      <path
        d="M12 2.8l2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.2l6.1-.8z"
        fill="currentColor"
      />
    </>
  ),
  "chatgpt-plus": (
    <>
      <path
        d="M12 2.6l1.7 4.6a5 5 0 003.1 3.1l4.6 1.7-4.6 1.7a5 5 0 00-3.1 3.1L12 21.4l-1.7-4.6a5 5 0 00-3.1-3.1L2.6 12l4.6-1.7a5 5 0 003.1-3.1z"
        fill="currentColor"
      />
    </>
  ),
  "claude-pro": (
    <>
      <path
        d="M7.4 19L11 5h2l3.6 14h-2.3l-.8-3.4h-3l-.8 3.4zm3.5-5.4h2.2L12 8.6z"
        fill="currentColor"
      />
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.4" />
    </>
  ),
  midjourney: (
    <>
      <path
        d="M2.8 17.6c2.2-7 5.6-11 9.6-11.9-1.1 2-1.6 4-1.5 6 2.1-3.4 5-5.4 8.4-5.9-2.7 3.4-4 7-3.9 10.9-3.6-1.6-7.5-1.3-12.6.9z"
        fill="currentColor"
      />
    </>
  ),
  "cursor-pro": (
    <>
      <path d="M5 3.2l13 7.3-5.6 1.6-1.7 5.6z" fill="currentColor" />
      <path d="M12.6 13.4L18 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
};
export function BrandMark({ product, size = 48 }: { product: Product; size?: number }) {
  const glyph = glyphs[product.id];
  return (
    <div
      className="grid shrink-0 place-items-center rounded-2xl"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(120% 120% at 20% 0%, color-mix(in oklab, ${product.accent} 34%, transparent), color-mix(in oklab, ${product.accent} 12%, transparent))`,
        border: `1px solid color-mix(in oklab, ${product.accent} 40%, transparent)`,
        color: product.accent,
        boxShadow: `inset 0 1px 0 color-mix(in oklab, ${product.accent} 25%, transparent)`,
      }}
    >
      {glyph ? (
        <svg
          viewBox="0 0 24 24"
          width={size * 0.55}
          height={size * 0.55}
          aria-hidden="true"
          role="presentation"
        >
          {glyph}
        </svg>
      ) : (
        <span className="font-display font-bold" style={{ fontSize: size / 2.8 }}>
          {product.initials}
        </span>
      )}
    </div>
  );
}