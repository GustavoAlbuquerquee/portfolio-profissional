"use client";

import { useI18n } from "@/context/I18nProvider";
import { classNames } from "@/lib/format";
import type { Locale } from "@/i18n/types";

const OPTIONS: { value: Locale; short: string }[] = [
  { value: "pt", short: "PT" },
  { value: "en", short: "EN" },
];

export function LanguageToggle() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t.language.label}
      className="border-line bg-surface inline-flex items-center rounded-lg border p-0.5"
    >
      {OPTIONS.map((option) => {
        const active = locale === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setLocale(option.value)}
            aria-pressed={active}
            aria-label={option.value === "pt" ? t.language.pt : t.language.en}
            className={classNames(
              "rounded-md px-2 py-1 font-mono text-xs font-semibold transition-colors",
              active
                ? "bg-accent text-white"
                : "text-muted hover:text-fg hover:bg-surface-2",
            )}
          >
            {option.short}
          </button>
        );
      })}
    </div>
  );
}
