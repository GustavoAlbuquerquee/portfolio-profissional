"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Placar de letras avulsas, no formato das placas de estadio e de aeroporto.
 * Cada caractere ocupa sua propria celula, com o vinco no meio, e gira para
 * dentro na montagem. O valor exibido vem dos dados reais do perfil.
 */
export function FlipStat({ value, delay = 0 }: { value: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  const chars = Array.from(value);

  return (
    <span className="inline-flex gap-[3px]" aria-label={value}>
      {chars.map((char, i) => {
        /* Espaco nao ganha celula: vira respiro entre os blocos. */
        if (char === " ") return <span key={i} className="w-1.5" aria-hidden />;

        return (
          <motion.span
            key={i}
            aria-hidden
            className="border-line bg-surface-2 text-fg tabular relative grid h-11 w-8 place-items-center overflow-hidden rounded-sm border font-mono text-xl font-bold sm:h-14 sm:w-10 sm:text-2xl"
            initial={reduceMotion ? false : { rotateX: -82, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{
              duration: 0.34,
              delay: reduceMotion ? 0 : delay + i * 0.05,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            style={{ transformOrigin: "center top" }}
          >
            {char}
            {/* Vinco central da placa. */}
            <span className="bg-line absolute inset-x-0 top-1/2 h-px opacity-70" />
          </motion.span>
        );
      })}
    </span>
  );
}
