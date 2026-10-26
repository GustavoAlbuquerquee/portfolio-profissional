"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

/**
 * Barra de progresso de leitura, fixa no topo, como a contagem de voltas.
 * Le o scroll pelo useScroll do Motion (nada de listener de scroll na
 * janela) e suaviza com mola para nao tremer em rolagem irregular.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduzir = useReducedMotion();
  const suave = useSpring(scrollYProgress, { stiffness: 200, damping: 32, mass: 0.3 });

  return (
    <motion.div
      aria-hidden
      className="bg-accent pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px] origin-left"
      style={{ scaleX: reduzir ? scrollYProgress : suave }}
    />
  );
}
