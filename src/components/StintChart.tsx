"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useI18n } from "@/context/I18nProvider";
import { experiences } from "@/data/experiences";
import {
  classNames,
  currentMonth,
  formatDuration,
  formatMonth,
  monthIndex,
  monthSpan,
} from "@/lib/format";

/**
 * Grafico de stints: cada passagem por uma empresa vira uma barra sobre um
 * eixo de tempo comum, como o mapa de pneus de uma prova. Mostra de relance
 * a sequencia e a sobreposicao entre as experiencias, que a lista de cards
 * nao consegue mostrar. Todos os valores saem de `src/data/experiences.ts`.
 */
export function StintChart() {
  const { t, locale } = useI18n();
  const reduceMotion = useReducedMotion();
  const rotuloAtual = t.experiences.current;

  const { linhas, anos } = useMemo(() => {
    const agora = currentMonth();

    const ordenadas = [...experiences].sort((a, b) => a.start.localeCompare(b.start));
    const primeiro = monthIndex(ordenadas[0].start);
    const ultimo = Math.max(
      ...ordenadas.map((e) => monthIndex(e.end ?? agora)),
      monthIndex(agora),
    );

    /* Arredonda para janeiro antes e janeiro depois, para os ticks caírem em anos cheios. */
    const anoInicial = Math.floor(primeiro / 12);
    const anoFinal = Math.floor(ultimo / 12) + 1;
    const inicio = anoInicial * 12;
    const total = (anoFinal - anoInicial) * 12 + 1;

    const anos = Array.from({ length: anoFinal - anoInicial + 1 }, (_, i) => ({
      rotulo: String(anoInicial + i),
      posicao: ((i * 12) / total) * 100,
    }));

    const linhas = ordenadas.map((e) => {
      const de = monthIndex(e.start) - inicio;
      const meses = monthSpan(e.start, e.end);
      return {
        id: e.id,
        organizacao: e.organization,
        emCurso: e.end === null,
        meses,
        esquerda: (de / total) * 100,
        largura: (meses / total) * 100,
        intervalo: `${formatMonth(e.start, locale)} ${String.fromCharCode(8594)} ${
          e.end ? formatMonth(e.end, locale) : rotuloAtual.toLowerCase()
        }`,
      };
    });

    return { linhas, anos };
  }, [locale, rotuloAtual]);

  return (
    <section className="border-line bg-surface mt-10 rounded border p-5 sm:p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-muted font-mono text-[11px] tracking-[0.15em] uppercase">
          {t.experiences.stintTitle}
        </h3>
        <p className="text-muted tabular font-mono text-[11px]">
          {linhas.length} {t.experiences.stintUnit}
        </p>
      </div>

      {/* Eixo de anos. */}
      <div className="relative mt-5 h-4" aria-hidden>
        {anos.map((ano) => (
          <span
            key={ano.rotulo}
            className="text-muted tabular absolute top-0 -translate-x-1/2 font-mono text-[10px]"
            style={{ left: `${ano.posicao}%` }}
          >
            {ano.rotulo}
          </span>
        ))}
      </div>

      <ol className="relative mt-1 space-y-2">
        {/* Linhas verticais de ano, atras das barras. */}
        <span className="pointer-events-none absolute inset-0" aria-hidden>
          {anos.map((ano) => (
            <span
              key={ano.rotulo}
              className="bg-line absolute top-0 bottom-0 w-px"
              style={{ left: `${ano.posicao}%` }}
            />
          ))}
        </span>

        {linhas.map((linha, i) => (
          <li key={linha.id} className="relative">
            <span className="sr-only">
              {linha.organizacao}, {linha.intervalo}, {formatDuration(linha.meses, locale)}
            </span>

            <div className="relative h-8" aria-hidden>
              <motion.div
                className="absolute top-0 flex h-8 items-center overflow-hidden rounded-sm"
                style={{
                  left: `${linha.esquerda}%`,
                  width: `${linha.largura}%`,
                  minWidth: 56,
                }}
                initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: reduceMotion ? 0 : i * 0.07,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
              >
                {/* Barra cheia, para o rotulo ficar legivel em qualquer caso. */}
                <span className="bg-accent absolute inset-0 opacity-90" />

                {/* Stint em curso: ponta listrada, indicando que nao terminou. */}
                {linha.emCurso ? (
                  <span className="pit-stripe absolute inset-y-0 right-0 w-6 opacity-90" />
                ) : null}

                <span
                  className={classNames(
                    "text-on-accent relative truncate py-1 pl-2.5 font-mono text-[11px] font-semibold tracking-wide",
                    linha.emCurso ? "pr-8" : "pr-2.5",
                  )}
                >
                  {linha.organizacao}
                </span>
              </motion.div>
            </div>
          </li>
        ))}
      </ol>

      <p className="text-muted mt-4 font-mono text-[10px] tracking-wide">
        {t.experiences.stintLegend}
      </p>
    </section>
  );
}
