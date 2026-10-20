"use client";

import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { ContactChannels } from "@/components/ContactChannels";
import { ContactForm } from "@/components/ContactForm";
import { useI18n } from "@/context/I18nProvider";

export function ContactView() {
  const { t } = useI18n();

  return (
    <Container as="section" className="py-16 sm:py-20">
      <SectionHeading as="h1" title={t.contact.title} subtitle={t.contact.subtitle} />

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h2 className="text-fg text-xs font-semibold tracking-wider uppercase">
            {t.contact.channels}
          </h2>
          <div className="mt-4">
            <ContactChannels />
          </div>
        </div>

        <div className="border-line bg-surface shadow-card rounded border p-6 sm:p-8">
          <h2 className="text-fg text-xl font-semibold tracking-tight">{t.contact.formTitle}</h2>
          <p className="text-muted mt-1 text-sm">{t.contact.formSubtitle}</p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </Container>
  );
}
