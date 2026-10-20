export type Locale = "pt" | "en";

export const LOCALES: Locale[] = ["pt", "en"];

/** Texto que existe nos dois idiomas. */
export type Localized<T = string> = Record<Locale, T>;

export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}
