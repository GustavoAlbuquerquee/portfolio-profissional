"use client";

import { useEffect, useMemo, useRef } from "react";
import { Database, GitBranch, Network, Repeat, SquareKanban } from "lucide-react";
import { skillGroups } from "@/data/skills";
import { stackLogos, type StackIconKind } from "@/data/stackLogos";
import { asset } from "@/lib/assets";

/* ──────────────────────────────────────────────────────────────────────────
 * Globo de stacks.
 *
 * Cada tecnologia e um ponto numa esfera. Os pontos sao distribuidos pela
 * espiral de Fibonacci (angulo aureo), que espalha N pontos de forma quase
 * uniforme sem formar polos. A esfera gira; cada ponto e projetado em
 * perspectiva, e a profundidade decide escala, opacidade e camada.
 *
 * O arame da esfera e desenhado num canvas; as placas com os logos sao
 * elementos do DOM movidos so por transform/opacity, direto nas refs, sem
 * passar pelo estado do React a cada quadro.
 * ────────────────────────────────────────────────────────────────────────── */

const ICONES: Record<StackIconKind, React.ComponentType<{ className?: string }>> = {
  network: Network,
  database: Database,
  repeat: Repeat,
  kanban: SquareKanban,
  branch: GitBranch,
};

/** Distancia da camera, em raios da esfera. Menor = perspectiva mais forte. */
const CAMERA = 3.2;
/** Giro automatico em radianos por segundo. */
const GIRO_AUTO = 0.28;
/** Inclinacao de repouso: ve a esfera levemente de cima. */
const INCLINACAO_BASE = -0.32;
/** Sensibilidade do arraste, em radianos por pixel. */
const SENSIBILIDADE = 0.0065;

type Ponto = { x: number; y: number; z: number };

type Item = { nome: string; grupo: string };

function esferaDeFibonacci(n: number): Ponto[] {
  const anguloAureo = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - (i / Math.max(1, n - 1)) * 2;
    const raio = Math.sqrt(1 - y * y);
    const theta = anguloAureo * i;
    return { x: Math.cos(theta) * raio, y, z: Math.sin(theta) * raio };
  });
}

/** Gira o ponto em torno de Y (guinada) e depois de X (arfagem). */
function girar(p: Ponto, guinada: number, arfagem: number): Ponto {
  const cy = Math.cos(guinada);
  const sy = Math.sin(guinada);
  const x1 = p.x * cy + p.z * sy;
  const z1 = -p.x * sy + p.z * cy;
  const cx = Math.cos(arfagem);
  const sx = Math.sin(arfagem);
  return { x: x1, y: p.y * cx - z1 * sx, z: p.y * sx + z1 * cx };
}

function lerCor(nome: string, reserva: string) {
  if (typeof window === "undefined") return reserva;
  return getComputedStyle(document.documentElement).getPropertyValue(nome).trim() || reserva;
}

export function StackGlobe({ grupoAtivo = "all" }: { grupoAtivo?: string }) {
  const itens = useMemo<Item[]>(
    () => skillGroups.flatMap((g) => g.items.map((nome) => ({ nome, grupo: g.id }))),
    [],
  );
  const pontos = useMemo(() => esferaDeFibonacci(itens.length), [itens.length]);

  const palcoRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nosRef = useRef<(HTMLLIElement | null)[]>([]);
  const rotulosRef = useRef<(HTMLSpanElement | null)[]>([]);
  const grupoRef = useRef(grupoAtivo);

  useEffect(() => {
    grupoRef.current = grupoAtivo;
  }, [grupoAtivo]);

  useEffect(() => {
    const palco = palcoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!palco || !canvas || !ctx) return;

    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const estado = {
      guinada: 0.6,
      arfagem: INCLINACAO_BASE,
      vGuinada: reduzir ? 0 : GIRO_AUTO,
      vArfagem: 0,
      arrastando: false,
      ultX: 0,
      ultY: 0,
      ultT: 0,
      largura: 0,
      altura: 0,
      raio: 0,
      visivel: true,
      quadro: 0,
      ultimo: performance.now(),
    };

    let cores = {
      linha: lerCor("--line", "#2a2a2e"),
      acento: lerCor("--accent", "#e2621f"),
    };

    /* ── Tamanho e densidade de pixels ─────────────────────────────── */
    const medir = () => {
      const caixa = palco.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      estado.largura = caixa.width;
      estado.altura = caixa.height;
      estado.raio = Math.min(caixa.width, caixa.height) * 0.34;
      canvas.width = Math.round(caixa.width * dpr);
      canvas.height = Math.round(caixa.height * dpr);
      canvas.style.width = `${caixa.width}px`;
      canvas.style.height = `${caixa.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const projetar = (p: Ponto) => {
      const r = girar(p, estado.guinada, estado.arfagem);
      const f = CAMERA / (CAMERA - r.z);
      return {
        x: estado.largura / 2 + r.x * estado.raio * f,
        y: estado.altura / 2 + r.y * estado.raio * f,
        z: r.z,
      };
    };

    /* ── Arame: paralelos e meridianos ─────────────────────────────── */
    const desenharCurva = (amostras: Ponto[], cor: string, alfaFrente: number) => {
      const proj = amostras.map(projetar);
      for (let i = 0; i < proj.length - 1; i++) {
        const a = proj[i];
        const b = proj[i + 1];
        const frente = (a.z + b.z) / 2 > 0;
        ctx.globalAlpha = frente ? alfaFrente : alfaFrente * 0.28;
        ctx.strokeStyle = cor;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    };

    const desenharArame = () => {
      ctx.clearRect(0, 0, estado.largura, estado.altura);
      ctx.lineWidth = 1;

      for (const lat of [-60, -30, 0, 30, 60]) {
        const phi = (lat * Math.PI) / 180;
        const amostras = Array.from({ length: 65 }, (_, i) => {
          const t = (i / 64) * Math.PI * 2;
          return { x: Math.cos(phi) * Math.cos(t), y: Math.sin(phi), z: Math.cos(phi) * Math.sin(t) };
        });
        /* O equador vai no acento, como a linha de chegada do painel. */
        desenharCurva(amostras, lat === 0 ? cores.acento : cores.linha, lat === 0 ? 0.75 : 0.9);
      }

      for (let lon = 0; lon < 180; lon += 30) {
        const lambda = (lon * Math.PI) / 180;
        const amostras = Array.from({ length: 65 }, (_, i) => {
          const t = (i / 64) * Math.PI * 2;
          return { x: Math.cos(t) * Math.cos(lambda), y: Math.sin(t), z: Math.cos(t) * Math.sin(lambda) };
        });
        desenharCurva(amostras, cores.linha, 0.9);
      }

      ctx.globalAlpha = 1;
    };

    /* ── Placas com os logos ───────────────────────────────────────── */
    const posicionarNos = () => {
      const grupo = grupoRef.current;
      pontos.forEach((p, i) => {
        const no = nosRef.current[i];
        if (!no) return;
        const q = projetar(p);
        const profundidade = (q.z + 1) / 2;
        const escala = 0.58 + profundidade * 0.6;
        const foraDoGrupo = grupo !== "all" && itens[i].grupo !== grupo;
        const opacidade = (0.16 + profundidade * 0.84) * (foraDoGrupo ? 0.22 : 1);

        no.style.transform = `translate3d(${q.x}px, ${q.y}px, 0) scale(${escala})`;
        no.style.opacity = opacidade.toFixed(3);
        no.style.zIndex = String(Math.round(profundidade * 100));

        const rotulo = rotulosRef.current[i];
        if (rotulo) {
          rotulo.style.opacity = !foraDoGrupo && profundidade > 0.62 ? "1" : "0";
        }
      });
    };

    /* ── Laco de animacao ──────────────────────────────────────────── */
    const passo = (agora: number) => {
      const dt = Math.min(0.05, (agora - estado.ultimo) / 1000);
      estado.ultimo = agora;

      if (!estado.arrastando) {
        /* Inercia: depois de soltar, a velocidade volta ao giro de cruzeiro. */
        const alvo = reduzir ? 0 : GIRO_AUTO;
        const amortece = 1 - Math.exp(-dt * 2.2);
        estado.vGuinada += (alvo - estado.vGuinada) * amortece;
        estado.vArfagem += (0 - estado.vArfagem) * amortece;
        estado.arfagem += (INCLINACAO_BASE - estado.arfagem) * (1 - Math.exp(-dt * 0.9));
        estado.guinada += estado.vGuinada * dt;
        estado.arfagem += estado.vArfagem * dt;
      }

      desenharArame();
      posicionarNos();

      if (estado.visivel && !document.hidden) {
        estado.quadro = requestAnimationFrame(passo);
      } else {
        estado.quadro = 0;
      }
    };

    const ligar = () => {
      if (estado.quadro) return;
      estado.ultimo = performance.now();
      estado.quadro = requestAnimationFrame(passo);
    };

    /* ── Arraste ───────────────────────────────────────────────────── */
    const aoPressionar = (e: PointerEvent) => {
      estado.arrastando = true;
      estado.ultX = e.clientX;
      estado.ultY = e.clientY;
      estado.ultT = performance.now();
      estado.vGuinada = 0;
      estado.vArfagem = 0;
      palco.setPointerCapture(e.pointerId);
      palco.dataset.arrastando = "true";
      ligar();
    };

    const aoMover = (e: PointerEvent) => {
      if (!estado.arrastando) return;
      const agora = performance.now();
      const dt = Math.max(1, agora - estado.ultT) / 1000;
      const dx = (e.clientX - estado.ultX) * SENSIBILIDADE;
      const dy = (e.clientY - estado.ultY) * SENSIBILIDADE;
      estado.guinada += dx;
      estado.arfagem = Math.max(-1.1, Math.min(1.1, estado.arfagem - dy));
      /* Guarda a velocidade do gesto para a inercia ao soltar. */
      estado.vGuinada = dx / dt;
      estado.vArfagem = -dy / dt;
      estado.ultX = e.clientX;
      estado.ultY = e.clientY;
      estado.ultT = agora;
      if (!estado.quadro) {
        desenharArame();
        posicionarNos();
      }
    };

    const aoSoltar = (e: PointerEvent) => {
      if (!estado.arrastando) return;
      estado.arrastando = false;
      delete palco.dataset.arrastando;
      if (palco.hasPointerCapture(e.pointerId)) palco.releasePointerCapture(e.pointerId);
      /* Um gesto parado ha mais de 80ms nao tem impulso. */
      if (performance.now() - estado.ultT > 80) {
        estado.vGuinada = 0;
        estado.vArfagem = 0;
      }
      ligar();
    };

    palco.addEventListener("pointerdown", aoPressionar);
    palco.addEventListener("pointermove", aoMover);
    palco.addEventListener("pointerup", aoSoltar);
    palco.addEventListener("pointercancel", aoSoltar);

    /* ── So anima quando esta na tela ──────────────────────────────── */
    const observador = new IntersectionObserver(
      ([entrada]) => {
        estado.visivel = entrada.isIntersecting;
        if (estado.visivel) ligar();
      },
      { threshold: 0.05 },
    );
    observador.observe(palco);

    const aoMudarAba = () => {
      if (!document.hidden && estado.visivel) ligar();
    };
    document.addEventListener("visibilitychange", aoMudarAba);

    const redimensionar = new ResizeObserver(() => {
      medir();
      desenharArame();
      posicionarNos();
    });
    redimensionar.observe(palco);

    /* Troca de tema muda as cores do arame. */
    const tema = new MutationObserver(() => {
      cores = { linha: lerCor("--line", cores.linha), acento: lerCor("--accent", cores.acento) };
      desenharArame();
    });
    tema.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    medir();
    desenharArame();
    posicionarNos();
    ligar();

    return () => {
      cancelAnimationFrame(estado.quadro);
      palco.removeEventListener("pointerdown", aoPressionar);
      palco.removeEventListener("pointermove", aoMover);
      palco.removeEventListener("pointerup", aoSoltar);
      palco.removeEventListener("pointercancel", aoSoltar);
      document.removeEventListener("visibilitychange", aoMudarAba);
      observador.disconnect();
      redimensionar.disconnect();
      tema.disconnect();
    };
  }, [itens, pontos]);

  return (
    <div
      ref={palcoRef}
      role="img"
      aria-label={itens.map((i) => i.nome).join(", ")}
      className="relative mx-auto aspect-square w-full max-w-[600px] cursor-grab touch-pan-y select-none data-[arrastando=true]:cursor-grabbing"
    >
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" aria-hidden />

      <ul className="pointer-events-none absolute inset-0" aria-hidden>
        {itens.map((item, i) => {
          const logo = stackLogos[item.nome];
          const Icone = logo?.type === "icon" ? ICONES[logo.icon] : null;

          return (
            <li
              key={`${item.grupo}-${item.nome}`}
              ref={(el) => {
                nosRef.current[i] = el;
              }}
              className="absolute top-0 left-0 -mt-[22px] -ml-[22px] flex w-11 flex-col items-center will-change-transform"
              style={{ opacity: 0 }}
            >
              {/* Placa clara em qualquer tema: o logo mantem a cor da marca,
                  como um adesivo de patrocinador na carenagem. */}
              <span className="grid h-11 w-11 place-items-center rounded-sm border border-black/10 bg-[#f6f6f4] shadow-[0_2px_8px_-2px_rgb(0_0_0/0.35)]">
                {logo?.type === "logo" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset(logo.src)}
                    alt=""
                    width={24}
                    height={24}
                    draggable={false}
                    className="h-6 w-6"
                  />
                ) : Icone ? (
                  <Icone className="h-5 w-5 text-[#141416]" />
                ) : (
                  <span className="font-mono text-[9px] font-bold text-[#141416]">
                    {item.nome.slice(0, 3).toUpperCase()}
                  </span>
                )}
              </span>
              <span
                ref={(el) => {
                  rotulosRef.current[i] = el;
                }}
                className="text-fg mt-1.5 font-mono text-[10px] leading-none whitespace-nowrap transition-opacity duration-200"
                style={{ opacity: 0 }}
              >
                {item.nome}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
