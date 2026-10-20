"use client";

import Link from "next/link";
import { ArrowUp, Mail } from "lucide-react";
import { Container } from "./Container";
import { GithubIcon, InstagramIcon, LinkedinIcon, WhatsappIcon } from "./icons";
import { useI18n } from "@/context/I18nProvider";
import { profile, socials, type SocialKey } from "@/data/profile";

const ICONS: Record<SocialKey, React.ComponentType<{ className?: string }>> = {
  email: Mail,
  whatsapp: WhatsappIcon,
  linkedin: LinkedinIcon,
  github: GithubIcon,
  instagram: InstagramIcon,
};

export function Footer() {
  const { t, tr } = useI18n();

  const navigation = [
    { href: "/", label: t.nav.about },
    { href: "/projetos", label: t.nav.projects },
    { href: "/experiencias", label: t.nav.experiences },
    { href: "/contato", label: t.nav.contact },
  ];

  return (
    <footer className="border-line bg-surface mt-24 border-t">
      <Container className="py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <p className="text-fg text-base font-semibold">{profile.name}</p>
            <p className="text-muted mt-1 text-sm">{tr(profile.role)}</p>
            <p className="text-muted mt-4 max-w-sm text-sm leading-relaxed">
              {tr(profile.headline)}
            </p>
          </div>

          <nav aria-label={t.footer.sections}>
            <p className="text-fg text-xs font-semibold tracking-wider uppercase">
              {t.footer.sections}
            </p>
            <ul className="mt-3 space-y-2">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted hover:text-accent text-sm pressable"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-fg text-xs font-semibold tracking-wider uppercase">
              {t.footer.social}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {socials.map((social) => {
                const Icon = ICONS[social.key];
                return (
                  <li key={social.key}>
                    <a
                      href={social.href}
                      target={social.key === "email" ? undefined : "_blank"}
                      rel="noreferrer noopener"
                      aria-label={social.label}
                      title={social.label}
                      className="border-line bg-surface-2 text-muted hover:text-accent hover:border-accent/50 inline-flex h-9 w-9 items-center justify-center rounded border pressable"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="border-line mt-10 flex flex-col items-start justify-between gap-4 border-t pt-6 sm:flex-row sm:items-center">
          <p className="text-muted text-xs">
            © {new Date().getFullYear()} {profile.name}. {t.footer.rights} {t.footer.builtWith}.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-muted hover:text-accent inline-flex items-center gap-1.5 text-xs font-medium pressable"
          >
            <ArrowUp className="h-3.5 w-3.5" aria-hidden />
            {t.footer.backToTop}
          </button>
        </div>
      </Container>
    </footer>
  );
}
