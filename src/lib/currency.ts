/**
 * Formats a Toman amount per-locale.
 *
 * Both locales use Western digits (0-9), even in Persian -- Extended
 * Arabic-Indic digits (۰۱۲...) trigger a rendering bug in this font/browser
 * combination where multi-digit runs next to certain punctuation get
 * garbled into the wrong glyphs entirely (verified: "۰۱ — کیفیت" rendered
 * as "اه — کیفیت"). Western digits are unambiguous and universally read
 * by Persian speakers, so they're used everywhere instead of working
 * around the renderer bug per call site.
 *
 * fa: "45,000 تومان"
 * en: "45,000 Toman"
 */
export function formatToman(amount: number, locale: "en" | "fa"): string {
  const grouped = amount.toLocaleString("en-US");
  if (locale === "fa") {
    return `${grouped} تومان`;
  }
  return `${grouped} Toman`;
}
