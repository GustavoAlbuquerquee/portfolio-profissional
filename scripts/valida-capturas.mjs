#!/usr/bin/env node
/**
 * Valida as imagens de projeto em public/projects/.
 *
 * Lê os cabeçalhos de PNG, GIF, JPEG e SVG para descobrir largura e altura
 * reais (sem dependências), compara com o alvo 16:10 e cruza com o campo
 * `image` de cada projeto em src/data/projects.ts.
 *
 * Somente leitura: não escreve nada no repositório.
 * Uso: node scripts/valida-capturas.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, basename, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const PASTA_IMAGENS = join(RAIZ, "public", "projects");
const ARQUIVO_PROJETOS = join(RAIZ, "src", "data", "projects.ts");

// Alvo de proporção e tolerâncias.
const PROPORCAO_ALVO = 16 / 10;
const TOLERANCIA = 0.01; // 1% de desvio relativo
const LARGURA_ALVO = 1600;
const ALTURA_ALVO = 1000;

// Limites de peso sugeridos (KB) e resolução mínima aceitável por formato.
const PESO_MAX_KB = { png: 800, jpg: 500, gif: 5000 };
const LARGURA_MIN = { png: LARGURA_ALVO, jpg: LARGURA_ALVO, gif: 800 };

const EXTENSOES_CAPTURA = ["png", "gif", "jpg", "jpeg"];

/* ───────────────────────── leitura de dimensões ───────────────────────── */

/** PNG: assinatura de 8 bytes, depois o chunk IHDR (largura e altura em uint32 BE). */
function dimensoesPng(buf) {
  const assinatura = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (buf.length < 24 || !assinatura.every((b, i) => buf[i] === b)) return null;
  if (buf.toString("ascii", 12, 16) !== "IHDR") return null;
  return { largura: buf.readUInt32BE(16), altura: buf.readUInt32BE(20) };
}

/** GIF: "GIF87a"/"GIF89a" seguido do logical screen descriptor (uint16 LE). */
function dimensoesGif(buf) {
  if (buf.length < 10 || !buf.toString("ascii", 0, 3).startsWith("GIF")) return null;
  return { largura: buf.readUInt16LE(6), altura: buf.readUInt16LE(8) };
}

/** JPEG: percorre os marcadores até um SOFn (exceto DHT/JPG/DAC) e lê a altura e a largura. */
function dimensoesJpeg(buf) {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  let pos = 2;
  while (pos + 9 < buf.length) {
    if (buf[pos] !== 0xff) {
      pos++;
      continue;
    }
    const marcador = buf[pos + 1];
    // Preenchimento (0xFF repetido) e marcadores sem payload.
    if (marcador === 0xff) {
      pos++;
      continue;
    }
    if (marcador === 0x01 || (marcador >= 0xd0 && marcador <= 0xd8)) {
      pos += 2;
      continue;
    }
    const tamanho = buf.readUInt16BE(pos + 2);
    const ehSof =
      marcador >= 0xc0 && marcador <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marcador);
    if (ehSof) {
      return { altura: buf.readUInt16BE(pos + 5), largura: buf.readUInt16BE(pos + 7) };
    }
    pos += 2 + tamanho;
  }
  return null;
}

/** Converte "800", "800px" ou "12.5" em número; ignora porcentagens e unidades relativas. */
function numeroSvg(valor) {
  if (!valor) return null;
  const m = /^\s*([0-9]*\.?[0-9]+)\s*(px)?\s*$/i.exec(valor);
  return m ? parseFloat(m[1]) : null;
}

/** SVG: atributos width/height da tag raiz; se faltarem, usa o viewBox. */
function dimensoesSvg(buf) {
  const texto = buf.toString("utf8");
  const raiz = /<svg\b[^>]*>/i.exec(texto);
  if (!raiz) return null;
  const attr = (nome) => {
    const m = new RegExp(`\\s${nome}\\s*=\\s*["']([^"']*)["']`, "i").exec(raiz[0]);
    return m ? m[1] : null;
  };
  const largura = numeroSvg(attr("width"));
  const altura = numeroSvg(attr("height"));
  if (largura && altura) return { largura, altura };
  const vb = attr("viewBox");
  if (vb) {
    const p = vb.trim().split(/[\s,]+/).map(Number);
    if (p.length === 4 && p[2] > 0 && p[3] > 0) return { largura: p[2], altura: p[3] };
  }
  return null;
}

function lerDimensoes(caminho, ext) {
  const buf = readFileSync(caminho);
  if (ext === "png") return dimensoesPng(buf);
  if (ext === "gif") return dimensoesGif(buf);
  if (ext === "jpg" || ext === "jpeg") return dimensoesJpeg(buf);
  if (ext === "svg") return dimensoesSvg(buf);
  return null;
}

/* ─────────────────────────────── projetos ─────────────────────────────── */

/** Extrai { id, image } de cada objeto do array em projects.ts, sem executar TypeScript. */
function lerProjetos() {
  const fonte = readFileSync(ARQUIVO_PROJETOS, "utf8");
  const projetos = [];
  let atual = null;
  for (const linha of fonte.split(/\r?\n/)) {
    const id = /^\s{4}id:\s*"([^"]+)"/.exec(linha);
    if (id) {
      atual = { id: id[1], image: null };
      projetos.push(atual);
      continue;
    }
    const img = /^\s{4}image:\s*"([^"]+)"/.exec(linha);
    if (img && atual) atual.image = img[1];
  }
  return projetos;
}

/* ───────────────────────────── relatório ──────────────────────────────── */

function formatarProporcao(l, a) {
  const r = l / a;
  return Math.abs(r - PROPORCAO_ALVO) / PROPORCAO_ALVO <= TOLERANCIA
    ? "16:10"
    : `${r.toFixed(3)}:1`;
}

function analisar(nomeArquivo) {
  const caminho = join(PASTA_IMAGENS, nomeArquivo);
  const ext = extname(nomeArquivo).slice(1).toLowerCase();
  const pesoKb = statSync(caminho).size / 1024;
  const dim = lerDimensoes(caminho, ext);
  const avisos = [];
  let veredito;

  if (!dim) {
    veredito = "ilegível";
    avisos.push("não foi possível ler as dimensões");
  } else {
    const desvio = Math.abs(dim.largura / dim.altura - PROPORCAO_ALVO) / PROPORCAO_ALVO;
    if (ext === "svg") veredito = "ainda é mockup SVG";
    else if (desvio > TOLERANCIA) veredito = "proporção errada";
    else veredito = "ok";

    if (ext !== "svg") {
      const chave = ext === "jpeg" ? "jpg" : ext;
      if (dim.largura < LARGURA_MIN[chave]) {
        avisos.push(`largura abaixo de ${LARGURA_MIN[chave]}px (alvo ${LARGURA_ALVO}x${ALTURA_ALVO})`);
      }
      if (pesoKb > PESO_MAX_KB[chave]) {
        avisos.push(`acima de ${PESO_MAX_KB[chave]} KB sugeridos`);
      }
    }
  }
  return { nomeArquivo, ext, pesoKb, dim, veredito, avisos };
}

function imprimirTabela(cabecalho, linhas) {
  const larguras = cabecalho.map((c, i) => Math.max(c.length, ...linhas.map((l) => l[i].length)));
  const fmt = (l) => l.map((c, i) => c.padEnd(larguras[i])).join("  ");
  console.log(fmt(cabecalho));
  console.log(larguras.map((w) => "-".repeat(w)).join("  "));
  linhas.forEach((l) => console.log(fmt(l)));
}

function main() {
  const arquivos = readdirSync(PASTA_IMAGENS)
    .filter((f) => /\.(png|gif|jpe?g|svg)$/i.test(f))
    .sort();
  const resultados = arquivos.map(analisar);

  console.log(`\nImagens em public/projects/ (alvo: 16:10, ${LARGURA_ALVO}x${ALTURA_ALVO})\n`);
  imprimirTabela(
    ["Arquivo", "Dimensões", "Proporção", "Peso (KB)", "Veredito"],
    resultados.map((r) => [
      r.nomeArquivo,
      r.dim ? `${r.dim.largura}x${r.dim.altura}` : "?",
      r.dim ? formatarProporcao(r.dim.largura, r.dim.altura) : "?",
      r.pesoKb.toFixed(1),
      r.veredito,
    ]),
  );

  const comAvisos = resultados.filter((r) => r.avisos.length > 0);
  if (comAvisos.length > 0) {
    console.log("\nAvisos:");
    comAvisos.forEach((r) => console.log(`  - ${r.nomeArquivo}: ${r.avisos.join("; ")}`));
  }

  // Cruzamento com src/data/projects.ts.
  const projetos = lerProjetos();
  const porId = new Map();
  for (const r of resultados) {
    const id = basename(r.nomeArquivo, extname(r.nomeArquivo));
    if (!porId.has(id)) porId.set(id, []);
    porId.get(id).push(r);
  }

  const aindaSvg = [];
  const pendentes = []; // captura existe, mas `image` não aponta para ela
  const linhasProjetos = projetos.map((p) => {
    const captura = (porId.get(p.id) ?? []).find((r) => EXTENSOES_CAPTURA.includes(r.ext));
    const ehSvg = p.image === null || p.image.toLowerCase().endsWith(".svg");
    const alvoImage = captura ? `/projects/${captura.nomeArquivo}` : null;
    if (ehSvg) aindaSvg.push(p.id);
    let situacao;
    if (captura && p.image !== alvoImage) {
      pendentes.push({ id: p.id, linha: `image: "${alvoImage}",` });
      situacao = "captura disponível, image desatualizado";
    } else if (captura) {
      situacao = `usando captura (${captura.veredito})`;
    } else if (ehSvg) {
      situacao = "sem captura, usa SVG";
    } else {
      situacao = "image aponta para arquivo não encontrado ou fora do padrão";
    }
    return [p.id, p.image ?? "(ausente)", situacao];
  });

  console.log("\nProjetos em src/data/projects.ts:\n");
  imprimirTabela(["Projeto", "image atual", "Situação"], linhasProjetos);

  console.log(`\nAinda apontando para .svg (${aindaSvg.length}): ${aindaSvg.join(", ") || "nenhum"}`);

  if (pendentes.length > 0) {
    console.log("\nCapturas prontas com `image` ainda não atualizado:");
    pendentes.forEach((p) => console.log(`  ${p.id}: ${p.linha}`));
  } else {
    console.log("\nNenhuma captura pendente de vínculo.");
  }

  console.log("\nLinha `image:` esperada para cada projeto:");
  projetos.forEach((p) => {
    const captura = (porId.get(p.id) ?? []).find((r) => EXTENSOES_CAPTURA.includes(r.ext));
    const esperado = captura
      ? `image: "/projects/${captura.nomeArquivo}",`
      : `image: "/projects/${p.id}.png",  // ou .gif, depois de adicionar a captura`;
    console.log(`  ${p.id.padEnd(24)} ${esperado}`);
  });
  console.log("");
}

main();
