"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Animacao sutil de entrada.
 * Anima na montagem (e nao no scroll) para garantir que o conteudo
 * sempre fique visivel, mesmo em impressao, captura de tela ou quando
 * a secao ja nasce dentro da viewport.
 * Respeita `prefers-reduced-motion`.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}
