"use client";

import { Flag, Timer } from "lucide-react";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { useI18n } from "@/context/I18nProvider";
import type { F1Painel, F1Resultado } from "@/lib/f1";

/* Cor de cada equipe, para a faixa lateral da torre (o mesmo recurso das
   transmissoes oficiais). Valores aproximados das pinturas de 2026; e dado
   de identificacao, nao enfeite, por isso nao entra na paleta da pagina. */
const CORES_EQUIPES: Record<string, string> = {
  mercedes: "#27F4D2",
  ferrari: "#E8002D",
  red_bull: "#3671C6",
  mclaren: "#FF8000",
  rb: "#6692FF",
  alpine: "#0093CC",
  audi: "#BB0A30",
  haas: "#B6BABD",
  aston_martin: "#229971",
  williams: "#64C4FF",
  cadillac: "#C8A85A",
};

const corDaEquipe = (id: string) => CORES_EQUIPES[id] ?? "var(--muted)";

export function PitWallView({ painel }: { painel: F1Painel | null }) {
  const { t, locale } = useI18n();
  const p = t.pitwall;

  const formatarData = (iso: string) =>
    new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(`${iso}T00:00:00Z`));

  const tempoOuDiferenca = (r: F1Resultado) => {
    if (r.abandonou) return p.retired;
    if (r.voltasAtras > 0) return `+${r.voltasAtras} ${r.voltasAtras === 1 ? p.lap : p.laps}`;
    return r.tempo ?? "-";
  };

  return (
    <Container as="section" id="box" className="py-20">
      <SectionHeading title={p.title} subtitle={p.subtitle} />

      {!painel ? (
        <p className="border-line text-muted mt-10 rounded border p-6 text-sm">{p.unavailable}</p>
      ) : (
        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
          {/* ── Torre de tempos da ultima corrida ─────────────────────── */}
          <div className="border-line bg-surface overflow-hidden rounded border">
            <header className="border-line flex items-start justify-between gap-4 border-b px-5 py-4">
              <div className="min-w-0">
                <p className="text-accent font-mono text-[10px] tracking-[0.15em] uppercase">
                  {p.lastRace} · {p.round} {painel.corrida.rodada}
                </p>
                <h3 className="text-fg font-display mt-1 text-xl font-bold tracking-tight">
                  {painel.corrida.nome}
                </h3>
                <p className="text-muted mt-1 text-xs">
                  {painel.corrida.circuito} · {painel.corrida.local} ·{" "}
                  <time dateTime={painel.corrida.data} className="tabular">
                    {formatarData(painel.corrida.data)}
                  </time>
                </p>
              </div>
              <Flag className="text-muted mt-1 h-5 w-5 shrink-0" aria-hidden />
            </header>

            <div
              aria-hidden
              className="text-muted grid grid-cols-[2.25rem_3px_minmax(0,1fr)_auto_2.5rem] gap-x-3 px-5 pt-3 pb-1 font-mono text-[10px] tracking-[0.12em] uppercase"
            >
              <span>{p.pos}</span>
              <span />
              <span>{p.driver}</span>
              <span className="text-right">{p.gap}</span>
              <span className="text-right">{p.points}</span>
            </div>

            <ol className="divide-line divide-y">
              {painel.resultados.map((r, i) => {
                const ganho = r.largada > 0 ? r.largada - r.posicao : 0;
                return (
                  <li key={r.codigo}>
                    <Reveal delay={Math.min(i * 0.04, 0.32)}>
                      <div className="grid grid-cols-[2.25rem_3px_minmax(0,1fr)_auto_2.5rem] items-center gap-x-3 px-5 py-2.5">
                        <span className="text-fg font-display tabular text-lg leading-none font-bold">
                          {r.posicao}
                        </span>
                        <span
                          aria-hidden
                          className="h-6 w-[3px] rounded-full"
                          style={{ background: corDaEquipe(r.equipeId) }}
                        />
                        <span className="min-w-0">
                          <span className="flex items-baseline gap-2">
                            <span className="text-fg font-mono text-sm font-bold">{r.codigo}</span>
                            <span className="text-muted hidden truncate text-xs sm:inline">
                              {r.piloto}
                            </span>
                            {ganho !== 0 ? (
                              <span
                                className="text-muted tabular font-mono text-[10px]"
                                title={`${p.grid}: P${r.largada}`}
                              >
                                {ganho > 0 ? `▲${ganho}` : `▼${-ganho}`}
                              </span>
                            ) : null}
                          </span>
                          <span className="text-muted block truncate text-[11px]">{r.equipe}</span>
                        </span>
                        <span className="text-fg tabular flex items-center justify-end gap-1.5 font-mono text-xs">
                          {r.voltaMaisRapida ? (
                            <Timer
                              className="text-accent h-3.5 w-3.5"
                              aria-label={p.fastestLap}
                            />
                          ) : null}
                          {tempoOuDiferenca(r)}
                        </span>
                        <span className="text-muted tabular text-right font-mono text-xs">
                          {r.pontos}
                        </span>
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ol>

            <p className="border-line text-muted border-t px-5 py-3 font-mono text-[10px]">
              {p.source}
            </p>
          </div>

          {/* ── Campeonato de pilotos ─────────────────────────────────── */}
          <div className="border-line bg-surface h-fit overflow-hidden rounded border">
            <header className="border-line border-b px-5 py-4">
              <p className="text-accent font-mono text-[10px] tracking-[0.15em] uppercase">
                {painel.corrida.temporada}
              </p>
              <h3 className="text-fg font-display mt-1 text-lg font-bold tracking-tight">
                {p.standings}
              </h3>
            </header>

            <ol className="divide-line divide-y">
              {painel.classificacao.map((c) => {
                const lider = painel.classificacao[0]?.pontos || 1;
                return (
                  <li key={c.piloto} className="px-5 py-3">
                    <div className="flex items-baseline gap-3">
                      <span className="text-fg font-display tabular w-5 text-base font-bold">
                        {c.posicao}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="text-fg block truncate text-sm font-semibold">
                          {c.piloto}
                        </span>
                        <span className="text-muted block truncate text-[11px]">
                          {c.equipe} · {c.vitorias} {p.wins}
                        </span>
                      </span>
                      <span className="text-fg tabular font-mono text-sm font-bold">
                        {c.pontos}
                      </span>
                    </div>
                    {/* Pontos em relacao ao lider: o mesmo tipo de barra da torre de projetos. */}
                    <span aria-hidden className="bg-surface-2 mt-2 block h-1 overflow-hidden rounded-sm">
                      <span
                        className="block h-full"
                        style={{
                          width: `${(c.pontos / lider) * 100}%`,
                          background: corDaEquipe(c.equipeId),
                        }}
                      />
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      )}
    </Container>
  );
}
