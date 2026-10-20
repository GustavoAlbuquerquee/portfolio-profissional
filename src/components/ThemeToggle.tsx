"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeProvider";
import { useI18n } from "@/context/I18nProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={t.theme.toggle}
      title={theme === "dark" ? t.theme.light : t.theme.dark}
      className="border-line bg-surface text-muted hover:text-accent hover:border-accent/50 inline-flex h-9 w-9 items-center justify-center rounded border transition-colors"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" aria-hidden />
      ) : (
        <Moon className="h-4 w-4" aria-hidden />
      )}
    </button>
  );
}
