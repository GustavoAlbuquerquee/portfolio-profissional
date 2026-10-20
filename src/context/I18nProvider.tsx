"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { dictionaries, type Dictionary } from "@/i18n/dictionaries";
import { createPersistedStore } from "@/lib/persisted-store";
import type { Locale, Localized } from "@/i18n/types";

const STORAGE_KEY = "portfolio:locale";

function isLocale(value: string): value is Locale {
  return value === "pt" || value === "en";
}

const localeStore = createPersistedStore<Locale>({
  key: STORAGE_KEY,
  serverValue: "pt",
  // Sem preferência salva: segue o idioma do navegador.
  detect: () => (navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en"),
  isValid: isLocale,
  apply: (locale) => {
    document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
  },
});

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  /** Textos de interface do idioma atual. */
  t: Dictionary;
  /** Resolve um texto bilingue vindo de `src/data`. */
  tr: <T>(value: Localized<T>) => T;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = localeStore.useValue();

  // Mantem o atributo `lang` do <html> em sincronia com o idioma — inclusive
  // quando a pagina abre ja com uma preferencia salva (acessibilidade e SEO).
  useEffect(() => {
    document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
  }, [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale: localeStore.set,
      toggleLocale: () => localeStore.set(locale === "pt" ? "en" : "pt"),
      t: dictionaries[locale],
      tr: (localized) => localized[locale],
    }),
    [locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n precisa ser usado dentro de <I18nProvider>.");
  }
  return context;
}
