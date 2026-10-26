"use client";

import { useEffect, useRef } from "react";

/* ──────────────────────────────────────────────────────────────────────────
 * Linhas de velocidade: tracos saindo de um ponto de fuga, como a visao
 * da cabine numa reta. Cada traco acelera conforme se afasta do centro,
 * o que da a sensacao de profundidade. Fica atras do heroi, so anima
 * quando esta na tela e nao roda sob prefers-reduced-motion.
 * ────────────────────────────────────────────────────────────────────────── */

type Traco = { angulo: number; dist: number; vel: number; acento: boolean };

const QUANTIDADE = 260;

function lerCor(nome: string, reserva: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(nome).trim() || reserva;
}

export function SpeedLines() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let largura = 0;
    let altura = 0;
    let fugaX = 0;
    let fugaY = 0;
    let alcance = 0;
    let quadro = 0;
    let visivel = true;
    let ultimo = performance.now();
    let cores = { traco: lerCor("--fg", "#ededef"), acento: lerCor("--accent", "#e2621f") };

    const nascer = (t: Traco, espalhar: boolean) => {
      t.angulo = Math.random() * Math.PI * 2;
      t.dist = espalhar ? Math.random() * alcance : 4 + Math.random() * 30;
      t.vel = 60 + Math.random() * 120;
      t.acento = Math.random() < 0.14;
    };

    const tracos: Traco[] = Array.from({ length: QUANTIDADE }, () => {
      const t = { angulo: 0, dist: 0, vel: 0, acento: false };
      return t;
    });

    const medir = () => {
      const caixa = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      largura = caixa.width;
      altura = caixa.height;
      /* Ponto de fuga a direita, atras da placa de identificacao. */
      fugaX = largura * 0.72;
      fugaY = altura * 0.42;
      alcance = Math.hypot(Math.max(fugaX, largura - fugaX), Math.max(fugaY, altura - fugaY));
      canvas.width = Math.round(largura * dpr);
      canvas.height = Math.round(altura * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const passo = (agora: number) => {
      const dt = Math.min(0.05, (agora - ultimo) / 1000);
      ultimo = agora;
      ctx.clearRect(0, 0, largura, altura);
      ctx.lineCap = "round";

      for (const t of tracos) {
        const progresso = t.dist / alcance;
        /* Acelera ao se afastar: perto do ponto de fuga quase parado. */
        t.dist += t.vel * (0.25 + progresso * 2.4) * dt;
        if (t.dist > alcance) {
          nascer(t, false);
          continue;
        }
        const comprimento = 10 + progresso * progresso * 170;
        const dx = Math.cos(t.angulo);
        const dy = Math.sin(t.angulo);
        ctx.globalAlpha = Math.min(1, progresso * 1.8) * (t.acento ? 0.95 : 0.55);
        ctx.strokeStyle = t.acento ? cores.acento : cores.traco;
        ctx.lineWidth = t.acento ? 1.8 : 1.1;
        ctx.beginPath();
        ctx.moveTo(fugaX + dx * t.dist, fugaY + dy * t.dist);
        ctx.lineTo(fugaX + dx * (t.dist + comprimento), fugaY + dy * (t.dist + comprimento));
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      quadro = visivel && !document.hidden ? requestAnimationFrame(passo) : 0;
    };

    const ligar = () => {
      if (quadro) return;
      ultimo = performance.now();
      quadro = requestAnimationFrame(passo);
    };

    medir();
    tracos.forEach((t) => nascer(t, true));

    const observador = new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
      if (visivel) ligar();
    });
    observador.observe(canvas);

    const aoMudarAba = () => {
      if (!document.hidden && visivel) ligar();
    };
    document.addEventListener("visibilitychange", aoMudarAba);

    const redimensionar = new ResizeObserver(medir);
    redimensionar.observe(canvas);

    const tema = new MutationObserver(() => {
      cores = { traco: lerCor("--fg", cores.traco), acento: lerCor("--accent", cores.acento) };
    });
    tema.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    ligar();

    return () => {
      cancelAnimationFrame(quadro);
      observador.disconnect();
      redimensionar.disconnect();
      tema.disconnect();
      document.removeEventListener("visibilitychange", aoMudarAba);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full [mask-image:linear-gradient(to_right,transparent_0%,black_55%)]"
    />
  );
}
