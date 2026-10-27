"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowDownUp, ArrowUpRight, Trophy } from "lucide-react";
import { GithubIcon } from "./icons";
import { TechBadge } from "./TechBadge";
import { Reveal } from "./Reveal";
import PixelTransition from "./reactbits/PixelTransition";
import { useI18n } from "@/context/I18nProvider";
import { projects, sortProjects, type ProjectCategory } from "@/data/projects";
import { classNames, formatDuration, formatRange, monthSpan } from "@/lib/format";
import { asset } from "@/lib/assets";

const CATEGORY_LABELS: Record<ProjectCategory, { pt: string; en: string }> = {
  web: { pt: "Web", en: "Web" },
  api: { pt: "API / Back-end", en: "API / Back-end" },
  mobile: { pt: "Mobile", en: "Mobile" },
  academic: { pt: "Acadêmico", en: "Academic" },
};

export function ProjectTimeline() {
  const { t, tr, locale } = useI18n();
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [category, setCategory] = useState<ProjectCategory | "all">("all");

  const categories = useMemo(
    () => Array.from(new Set(projects.map((project) => project.category))),
    [],
  );

  const visible = useMemo(() => {
    const filtered =
      category === "all" ? projects : projects.filter((item) => item.category === category);
    return sortProjects(filtered, order);
  }, [category, order]);

  /* Barra de duracao de cada projeto, proporcional ao mais longo da lista. */
  const maiorDuracao = useMemo(
    () => Math.max(...visible.map((p) => monthSpan(p.startDate, p.endDate)), 1),
    [visible],
  );

  return (
    <div className="mt-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label={t.projects.filterAll} className="flex flex-wrap gap-2">
          <FilterButton active={category === "all"} onClick={() => setCategory("all")}>
            {t.projects.filterAll}
          </FilterButton>
          {categories.map((item) => (
            <FilterButton
              key={item}
              active={category === item}
              onClick={() => setCategory(item)}
            >
              {CATEGORY_LABELS[item][locale]}
            </FilterButton>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOrder((value) => (value === "asc" ? "desc" : "asc"))}
          className="border-line bg-surface text-muted hover:text-accent hover:border-accent inline-flex items-center gap-2 rounded border px-3 py-2 text-xs font-semibold pressable"
        >
          <ArrowDownUp className="h-3.5 w-3.5" aria-hidden />
          {order === "asc" ? t.projects.orderOldest : t.projects.orderNewest}
        </button>
      </div>

      {visible.length === 0 ? (
        <p className="text-muted py-10 text-center text-sm">{t.projects.empty}</p>
      ) : (
        <>
          {/* Cabecalho da torre de tempos, como no painel de cronometragem. */}
          <div
            aria-hidden
            className="border-line text-muted hidden grid-cols-[64px_minmax(0,1fr)_132px_132px] gap-4 border-y py-2 font-mono text-[10px] tracking-[0.15em] uppercase lg:grid"
          >
            <span>{t.projects.order}</span>
            <span>{t.nav.projects}</span>
            <span>{t.experiences.period}</span>
            <span>{t.projects.duration}</span>
          </div>

          <ol className="border-line divide-line divide-y border-b">
            {visible.map((project, index) => {
              const meses = monthSpan(project.startDate, project.endDate);
              const emCurso = project.endDate === null;

              return (
                <li key={project.id}>
                  <Reveal delay={Math.min(index * 0.05, 0.2)}>
                    <article className="grid gap-4 py-7 lg:grid-cols-[64px_minmax(0,1fr)_132px_132px]">
                      {/* Trilho de dados: ordem na lista. */}
                      <p className="text-accent font-display tabular text-3xl leading-none font-bold lg:text-4xl">
                        {String(index + 1).padStart(2, "0")}
                      </p>

                      <div className="min-w-0 lg:order-2">
                        <h3 className="text-fg font-display text-xl font-bold tracking-tight">
                          {project.name}
                        </h3>
                        <p className="text-muted mt-0.5 font-mono text-[11px] tracking-wide uppercase">
                          {CATEGORY_LABELS[project.category][locale]}
                        </p>

                        {/* Selo de podio: reconhecimento oficial do projeto. */}
                        {project.award ? (
                          <p className="border-accent bg-accent-soft mt-3 inline-flex max-w-full items-start gap-2.5 rounded-sm border px-3 py-2">
                            <Trophy className="text-accent mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                            <span className="min-w-0">
                              <span className="text-fg block text-xs font-semibold">
                                {tr(project.award.title)}
                              </span>
                              <span className="text-muted block font-mono text-[11px] leading-snug">
                                {tr(project.award.detail)}
                              </span>
                            </span>
                          </p>
                        ) : null}

                        <div className="mt-5 space-y-6">
                          {/* A captura se desfaz em pixels e revela a stack do projeto. */}
                          <PixelTransition
                            className="border-line bg-surface-2 w-full overflow-hidden rounded-sm border"
                            aspectRatio="62.5%"
                            gridSize={16}
                            pixelColor="var(--accent)"
                            animationStepDuration={0.4}
                            trigger="hover"
                            firstContent={
                              <Image
                                src={asset(project.image)}
                                alt={t.projects.screenshotAlt(project.name)}
                                fill
                                sizes="(max-width: 768px) 100vw, 32vw"
                                className="object-cover"
                              />
                            }
                            secondContent={
                              <div className="bg-surface-2 flex h-full w-full flex-col justify-center gap-2 p-5">
                                <p className="text-muted font-mono text-[10px] tracking-[0.15em] uppercase">
                                  {t.projects.techs}
                                </p>
                                <ul className="flex flex-wrap gap-1.5">
                                  {project.technologies.map((tech) => (
                                    <li
                                      key={tech}
                                      className="border-line text-fg rounded-sm border px-2 py-1 font-mono text-[11px]"
                                    >
                                      {tech}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            }
                          />

                          <div>
                            {/* Texto limitado em largura: linha longa demais cansa a leitura. */}
                            <p className="text-muted max-w-[72ch] text-sm leading-relaxed text-pretty">
                              {tr(project.description)}
                            </p>

                            <ul className="text-muted mt-4 max-w-[72ch] space-y-1.5 text-sm">
                              {tr(project.highlights).map((highlight) => (
                                <li key={highlight} className="flex gap-2.5">
                                  <span className="bg-accent mt-[9px] h-px w-2.5 shrink-0" />
                                  <span>{highlight}</span>
                                </li>
                              ))}
                            </ul>

                            <ul className="mt-5 flex flex-wrap gap-2">
                              {project.technologies.map((tech) => (
                                <li key={tech}>
                                  <TechBadge>{tech}</TechBadge>
                                </li>
                              ))}
                            </ul>

                            <div className="mt-5 flex flex-wrap gap-3">
                              {project.repository ? (
                                <a
                                  href={project.repository}
                                  target="_blank"
                                  rel="noreferrer noopener"
                                  className="border-line bg-surface-2 text-fg hover:border-accent hover:text-accent inline-flex items-center gap-2 rounded border px-3.5 py-2 text-xs font-semibold pressable"
                                >
                                  <GithubIcon className="h-4 w-4" />
                                  {t.projects.repository}
                                </a>
                              ) : null}
                              {project.demo ? (
                                <a
                                  href={project.demo}
                                  target="_blank"
                                  rel="noreferrer noopener"
                                  className="bg-accent text-on-accent hover:bg-accent-2 inline-flex items-center gap-2 rounded px-3.5 py-2 text-xs font-semibold pressable"
                                >
                                  {t.projects.liveDemo}
                                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                                </a>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Periodo cronometrado. */}
                      <time className="text-fg tabular font-mono text-xs lg:order-3">
                        {formatRange(project.startDate, project.endDate, locale)}
                      </time>

                      {/* Duracao, com barra proporcional ao projeto mais longo. */}
                      <div className="lg:order-4">
                        <p className="text-fg tabular font-mono text-xs">
                          {formatDuration(meses, locale)}
                        </p>
                        <span
                          aria-hidden
                          className="bg-surface-2 mt-2 block h-1.5 w-full max-w-[120px] overflow-hidden rounded-sm"
                        >
                          <span
                            className={classNames(
                              "block h-full",
                              emCurso ? "pit-stripe" : "bg-accent",
                            )}
                            style={{ width: `${(meses / maiorDuracao) * 100}%` }}
                          />
                        </span>
                      </div>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={classNames(
        "rounded border px-3 py-2 text-xs font-semibold pressable",
        active
          ? "border-accent bg-accent text-on-accent"
          : "border-line bg-surface text-muted hover:text-fg hover:border-accent",
      )}
    >
      {children}
    </button>
  );
}
