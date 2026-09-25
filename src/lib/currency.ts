const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

function toFarsiDigits(input: string): string {
  return input.replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);
}

/**
 * Formats a Toman amount per-locale.
 * fa: Persian digits + "تومان" (e.g. "۴۵,۰۰۰ تومان")
 * en: "45,000 Toman"
 */
export function formatToman(amount: number, locale: "en" | "fa"): string {
  const grouped = amount.toLocaleString("en-US");
  if (locale === "fa") {
    return `${toFarsiDigits(grouped)} تومان`;
  }
  return `${grouped} Toman`;
}
