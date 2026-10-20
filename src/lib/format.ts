import type { Locale } from "@/i18n/types";

const MONTHS: Record<Locale, string[]> = {
  pt: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

/** "2025-03" -> "mar 2025" / "Mar 2025" */
export function formatMonth(value: string, locale: Locale) {
  const [year, month] = value.split("-");
  const index = Number(month) - 1;
  const name = MONTHS[locale][index] ?? month;
  return `${name} ${year}`;
}

/** Intervalo "mar 2025 — jul 2025" ou "mar 2025 — atual". */
export function formatRange(start: string, end: string | null, locale: Locale) {
  const current = locale === "pt" ? "atual" : "present";
  if (!end) return `${formatMonth(start, locale)} — ${current}`;
  if (end === start) return formatMonth(start, locale);
  return `${formatMonth(start, locale)} — ${formatMonth(end, locale)}`;
}

export function classNames(...values: (string | false | null | undefined)[]) {
  return values.filter(Boolean).join(" ");
}
