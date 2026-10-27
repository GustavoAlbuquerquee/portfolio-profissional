"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useI18n } from "@/context/I18nProvider";
import type { CommitRecente } from "@/lib/github";

/* Velocidade de leitura, em px/s: a faixa anda sempre no mesmo ritmo,
   qualquer que seja o tamanho das mensagens. */
const VELOCIDADE = 48;

/** "feat(frontend): cria as telas" -> ["feat(frontend):", "cria as telas"] */
function separarTipo(mensagem: string): [string | null, string] {
  const encontrado = /^([a-z]+(?:\([^)]*\))?!?:)\s*(.*)$/i.exec(mensagem);
  return encontrado ? [encontrado[1], encontrado[2]] : [null, mensagem];
}

export function CommitTickerView({ commits }: { commits: CommitRecente[] }) {
  const { t, locale } = useI18n();
  const secao = useRef<HTMLElement>(null);
  const grupo = useRef<HTMLUListElement>(null);
  const [pausado, setPausado] = useState(false);
  const [visivel, setVisivel] = useState(true);
  // Estimativa ate a primeira medicao.
  const [duracao, setDuracao] = useState(commits.length * 8);

  /* Uma volta e a largura de um grupo. Mede de novo quando a fonte troca
     (carregamento ou modo fliperama), para a velocidade nao mudar. */
  useEffect(() => {
    const el = grupo.current;
    if (!el) return;
    const medir = () => setDuracao(el.offsetWidth / VELOCIDADE);
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  /* Fora da tela a faixa para, como o resto das animacoes do site. */
  useEffect(() => {
    const el = secao.current;
    if (!el) return;
    const observador = new IntersectionObserver(([entrada]) => setVisivel(entrada.isIntersecting));
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  /* Fuso fixo: servidor e navegador escrevem a mesma hora, sem erro de hidratacao. */
  const horario = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone: "America/Sao_Paulo",
      }),
    [locale],
  );
  const quando = (iso: string) => {
    const p = Object.fromEntries(
      horario.formatToParts(new Date(iso)).map((parte) => [parte.type, parte.value]),
    );
    return `${p.day} ${p.month.replace(".", "")} ${p.hour}:${p.minute}`;
  };

  const itens = (copia: boolean) =>
    commits.map((commit) => {
      const [tipo, resumo] = separarTipo(commit.mensagem);
      return (
        <li key={commit.sha} className="flex shrink-0">
          <a
            href={commit.url}
            target="_blank"
            rel="noreferrer noopener"
            tabIndex={copia ? -1 : undefined}
            title={commit.mensagem}
            className="group flex max-w-[56rem] items-center gap-3 px-5 py-3 font-mono text-xs"
          >
            <span className="bg-accent h-2 w-2 shrink-0 rounded-[2px]" aria-hidden />
            <time dateTime={commit.data} className="text-muted tabular shrink-0 uppercase">
              {quando(commit.data)}
            </time>
            <span className="text-fg shrink-0 font-semibold">{commit.repositorio}</span>
            <span className="text-muted group-hover:text-fg min-w-0 truncate transition-colors">
              {tipo ? <span className="text-accent">{tipo} </span> : null}
              {resumo}
            </span>
          </a>
        </li>
      );
    });

  return (
    <section ref={secao} aria-label={t.radio.aria} className="border-line bg-surface flex border-b">
      {/* Placa fixa, como o grafismo de radio da equipe na transmissao.
          No celular fica so a forma curta, para sobrar faixa para os commits. */}
      <p className="bg-accent text-on-accent flex shrink-0 items-center gap-2 px-3 font-mono text-[10px] font-bold tracking-[0.15em] whitespace-nowrap uppercase sm:px-4 sm:text-[11px]">
        <span className="radio-pulso h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
        <span className="sm:hidden">{t.radio.short}</span>
        <span className="hidden sm:inline">{t.radio.label}</span>
      </p>

      <div className="radio-janela min-w-0 flex-1 overflow-hidden">
        <div
          className="radio-trilho flex w-max"
          data-pausado={pausado || !visivel ? "" : undefined}
          style={{ animationDuration: `${duracao}s` }}
        >
          <ul ref={grupo} className="flex shrink-0">
            {itens(false)}
          </ul>
          {/* Copia para o laco nao ter emenda: o trilho anda um grupo e recomeca. */}
          <ul className="radio-copia flex shrink-0" aria-hidden>
            {itens(true)}
          </ul>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setPausado((valor) => !valor)}
        aria-pressed={pausado}
        aria-label={t.radio.pause}
        className="border-line text-muted hover:text-fg pressable grid w-11 shrink-0 place-items-center border-l motion-reduce:hidden"
      >
        {pausado ? (
          <Play className="h-3.5 w-3.5" aria-hidden />
        ) : (
          <Pause className="h-3.5 w-3.5" aria-hidden />
        )}
      </button>
    </section>
  );
}
