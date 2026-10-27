"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Download, Globe, List } from "lucide-react";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { TechBadge } from "./TechBadge";
import { RevLights } from "./RevLights";
import { FlipStat } from "./FlipStat";
import { SpeedLines } from "./SpeedLines";
import { StackGlobe } from "./StackGlobe";
import DecryptedText from "./reactbits/DecryptedText";
import Magnet from "./reactbits/Magnet";
import { useI18n } from "@/context/I18nProvider";
import { profile } from "@/data/profile";
import { skillGroups } from "@/data/skills";
import { asset } from "@/lib/assets";

export function Hero() {
  const { t, tr } = useI18n();

  /* Linhas do painel lateral: so dados reais do perfil, nada inventado. */
  const painel = [
    { rotulo: t.home.panelRole, valor: tr(profile.role) },
    { rotulo: t.home.panelBase, valor: tr(profile.location) },
    { rotulo: t.home.panelEducation, valor: profile.education.institution },
  ];

  return (
    <section className="border-line relative overflow-hidden border-b">
      {/* Fundo: linhas de velocidade saindo do ponto de fuga. */}
      <SpeedLines />

      <Container className="relative py-16 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div>
            {/* Regua de largada: acende na chegada da pagina. */}
            <RevLights />

            <p className="border-line text-muted mt-6 inline-flex items-center gap-2 rounded-sm border px-2.5 py-1 font-mono text-xs tracking-wide uppercase">
              <span className="bg-accent h-1.5 w-1.5 rounded-full" aria-hidden />
              {/* O status decodifica na entrada, como um painel ligando. */}
              <DecryptedText
                text={tr(profile.availability)}
                animateOn="view"
                sequential
                revealDirection="start"
                speed={38}
                maxIterations={12}
                characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
              />
            </p>

            <h1 className="text-fg font-display mt-6 text-5xl font-bold tracking-tight text-balance sm:text-7xl">
              {profile.name}
            </h1>

            <p className="text-muted mt-5 max-w-xl text-base leading-relaxed text-pretty sm:text-lg">
              {tr(profile.headline)}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {/* A chamada principal responde ao cursor, como um botao de painel. */}
              <Magnet padding={70} magnetStrength={6} maxOffset={9}>
                <Link
                  href="/projetos"
                  className="bg-accent text-on-accent hover:bg-accent-2 inline-flex items-center gap-2 rounded px-5 py-2.5 text-sm font-semibold pressable"
                >
                  {t.home.ctaProjects}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Magnet>
              <Link
                href="/contato"
                className="border-line bg-surface text-fg hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded border px-5 py-2.5 text-sm font-semibold pressable"
              >
                {t.home.ctaContact}
              </Link>
              {profile.resume ? (
                <a
                  href={asset(profile.resume)}
                  download
                  className="text-muted hover:text-accent inline-flex items-center gap-2 rounded px-4 py-2.5 text-sm font-semibold pressable"
                >
                  <Download className="h-4 w-4" aria-hidden />
                  {t.home.ctaResume}
                </a>
              ) : null}
            </div>
          </div>

          {/* Painel de identificacao, no formato de placa de box. */}
          <div className="border-line bg-surface shadow-card rounded border">
            <div className="border-line flex items-center gap-4 border-b p-5">
              <div className="border-line bg-surface-2 grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-sm border">
                {profile.avatar ? (
                  <Image
                    src={asset(profile.avatar)}
                    alt={profile.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                    priority
                  />
                ) : (
                  <span className="text-accent font-display text-2xl font-bold">
                    {profile.initials}
                  </span>
                )}
              </div>
              <p className="text-muted font-mono text-xs tracking-wide uppercase">
                {profile.shortName}
              </p>
            </div>

            <dl className="divide-line divide-y">
              {painel.map((linha) => (
                <div key={linha.rotulo} className="px-5 py-3">
                  <dt className="text-muted font-mono text-[10px] tracking-[0.15em] uppercase">
                    {linha.rotulo}
                  </dt>
                  <dd className="text-fg mt-1 text-sm leading-snug">{linha.valor}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Indicadores em tira, separados por fio, sem caixas de card. */}
        {/* Placar: cada indicador sai em celulas avulsas, como placa de estadio. */}
        <dl className="border-line divide-line mt-14 grid border-t border-b sm:grid-cols-3 sm:divide-x">
          {profile.highlights.map((item, index) => (
            <div
              key={item.label.pt}
              className="border-line border-b py-6 last:border-b-0 sm:border-b-0 sm:px-6 sm:first:pl-0"
            >
              <dt>
                <FlipStat value={tr(item.value)} delay={0.25 + index * 0.12} />
              </dt>
              <dd className="text-muted mt-3 font-mono text-[11px] tracking-[0.12em] uppercase">
                {tr(item.label)}
              </dd>
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
      <SectionHeading title={t.home.aboutTitle} subtitle={t.home.aboutSubtitle} />

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          {paragraphs.map((paragraph, index) => (
            <Reveal key={index} delay={index * 0.05}>
              <p className="text-muted text-base leading-relaxed text-pretty">{paragraph}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="h-fit" delay={0.1}>
          <div className="border-line bg-surface shadow-card rounded border p-6">
            <p className="text-fg text-sm font-semibold">{profile.education.institution}</p>
            <p className="text-muted mt-1 text-sm">{tr(profile.education.course)}</p>
            <p className="text-muted tabular mt-1 font-mono text-xs">{profile.education.period}</p>

            <hr className="border-line my-5" />

            <p className="text-muted font-mono text-[10px] tracking-[0.15em] uppercase">
              {t.home.quickLinks}
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/projetos" className="text-muted hover:text-accent pressable">
                  {t.nav.projects}
                </Link>
              </li>
              <li>
                <Link
                  href="/experiencias"
                  className="text-muted hover:text-accent pressable"
                >
                  {t.nav.experiences}
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-muted hover:text-accent pressable">
                  {t.nav.contact}
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
  const [vista, setVista] = useState<"globo" | "lista">("globo");
  const [grupo, setGrupo] = useState<string>("all");

  const total = skillGroups.reduce((soma, g) => soma + g.items.length, 0);
  const gruposVisiveis = grupo === "all" ? skillGroups : skillGroups.filter((g) => g.id === grupo);

  return (
    <Container as="section" id="habilidades" className="py-10">
      <SectionHeading title={t.home.skillsTitle} subtitle={t.home.skillsSubtitle} />

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        {/* Filtro por setor: no globo apaga os outros, na lista esconde. */}
        <div role="group" aria-label={t.home.skillsTitle} className="flex flex-wrap gap-2">
          <ChipSetor ativo={grupo === "all"} onClick={() => setGrupo("all")} contagem={total}>
            {t.stack.all}
          </ChipSetor>
          {skillGroups.map((g) => (
            <ChipSetor
              key={g.id}
              ativo={grupo === g.id}
              onClick={() => setGrupo(g.id)}
              contagem={g.items.length}
            >
              {tr(g.title)}
            </ChipSetor>
          ))}
        </div>

        <div className="border-line bg-surface inline-flex rounded border p-0.5" role="group">
          {(
            [
              { id: "globo", rotulo: t.stack.globe, Icone: Globe },
              { id: "lista", rotulo: t.stack.list, Icone: List },
            ] as const
          ).map(({ id, rotulo, Icone }) => (
            <button
              key={id}
              type="button"
              aria-pressed={vista === id}
              onClick={() => setVista(id)}
              className={`pressable inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-semibold ${
                vista === id ? "bg-accent text-on-accent" : "text-muted hover:text-fg"
              }`}
            >
              <Icone className="h-3.5 w-3.5" aria-hidden />
              {rotulo}
            </button>
          ))}
        </div>
      </div>

      {vista === "globo" ? (
        <div className="mt-6">
          <StackGlobe grupoAtivo={grupo} />
          <p className="text-muted mt-2 text-center font-mono text-[10px] tracking-[0.15em] uppercase">
            {t.stack.hint}
          </p>
        </div>
      ) : (
        /* Setores da stack: fio divisorio no lugar de caixa de card. A coluna sai do
           indice: cada setor fica dentro do proprio Reveal, onde `first:` sempre casa. */
        <div className="border-line mt-6 grid border-t md:grid-cols-2">
          {gruposVisiveis.map((group, index) => (
            <Reveal key={group.id} delay={index * 0.05}>
              <div
                className={`border-line h-full border-b py-6 ${
                  index % 2 === 0 ? "md:pr-6" : "md:border-l md:pl-6"
                }`}
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-accent font-mono text-[11px] tracking-[0.15em] uppercase">
                    {tr(group.title)}
                  </span>
                  <span className="text-muted tabular font-mono text-[11px]">
                    {group.items.length}
                  </span>
                </div>
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
      )}
    </Container>
  );
}

function ChipSetor({
  ativo,
  onClick,
  contagem,
  children,
}: {
  ativo: boolean;
  onClick: () => void;
  contagem: number;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={ativo}
      className={`pressable inline-flex items-center gap-2 rounded border px-3 py-1.5 text-xs font-semibold ${
        ativo
          ? "border-accent bg-accent text-on-accent"
          : "border-line bg-surface text-muted hover:text-fg hover:border-accent"
      }`}
    >
      {children}
      <span className={`tabular font-mono text-[10px] ${ativo ? "opacity-80" : "text-muted"}`}>
        {contagem}
      </span>
    </button>
  );
}
