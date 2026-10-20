"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Regua de largada: a fileira de luzes do volante que acende em sequencia.
 * A animacao marca a chegada da pagina, acendendo da esquerda para a direita
 * uma unica vez. Sob `prefers-reduced-motion` nasce acesa, sem sequencia.
 */
export function RevLights({ segments = 18 }: { segments?: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="flex items-center gap-1"
      role="presentation"
      aria-hidden
    >
      {Array.from({ length: segments }, (_, i) => {
        /* As ultimas luzes sao as do corte de giro: tom mais claro do acento. */
        const corte = i >= segments - 4;
        const intensidade = 0.25 + (i / (segments - 1)) * 0.75;

        return (
          <motion.span
            key={i}
            className={corte ? "bg-accent-2 h-2.5 w-full" : "bg-accent h-2.5 w-full"}
            style={{ maxWidth: 14 }}
            initial={reduceMotion ? false : { opacity: 0.08, scaleY: 0.4 }}
            animate={{ opacity: intensidade, scaleY: 1 }}
            transition={{
              duration: 0.18,
              delay: reduceMotion ? 0 : i * 0.035,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
}
