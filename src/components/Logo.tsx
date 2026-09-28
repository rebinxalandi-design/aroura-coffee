/**
 * Brand mark: a seal-style emblem -- concentric hairline rings framing a
 * geometric "A" (a coffee bean's split silhouette), with a small gold apex
 * accent. Concentric rings + a single confident glyph is the grammar of
 * established luxury marks (a coin, a seal) rather than an illustration.
 * Pure SVG (no raster asset, no external font dependency) so it stays
 * crisp at any size; the line work recolors via currentColor, and the
 * accent uses the theme's fixed gold token so it reads the same in both
 * themes.
 */
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="22.75" stroke="currentColor" strokeWidth="0.75" opacity="0.45" />
      <circle cx="24" cy="24" r="19.5" stroke="currentColor" strokeWidth="0.75" opacity="0.32" />
      <path
        d="M24 13.5 14.5 34"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M24 13.5 33.5 34"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M19.4 26.2h9.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="24" cy="13.5" r="1.3" fill="#c9944f" />
    </svg>
  );
}

export default function Logo({
  className = "",
  markClassName = "h-8 w-8 md:h-9 md:w-9",
  wordmarkClassName = "font-display text-lg tracking-[0.04em] md:text-xl",
}: {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-3 text-espresso ${className}`}>
      <LogoMark className={markClassName} />
      <span className={wordmarkClassName}>
        <span className="align-middle">A</span>
        <span className="align-middle text-[0.9em] italic">roura</span>
      </span>
    </span>
  );
}
