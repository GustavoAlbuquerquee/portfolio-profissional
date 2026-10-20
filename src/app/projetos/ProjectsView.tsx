"use client";

import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { ProjectTimeline } from "@/components/ProjectTimeline";
import { useI18n } from "@/context/I18nProvider";

export function ProjectsView() {
  const { t } = useI18n();

  return (
    <Container as="section" className="py-16 sm:py-20">
      <SectionHeading as="h1" eyebrow="03" title={t.projects.title} subtitle={t.projects.subtitle} />
      <ProjectTimeline />
    </Container>
  );
}
