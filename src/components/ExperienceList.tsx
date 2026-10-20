"use client";

import { useMemo, useState } from "react";
import {
  Briefcase,
  Calendar,
  GraduationCap,
  Code,
  MapPin,
  Rocket,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { TechBadge } from "./TechBadge";
import { Reveal } from "./Reveal";
import { useI18n } from "@/context/I18nProvider";
import { experiences, sortExperiences, type ExperienceType } from "@/data/experiences";
import { classNames, formatRange } from "@/lib/format";

const TYPE_ICONS: Record<ExperienceType, React.ComponentType<{ className?: string }>> = {
  job: Briefcase,
  internship: Rocket,
  freelance: Code,
  opensource: Users,
  event: Calendar,
  academic: GraduationCap,
};

export function ExperienceList() {
  const { t, tr, locale } = useI18n();
  const [type, setType] = useState<ExperienceType | "all">("all");

  const types = useMemo(
    () => Array.from(new Set(experiences.map((item) => item.type))),
    [],
  );

  const visible = useMemo(() => {
    const filtered = type === "all" ? experiences : experiences.filter((e) => e.type === type);
    return sortExperiences(filtered);
  }, [type]);

  return (
    <div className="mt-10">
      <div
        role="group"
        aria-label={t.experiences.filterAll}
        className="mb-8 flex flex-wrap gap-2"
      >
        <FilterButton active={type === "all"} onClick={() => setType("all")}>
          {t.experiences.filterAll}
        </FilterButton>
        {types.map((item) => (
          <FilterButton key={item} active={type === item} onClick={() => setType(item)}>
            {t.experiences.types[item]}
          </FilterButton>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-muted py-10 text-center text-sm">{t.experiences.empty}</p>
      ) : (
        <ol className="space-y-5">
          {visible.map((experience, index) => {
            const Icon = TYPE_ICONS[experience.type];
            const ongoing = experience.end === null;

            return (
              <li key={experience.id}>
                <Reveal delay={Math.min(index * 0.05, 0.2)}>
                  <article className="border-line bg-surface shadow-card rounded border p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex min-w-0 gap-4">
                        <span className="bg-accent-soft text-accent grid h-11 w-11 shrink-0 place-items-center rounded">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-fg text-lg font-semibold tracking-tight">
                            {tr(experience.role)}
                          </h3>
                          <p className="text-accent mt-0.5 text-sm font-medium">
                            {experience.url ? (
                              <a
                                href={experience.url}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="inline-flex items-center gap-1 hover:underline"
                              >
                                {experience.organization}
                                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                              </a>
                            ) : (
                              experience.organization
                            )}
                          </p>
                          <p className="text-muted mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                            <span className="inline-flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" aria-hidden />
                              {formatRange(experience.start, experience.end, locale)}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5" aria-hidden />
                              {tr(experience.location)}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        {ongoing ? (
                          <span className="bg-accent-soft text-accent inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-xs font-semibold">
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {t.experiences.current}
                          </span>
                        ) : null}
                        <span className="border-line text-muted rounded-sm border px-2.5 py-1 text-xs font-medium">
                          {t.experiences.types[experience.type]}
                        </span>
                      </div>
                    </div>

                    <p className="text-muted mt-5 text-sm leading-relaxed text-pretty">
                      {tr(experience.description)}
                    </p>

                    <ul className="text-muted mt-4 space-y-1.5 text-sm">
                      {tr(experience.achievements).map((achievement) => (
                        <li key={achievement} className="flex gap-2">
                          <span className="text-accent mt-[7px] h-1 w-1 shrink-0 rounded-full bg-current" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>

                    {experience.technologies?.length ? (
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {experience.technologies.map((tech) => (
                          <li key={tech}>
                            <TechBadge>{tech}</TechBadge>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </article>
                </Reveal>
              </li>
            );
          })}
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
