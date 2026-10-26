"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { Menu, X } from "lucide-react";
import { Container } from "./Container";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";
import { useI18n } from "@/context/I18nProvider";
import { profile } from "@/data/profile";
import { classNames } from "@/lib/format";

export function Header() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const scrolled = useSyncExternalStore(subscribeToScroll, isScrolled, () => false);

  const navigation = [
    { href: "/", label: t.nav.about },
    { href: "/projetos", label: t.nav.projects },
    { href: "/experiencias", label: t.nav.experiences },
    { href: "/contato", label: t.nav.contact },
  ];

  // Fecha o menu mobile ao navegar entre paginas (ajuste de estado durante a
  // renderizacao, conforme recomendado pelo React para estado derivado).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  return (
    <header
      className={classNames(
        "sticky top-0 z-50 w-full border-b transition-colors duration-200",
        scrolled
          ? "border-line bg-bg/85 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5"
          aria-label={profile.name}
        >
          <span className="from-accent to-accent-2 grid h-9 w-9 place-items-center rounded bg-gradient-to-br font-mono text-sm font-bold text-on-accent">
            {profile.initials}
          </span>
          <span className="text-fg hidden text-sm font-semibold sm:block">{profile.name}</span>
        </Link>

        <nav aria-label={t.nav.openMenu} className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={classNames(
                  "rounded px-3 py-2 text-sm font-medium pressable",
                  active
                    ? "text-accent bg-accent-soft"
                    : "text-muted hover:text-fg hover:bg-surface-2",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            className="border-line bg-surface text-muted hover:text-accent inline-flex h-9 w-9 items-center justify-center rounded border pressable md:hidden"
          >
            {open ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </Container>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label={t.nav.openMenu}
          className="border-line bg-surface border-t md:hidden"
        >
          <Container className="flex flex-col py-2">
            {navigation.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={classNames(
                    "rounded px-3 py-3 text-sm font-medium pressable",
                    active ? "text-accent bg-accent-soft" : "text-muted hover:text-fg",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </Container>
        </nav>
      ) : null}
    </header>
  );
}

/** Scroll como fonte externa: evita setState dentro de efeito. */
function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

function isScrolled() {
  return window.scrollY > 8;
}
