"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowDownUp, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "./icons";
import { TechBadge } from "./TechBadge";
import { Reveal } from "./Reveal";
import { useI18n } from "@/context/I18nProvider";
import { projects, sortProjects, type ProjectCategory } from "@/data/projects";
import { classNames, formatRange } from "@/lib/format";
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

  return (
    <div className="mt-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
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
          className="border-line bg-surface text-muted hover:text-accent hover:border-accent/50 inline-flex items-center gap-2 rounded border px-3 py-2 text-xs font-semibold transition-colors"
        >
          <ArrowDownUp className="h-3.5 w-3.5" aria-hidden />
          {order === "asc" ? t.projects.orderOldest : t.projects.orderNewest}
        </button>
      </div>

      {visible.length === 0 ? (
        <p className="text-muted py-10 text-center text-sm">{t.projects.empty}</p>
      ) : (
        <ol className="relative space-y-10 sm:space-y-12">
          {/* Linha vertical da timeline */}
          <span
            aria-hidden
            className="bg-line absolute top-2 bottom-2 left-[11px] hidden w-px sm:block"
          />

          {visible.map((project, index) => (
            <li key={project.id} className="relative sm:pl-12">
              <span
                aria-hidden
                className="border-bg bg-accent absolute top-2 left-0 hidden h-6 w-6 rounded-full border-4 sm:block"
              />
              <Reveal delay={Math.min(index * 0.05, 0.2)}>
                <article className="border-line bg-surface shadow-card overflow-hidden rounded border">
                  <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
                    <div className="bg-surface-2 border-line relative aspect-16/10 border-b md:border-r md:border-b-0">
                      <Image
                        src={asset(project.image)}
                        alt={t.projects.screenshotAlt(project.name)}
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className="object-cover"
                      />
                    </div>

                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <time className="text-accent font-mono text-xs font-semibold">
                          {formatRange(project.startDate, project.endDate, locale)}
                        </time>
                        <span className="text-muted text-xs">·</span>
                        <span className="text-muted text-xs">
                          {CATEGORY_LABELS[project.category][locale]}
                        </span>
                      </div>

                      <h3 className="text-fg mt-2 text-xl font-semibold tracking-tight">
                        {project.name}
                      </h3>

                      <p className="text-muted mt-2 text-sm leading-relaxed text-pretty">
                        {tr(project.description)}
                      </p>

                      <ul className="text-muted mt-4 space-y-1.5 text-sm">
                        {tr(project.highlights).map((highlight) => (
                          <li key={highlight} className="flex gap-2">
                            <span className="text-accent mt-[7px] h-1 w-1 shrink-0 rounded-full bg-current" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-5">
                        <p className="text-fg text-xs font-semibold tracking-wider uppercase">
                          {t.projects.techs}
                        </p>
                        <ul className="mt-2 flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <li key={tech}>
                              <TechBadge>{tech}</TechBadge>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        {project.repository ? (
                          <a
                            href={project.repository}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="border-line bg-surface-2 text-fg hover:border-accent/60 hover:text-accent inline-flex items-center gap-2 rounded border px-3.5 py-2 text-xs font-semibold transition-colors"
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
                            className="bg-accent hover:bg-accent-2 inline-flex items-center gap-2 rounded px-3.5 py-2 text-xs font-semibold text-on-accent transition-colors"
                          >
                            {t.projects.liveDemo}
                            <ArrowUpRight className="h-4 w-4" aria-hidden />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
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
        "rounded border px-3 py-2 text-xs font-semibold transition-colors",
        active
          ? "border-accent bg-accent text-on-accent"
          : "border-line bg-surface text-muted hover:text-fg hover:border-accent/40",
      )}
    >
      {children}
    </button>
  );
}
