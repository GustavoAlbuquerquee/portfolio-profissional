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

/* ──────────────────────────────────────────────────────────────────────────
 * Aritmetica de meses para os graficos de stint e de duracao.
 * Todas as datas do projeto sao "AAAA-MM", entao basta converter para um
 * indice absoluto de meses e trabalhar com inteiros.
 * ────────────────────────────────────────────────────────────────────────── */

/** "2025-03" -> 24303 (ano * 12 + mes). */
export function monthIndex(value: string) {
  const [year, month] = value.split("-").map(Number);
  return year * 12 + (month - 1);
}

/** Mes corrente no formato "AAAA-MM". */
export function currentMonth() {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;
}

/** Duracao em meses, contando o mes inicial. `end` nulo conta ate hoje. */
export function monthSpan(start: string, end: string | null) {
  return monthIndex(end ?? currentMonth()) - monthIndex(start) + 1;
}

/** Duracao legivel: "8 meses", "1 ano e 2 meses". */
export function formatDuration(months: number, locale: Locale) {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts: string[] = [];

  if (locale === "pt") {
    if (years) parts.push(`${years} ${years === 1 ? "ano" : "anos"}`);
    if (rest) parts.push(`${rest} ${rest === 1 ? "mês" : "meses"}`);
    return parts.join(" e ") || "1 mês";
  }

  if (years) parts.push(`${years}y`);
  if (rest) parts.push(`${rest}mo`);
  return parts.join(" ") || "1mo";
}
