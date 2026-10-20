"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { GithubIcon, InstagramIcon, LinkedinIcon, WhatsappIcon } from "./icons";
import { Reveal } from "./Reveal";
import { useI18n } from "@/context/I18nProvider";
import { socials, type SocialKey } from "@/data/profile";

const ICONS: Record<SocialKey, React.ComponentType<{ className?: string }>> = {
  email: Mail,
  whatsapp: WhatsappIcon,
  linkedin: LinkedinIcon,
  github: GithubIcon,
  instagram: InstagramIcon,
};

export function ContactChannels() {
  const { t, tr } = useI18n();
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      /* clipboard indisponivel: o link continua clicavel */
    }
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {socials.map((social, index) => {
        const Icon = ICONS[social.key];
        const isCopied = copied === social.value;

        return (
          <li key={social.key} className="h-full">
            <Reveal delay={index * 0.05} className="h-full">
              <div className="border-line bg-surface shadow-card hover:border-accent/50 group h-full rounded border p-5 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <span className="bg-accent-soft text-accent grid h-11 w-11 place-items-center rounded">
                    <Icon className="h-5 w-5" />
                  </span>
                  <button
                    type="button"
                    onClick={() => copy(social.value)}
                    aria-label={`${t.contact.copy}: ${social.value}`}
                    className="text-muted hover:text-accent inline-flex items-center gap-1 text-xs font-medium transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5" aria-hidden />
                        {t.contact.copied}
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" aria-hidden />
                        {t.contact.copy}
                      </>
                    )}
                  </button>
                </div>

                <h3 className="text-fg mt-4 text-sm font-semibold">{social.label}</h3>
                <a
                  href={social.href}
                  target={social.key === "email" ? undefined : "_blank"}
                  rel="noreferrer noopener"
                  className="text-accent mt-1 inline-flex items-center gap-1 font-mono text-sm break-all hover:underline"
                >
                  {social.value}
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
                </a>
                <p className="text-muted mt-3 text-sm leading-relaxed">{tr(social.description)}</p>
              </div>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}
