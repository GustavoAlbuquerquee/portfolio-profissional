"use client";

import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { ExperienceList } from "@/components/ExperienceList";
import { useI18n } from "@/context/I18nProvider";

export function ExperiencesView() {
  const { t } = useI18n();

  return (
    <Container as="section" className="py-16 sm:py-20">
      <SectionHeading
        as="h1"
        title={t.experiences.title}
        subtitle={t.experiences.subtitle}
      />
      <ExperienceList />
    </Container>
  );
}
