/**
 * Brand mark: a monogram "A" formed from a coffee cup's silhouette with a
 * rising steam wisp, plus the wordmark. Pure SVG (no raster asset, no
 * external font dependency) so it stays crisp at any size and recolors
 * correctly across the light/dark theme via currentColor.
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
      <path
        d="M24 6c-1 3.2-6.5 8-6.5 14.2C17.5 25.8 20.2 29 24 29s6.5-3.2 6.5-8.8C30.5 14 25 9.2 24 6Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M11 22h26c.8 0 1.4.7 1.3 1.5l-.6 4.3A15.7 15.7 0 0 1 22.6 41 15.7 15.7 0 0 1 9.4 28l-1.7-4.9A1.3 1.3 0 0 1 9 21.3Z"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M37.2 25.5c3.6-.4 6.3 1.7 6.3 5s-2.9 5.7-6.5 5.4"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M15 41.5h15"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Logo({
  className = "",
  markClassName = "h-7 w-7 md:h-8 md:w-8",
  wordmarkClassName = "font-display text-lg italic tracking-tight md:text-xl",
}: {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 text-espresso ${className}`}>
      <LogoMark className={markClassName} />
      <span className={wordmarkClassName}>Aroura</span>
    </span>
  );
}
