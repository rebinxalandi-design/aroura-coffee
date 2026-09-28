/**
 * Brand mark: a thin-ring monogram badge -- a geometric "A" built from a
 * coffee bean's split silhouette, enclosed in a fine circle (the classic
 * luxury-mark grammar: negative space and a single confident line, not a
 * literal illustration). Pure SVG (no raster asset, no external font
 * dependency) so it stays crisp at any size and recolors correctly across
 * the light/dark theme via currentColor.
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
      <circle cx="24" cy="24" r="22.25" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <path
        d="M24 12.5 15 33.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M24 12.5 33 33.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M24 12.5c2.6 5.1 2.6 10.3 0 15.6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M18.6 25.5h10.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Logo({
  className = "",
  markClassName = "h-8 w-8 md:h-9 md:w-9",
  wordmarkClassName = "font-display text-lg tracking-[0.02em] md:text-xl",
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
        <span className="align-middle text-[0.92em] italic">roura</span>
      </span>
    </span>
  );
}
