"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Download, MapPin, Sparkles } from "lucide-react";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { TechBadge } from "./TechBadge";
import { useI18n } from "@/context/I18nProvider";
import { profile } from "@/data/profile";
import { skillGroups } from "@/data/skills";
import { asset } from "@/lib/assets";

export function Hero() {
  const { t, tr } = useI18n();

  return (
    <section className="bg-grid border-line relative overflow-hidden border-b">
      <Container className="py-20 sm:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="border-line bg-surface/70 text-muted inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="text-accent h-3.5 w-3.5" aria-hidden />
              {tr(profile.availability)}
            </p>

            <h1 className="text-fg mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              <span className="text-muted block text-lg font-normal sm:text-xl">
                {t.home.greeting}
              </span>
              {profile.name}
            </h1>

            <p className="text-accent mt-3 font-mono text-sm font-medium sm:text-base">
              {tr(profile.role)}
            </p>

            <p className="text-muted mt-6 max-w-xl text-base leading-relaxed text-pretty sm:text-lg">
              {tr(profile.headline)}
            </p>

            <p className="text-muted mt-4 inline-flex items-center gap-1.5 text-sm">
              <MapPin className="h-4 w-4" aria-hidden />
              {tr(profile.location)}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/projetos"
                className="bg-accent hover:bg-accent-2 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                {t.home.ctaProjects}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/contato"
                className="border-line bg-surface text-fg hover:border-accent/60 hover:text-accent inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                {t.home.ctaContact}
              </Link>
              {profile.resume ? (
                <a
                  href={asset(profile.resume)}
                  download
                  className="text-muted hover:text-accent inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors"
                >
                  <Download className="h-4 w-4" aria-hidden />
                  {t.home.ctaResume}
                </a>
              ) : null}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="from-accent to-accent-2 absolute -inset-3 rounded-3xl bg-gradient-to-br opacity-20 blur-2xl" />
              <div className="border-line bg-surface shadow-card relative grid h-56 w-56 place-items-center overflow-hidden rounded-3xl border sm:h-64 sm:w-64">
                {profile.avatar ? (
                  <Image
                    src={asset(profile.avatar)}
                    alt={profile.name}
                    width={256}
                    height={256}
                    className="h-full w-full object-cover"
                    priority
                  />
                ) : (
                  <span className="from-accent to-accent-2 bg-gradient-to-br bg-clip-text font-mono text-7xl font-bold text-transparent">
                    {profile.initials}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <dl className="border-line mt-16 grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-3">
          {profile.highlights.map((item) => (
            <div key={item.value} className="bg-surface px-6 py-6">
              <dt className="text-fg font-mono text-3xl font-bold tracking-tight">{item.value}</dt>
              <dd className="text-muted mt-1 text-sm">{tr(item.label)}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

export function AboutSection() {
  const { t, tr } = useI18n();
  const paragraphs = tr(profile.bio);

  return (
    <Container as="section" id="sobre" className="py-20">
      <SectionHeading
        eyebrow="01"
        title={t.home.aboutTitle}
        subtitle={t.home.aboutSubtitle}
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          {paragraphs.map((paragraph, index) => (
            <Reveal key={index} delay={index * 0.05}>
              <p className="text-muted text-base leading-relaxed text-pretty">{paragraph}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="h-fit" delay={0.1}>
          <div className="border-line bg-surface shadow-card rounded-2xl border p-6">
            <p className="text-fg text-sm font-semibold">
              {profile.education.institution}
            </p>
            <p className="text-muted mt-1 text-sm">{tr(profile.education.course)}</p>
            <p className="text-muted mt-1 font-mono text-xs">{profile.education.period}</p>

            <hr className="border-line my-5" />

            <p className="text-fg text-xs font-semibold tracking-wider uppercase">
              {t.home.quickLinks}
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/projetos" className="text-muted hover:text-accent transition-colors">
                  → {t.nav.projects}
                </Link>
              </li>
              <li>
                <Link
                  href="/experiencias"
                  className="text-muted hover:text-accent transition-colors"
                >
                  → {t.nav.experiences}
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-muted hover:text-accent transition-colors">
                  → {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>
        </Reveal>
      </div>
    </Container>
  );
}

export function SkillsSection() {
  const { t, tr } = useI18n();

  return (
    <Container as="section" id="habilidades" className="py-10">
      <SectionHeading eyebrow="02" title={t.home.skillsTitle} subtitle={t.home.skillsSubtitle} />

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {skillGroups.map((group, index) => (
          <Reveal key={group.id} delay={index * 0.06}>
            <div className="border-line bg-surface shadow-card h-full rounded-2xl border p-6">
              <h3 className="text-fg text-sm font-semibold">{tr(group.title)}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item}>
                    <TechBadge>{item}</TechBadge>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}
