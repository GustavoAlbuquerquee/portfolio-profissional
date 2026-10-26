"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/context/I18nProvider";

/* ──────────────────────────────────────────────────────────────────────────
 * Modo fliperama, liberado pelo Codigo Konami: ↑ ↑ ↓ ↓ ← → ← → B A.
 *
 * Ao completar a sequencia, o <html> ganha data-arcade="on" e o CSS em
 * globals.css faz o resto: fonte de terminal pixelada nos titulos, linhas
 * de varredura de monitor CRT e brilho de fosforo. Esc desliga.
 *
 * Quem esta no celular nao tem teclado: a dica no rodape dispara o mesmo
 * evento "arcade:alternar", entao o modo fica acessivel em qualquer aparelho.
 * ────────────────────────────────────────────────────────────────────────── */

export const EVENTO_ALTERNAR = "arcade:alternar";

const SEQUENCIA = [
  "arrowup",
  "arrowup",
  "arrowdown",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "arrowleft",
  "arrowright",
  "b",
  "a",
];

/** Digitar num campo de formulario nunca conta como parte do codigo. */
function estaDigitando(alvo: EventTarget | null) {
  if (!(alvo instanceof HTMLElement)) return false;
  return alvo.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(alvo.tagName);
}

export function ArcadeMode() {
  const { t } = useI18n();
  const [ligado, setLigado] = useState(false);
  const [aviso, setAviso] = useState(false);
  const progresso = useRef(0);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Aplica o modo no <html> e mostra o aviso por alguns segundos. */
  useEffect(() => {
    const raiz = document.documentElement;
    if (ligado) raiz.dataset.arcade = "on";
    else delete raiz.dataset.arcade;
  }, [ligado]);

  useEffect(() => {
    const alternar = () => {
      setLigado((atual) => !atual);
      setAviso(true);
      if (temporizador.current) clearTimeout(temporizador.current);
      temporizador.current = setTimeout(() => setAviso(false), 2600);
    };

    const aoTeclar = (e: KeyboardEvent) => {
      if (estaDigitando(e.target)) return;

      const tecla = e.key.toLowerCase();

      if (tecla === "escape" && document.documentElement.dataset.arcade) {
        alternar();
        return;
      }

      if (tecla === SEQUENCIA[progresso.current]) {
        progresso.current += 1;
        if (progresso.current === SEQUENCIA.length) {
          progresso.current = 0;
          alternar();
        }
      } else {
        /* Errou: recomeca, aproveitando a tecla se ela abrir a sequencia. */
        progresso.current = tecla === SEQUENCIA[0] ? 1 : 0;
      }
    };

    window.addEventListener("keydown", aoTeclar);
    window.addEventListener(EVENTO_ALTERNAR, alternar);
    return () => {
      window.removeEventListener("keydown", aoTeclar);
      window.removeEventListener(EVENTO_ALTERNAR, alternar);
      if (temporizador.current) clearTimeout(temporizador.current);
    };
  }, []);

  return (
    <>
      {/* Leitor de tela ouve a mudanca de modo. */}
      <p role="status" aria-live="polite" className="sr-only">
        {aviso ? (ligado ? t.arcade.on : t.arcade.off) : ""}
      </p>

      {aviso ? (
        <div
          aria-hidden
          className="arcade-aviso bg-surface border-accent text-fg pointer-events-none fixed top-20 left-1/2 z-[80] -translate-x-1/2 rounded-sm border-2 px-5 py-3 text-center shadow-[0_0_24px_-4px_var(--accent)]"
        >
          <p className="font-pixel text-accent text-2xl leading-none tracking-wider">
            {ligado ? "INSERT COIN" : "GAME OVER"}
          </p>
          <p className="text-muted font-pixel mt-1 text-base leading-none">
            {ligado ? t.arcade.on : t.arcade.off}
          </p>
        </div>
      ) : null}
    </>
  );
}
