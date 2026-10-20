"use client";

import { createContext, useContext, useMemo } from "react";
import { createPersistedStore } from "@/lib/persisted-store";

export type Theme = "light" | "dark";

const STORAGE_KEY = "portfolio:theme";

function isTheme(value: string): value is Theme {
  return value === "light" || value === "dark";
}

const themeStore = createPersistedStore<Theme>({
  key: STORAGE_KEY,
  serverValue: "light",
  // O script abaixo já resolveu o tema antes da primeira pintura:
  // aqui basta ler o que ele aplicou no <html>.
  detect: () =>
    document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light",
  isValid: isTheme,
  apply: (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
  },
});

/**
 * Script injetado antes da hidratacao para aplicar o tema salvo
 * sem piscar a tela (FOUC).
 */
export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('${STORAGE_KEY}');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored === 'light' || stored === 'dark' ? stored : (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = themeStore.useValue();

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      toggleTheme: () => themeStore.set(theme === "dark" ? "light" : "dark"),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme precisa ser usado dentro de <ThemeProvider>.");
  }
  return context;
}
