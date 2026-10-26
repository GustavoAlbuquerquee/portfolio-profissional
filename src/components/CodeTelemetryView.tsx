"use client";

import { useEffect, useMemo, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { GithubIcon } from "./icons";
import { useI18n } from "@/context/I18nProvider";
import type { DiaDeContribuicao, PainelGitHub } from "@/lib/github";
import type { PainelWakaTime } from "@/lib/wakatime";

/* Cores das linguagens, as mesmas que o GitHub usa: sao dado de
   identificacao (como a cor das equipes na F1), nao enfeite. */
const CORES_LINGUAGENS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Java: "#b07219",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Dart: "#00B4AB",
  Swift: "#F05138",
  Go: "#00ADD8",
  Shell: "#89e051",
  PHP: "#4F5D95",
  Kotlin: "#A97BFF",
  "C#": "#178600",
  Vue: "#41b883",
  JSON: "#292929",
  Markdown: "#083fa1",
};
const corDaLinguagem = (nome: string) => CORES_LINGUAGENS[nome] ?? "var(--muted)";

/* Intensidade de cada nivel do mapa de calor, no acento do site. */
const INTENSIDADE = [0, 30, 52, 76, 100];
const corDoNivel = (nivel: number) =>
  nivel === 0
    ? "var(--surface-2)"
    : `color-mix(in oklab, var(--accent) ${INTENSIDADE[nivel]}%, var(--surface-2))`;

export function CodeTelemetryView({
  github,
  wakatime,
}: {
  github: PainelGitHub | null;
  wakatime: PainelWakaTime | null;
}) {
  const { t, locale } = useI18n();
  const c = t.code;

  const dataLonga = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }),
    [locale],
  );
  const mesCurto = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
        month: "short",
        timeZone: "UTC",
      }),
    [locale],
  );
  const formatar = (iso: string) => dataLonga.format(new Date(`${iso}T00:00:00Z`));

  return (
    <Container as="section" id="codigo" className="py-20">
      <SectionHeading title={c.title} subtitle={c.subtitle} />

      {!github ? (
        <p className="border-line text-muted mt-10 rounded border p-6 text-sm">{c.unavailable}</p>
      ) : (
        <div
          className={`mt-10 grid gap-6 ${wakatime ? "lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]" : ""}`}
        >
          <div className="border-line bg-surface min-w-0 overflow-hidden rounded border">
            {/* ── Indicadores ─────────────────────────────────────────── */}
            <dl className="border-line divide-line grid grid-cols-2 divide-x border-b sm:grid-cols-4">
              {[
                { rotulo: c.contributions, valor: String(github.totalNoAno) },
                {
                  rotulo: c.currentStreak,
                  valor: `${github.sequenciaAtual} ${github.sequenciaAtual === 1 ? c.day : c.days}`,
                },
                {
                  rotulo: c.longestStreak,
                  valor: `${github.maiorSequencia} ${github.maiorSequencia === 1 ? c.day : c.days}`,
                },
                {
                  rotulo: c.bestDay,
                  valor: github.melhorDia ? String(github.melhorDia.total) : "-",
                  detalhe: github.melhorDia ? formatar(github.melhorDia.data) : undefined,
                },
              ].map((item, i) => (
                <div
                  key={item.rotulo}
                  className={`border-line px-5 py-4 ${i < 2 ? "border-b sm:border-b-0" : ""}`}
                >
                  <dt className="text-muted font-mono text-[10px] tracking-[0.12em] uppercase">
                    {item.rotulo}
                  </dt>
                  <dd className="text-fg font-display tabular mt-1 text-2xl font-bold tracking-tight">
                    {item.valor}
                  </dd>
                  {item.detalhe ? (
                    <dd className="text-muted tabular mt-0.5 font-mono text-[10px]">{item.detalhe}</dd>
                  ) : null}
                </div>
              ))}
            </dl>

            {/* ── Calendario ───────────────────────────────────────────── */}
            <div className="px-5 pt-5 pb-4">
              <Calendario
                dias={github.dias}
                rotulo={`${github.totalNoAno} ${c.contributions}`}
                tituloDaCelula={(dia) => c.cellTitle(dia.total, formatar(dia.data))}
                mesCurto={(iso) => mesCurto.format(new Date(`${iso}T00:00:00Z`))}
              />

              <div className="text-muted mt-3 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px]">
                <span className="tabular">
                  {[
                    [github.repositorios, c.repos],
                    [github.estrelas, c.stars],
                    [github.seguidores, c.followers],
                  ]
                    .filter(([n]) => Number(n) > 0)
                    .map(([n, rotulo]) => `${n} ${rotulo}`)
                    .join(" · ")}
                </span>
                <span className="flex items-center gap-1.5" aria-hidden>
                  {c.less}
                  {[0, 1, 2, 3, 4].map((n) => (
                    <span
                      key={n}
                      className="h-[10px] w-[10px] rounded-[2px]"
                      style={{ background: corDoNivel(n) }}
                    />
                  ))}
                  {c.more}
                </span>
              </div>
            </div>

            {/* ── Linguagens dos repositorios ──────────────────────────── */}
            {github.linguagens.length ? (
              <div className="border-line border-t px-5 py-4">
                <p className="text-muted font-mono text-[10px] tracking-[0.12em] uppercase">
                  {c.languages}
                </p>
                <div
                  className="bg-surface-2 mt-3 flex h-2 overflow-hidden rounded-sm"
                  aria-hidden
                >
                  {github.linguagens.map((l) => (
                    <span
                      key={l.nome}
                      style={{ width: `${l.percentual}%`, background: corDaLinguagem(l.nome) }}
                    />
                  ))}
                </div>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                  {github.linguagens.map((l) => (
                    <li key={l.nome} className="text-fg flex items-center gap-1.5 text-xs">
                      <span
                        aria-hidden
                        className="h-2 w-2 rounded-[2px]"
                        style={{ background: corDaLinguagem(l.nome) }}
                      />
                      {l.nome}
                      <span className="text-muted tabular font-mono text-[10px]">
                        {Math.round(l.percentual)}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="border-line flex items-center justify-between gap-3 border-t px-5 py-3">
              <p className="text-muted font-mono text-[10px]">{c.source}</p>
              <a
                href={github.url}
                target="_blank"
                rel="noreferrer noopener"
                className="text-fg hover:text-accent inline-flex items-center gap-1.5 text-xs font-semibold pressable"
              >
                <GithubIcon className="h-3.5 w-3.5" />
                {c.profile}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
            </div>
          </div>

          {/* ── WakaTime (so aparece se a chave estiver configurada) ───── */}
          {wakatime ? (
            <div className="border-line bg-surface h-fit rounded border">
              <header className="border-line border-b px-5 py-4">
                <p className="text-accent font-mono text-[10px] tracking-[0.15em] uppercase">
                  WakaTime
                </p>
                <h3 className="text-fg font-display mt-1 text-lg font-bold tracking-tight">
                  {c.wakaTitle}
                </h3>
              </header>
              <dl className="border-line divide-line grid grid-cols-2 divide-x border-b">
                <div className="px-5 py-4">
                  <dt className="text-muted font-mono text-[10px] tracking-[0.12em] uppercase">
                    {c.wakaTotal}
                  </dt>
                  <dd className="text-fg font-display tabular mt-1 text-xl font-bold">
                    {wakatime.totalTexto}
                  </dd>
                </div>
                <div className="px-5 py-4">
                  <dt className="text-muted font-mono text-[10px] tracking-[0.12em] uppercase">
                    {c.wakaDaily}
                  </dt>
                  <dd className="text-fg font-display tabular mt-1 text-xl font-bold">
                    {wakatime.mediaDiariaTexto}
                  </dd>
                </div>
              </dl>
              <ul className="divide-line divide-y">
                {wakatime.linguagens.map((l) => (
                  <li key={l.nome} className="px-5 py-2.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-fg text-sm">{l.nome}</span>
                      <span className="text-muted tabular font-mono text-[11px]">{l.texto}</span>
                    </div>
                    <span aria-hidden className="bg-surface-2 mt-1.5 block h-1 overflow-hidden rounded-sm">
                      <span
                        className="block h-full"
                        style={{ width: `${l.percentual}%`, background: corDaLinguagem(l.nome) }}
                      />
                    </span>
                  </li>
                ))}
              </ul>
              {wakatime.editores.length ? (
                <p className="border-line text-muted border-t px-5 py-3 font-mono text-[10px]">
                  {wakatime.editores.join(" · ")}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      )}
    </Container>
  );
}

function Calendario({
  dias,
  rotulo,
  tituloDaCelula,
  mesCurto,
}: {
  dias: DiaDeContribuicao[];
  rotulo: string;
  tituloDaCelula: (dia: DiaDeContribuicao) => string;
  mesCurto: (iso: string) => string;
}) {
  const rolagemRef = useRef<HTMLDivElement>(null);

  /* Semanas em colunas, domingo no topo, como no GitHub. O primeiro dia
     pode cair no meio da semana: completa a coluna com casas vazias. */
  const semanas = useMemo(() => {
    if (!dias.length) return [];
    const vazio = new Date(`${dias[0].data}T00:00:00Z`).getUTCDay();
    const casas: (DiaDeContribuicao | null)[] = [...Array(vazio).fill(null), ...dias];
    const colunas: (DiaDeContribuicao | null)[][] = [];
    for (let i = 0; i < casas.length; i += 7) colunas.push(casas.slice(i, i + 7));
    return colunas;
  }, [dias]);

  /* Rotulo do mes so na coluna em que o mes vira, com folga entre rotulos. */
  const rotulosDeMes = useMemo(() => {
    let ultimoMes = -1;
    let ultimaColuna = -10;
    return semanas.map((semana, i) => {
      const primeiro = semana.find(Boolean);
      if (!primeiro) return "";
      const mes = new Date(`${primeiro.data}T00:00:00Z`).getUTCMonth();
      if (mes !== ultimoMes && i - ultimaColuna >= 3) {
        ultimoMes = mes;
        ultimaColuna = i;
        return mesCurto(primeiro.data).replace(".", "");
      }
      ultimoMes = mes;
      return "";
    });
  }, [semanas, mesCurto]);

  /* No celular a grade e mais larga que a tela: abre nas semanas recentes. */
  useEffect(() => {
    const el = rolagemRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [semanas]);

  return (
    <div
      ref={rolagemRef}
      className="overflow-x-auto overscroll-x-contain pb-1"
      role="img"
      aria-label={rotulo}
    >
      <div className="w-max" aria-hidden>
        <div className="text-muted mb-1.5 grid grid-flow-col auto-cols-[11px] gap-[3px] font-mono text-[9px] leading-none lg:auto-cols-[14px]">
          {rotulosDeMes.map((r, i) => (
            <span key={i} className="whitespace-nowrap">
              {r}
            </span>
          ))}
        </div>
        <div className="grid grid-flow-col grid-rows-7 auto-cols-[11px] gap-[3px] lg:auto-cols-[14px]">
          {semanas.flatMap((semana, w) =>
            Array.from({ length: 7 }, (_, d) => {
              const dia = semana[d];
              return (
                <span
                  key={`${w}-${d}`}
                  className="h-[11px] w-[11px] rounded-[2px] lg:h-[14px] lg:w-[14px]"
                  style={{ background: dia ? corDoNivel(dia.nivel) : "transparent" }}
                  title={dia ? tituloDaCelula(dia) : undefined}
                />
              );
            }),
          )}
        </div>
      </div>
    </div>
  );
}
