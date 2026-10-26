/* ──────────────────────────────────────────────────────────────────────────
 * Atividade no GitHub para a secao "Telemetria de codigo".
 *
 * - Calendario de contribuicoes: github-contributions-api.jogruber.de, que
 *   le o grafico publico do perfil e nao exige token (a API oficial so
 *   entrega esse calendario pela GraphQL, que pede autenticacao).
 * - Perfil e repositorios: API REST do GitHub. GITHUB_TOKEN e opcional;
 *   sem ele o limite e de 60 requisicoes por hora, o que basta com o cache.
 *
 * Tudo roda no servidor com cache de uma hora. Falha vira null.
 * ────────────────────────────────────────────────────────────────────────── */

import { githubUser } from "@/data/profile";

const UMA_HORA = 3600;

export type DiaDeContribuicao = { data: string; total: number; nivel: 0 | 1 | 2 | 3 | 4 };

export type Linguagem = { nome: string; repos: number; percentual: number };

export type PainelGitHub = {
  usuario: string;
  url: string;
  dias: DiaDeContribuicao[];
  totalNoAno: number;
  diasAtivos: number;
  sequenciaAtual: number;
  maiorSequencia: number;
  melhorDia: { data: string; total: number } | null;
  repositorios: number;
  estrelas: number;
  seguidores: number;
  linguagens: Linguagem[];
};

type ApiCalendario = {
  total: Record<string, number>;
  contributions: { date: string; count: number; level: number }[];
};
type ApiPerfil = { public_repos: number; followers: number; html_url: string };
type ApiRepo = { fork: boolean; language: string | null; stargazers_count: number };

function cabecalhosGitHub(): HeadersInit {
  const cabecalhos: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-albuquerquee",
  };
  if (process.env.GITHUB_TOKEN) cabecalhos.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return cabecalhos;
}

async function buscarJson<T>(url: string, headers?: HeadersInit): Promise<T> {
  const resposta = await fetch(url, {
    headers,
    next: { revalidate: UMA_HORA },
    signal: AbortSignal.timeout(10_000),
  });
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status} em ${url}`);
  return resposta.json() as Promise<T>;
}

/** Maior sequencia e sequencia atual (que pode terminar ontem, se hoje ainda estiver zerado). */
function sequencias(dias: DiaDeContribuicao[]) {
  let maior = 0;
  let corrente = 0;
  for (const dia of dias) {
    corrente = dia.total > 0 ? corrente + 1 : 0;
    maior = Math.max(maior, corrente);
  }

  let atual = 0;
  let i = dias.length - 1;
  if (i >= 0 && dias[i].total === 0) i -= 1; // hoje ainda pode ganhar commits
  for (; i >= 0 && dias[i].total > 0; i--) atual += 1;

  return { maior, atual };
}

export async function buscarPainelGitHub(): Promise<PainelGitHub | null> {
  const usuario = githubUser;
  try {
    const [calendario, perfil, repos] = await Promise.all([
      buscarJson<ApiCalendario>(
        `https://github-contributions-api.jogruber.de/v4/${usuario}?y=last`,
      ),
      buscarJson<ApiPerfil>(`https://api.github.com/users/${usuario}`, cabecalhosGitHub()),
      buscarJson<ApiRepo[]>(
        `https://api.github.com/users/${usuario}/repos?per_page=100&sort=pushed`,
        cabecalhosGitHub(),
      ),
    ]);

    const dias: DiaDeContribuicao[] = calendario.contributions.map((c) => ({
      data: c.date,
      total: c.count,
      nivel: Math.max(0, Math.min(4, c.level)) as DiaDeContribuicao["nivel"],
    }));

    const { maior, atual } = sequencias(dias);
    const melhor = dias.reduce<DiaDeContribuicao | null>(
      (topo, dia) => (dia.total > (topo?.total ?? 0) ? dia : topo),
      null,
    );

    /* Linguagem principal de cada repositorio proprio (forks nao contam). */
    const proprios = repos.filter((r) => !r.fork);
    const contagem = new Map<string, number>();
    for (const repo of proprios) {
      if (repo.language) contagem.set(repo.language, (contagem.get(repo.language) ?? 0) + 1);
    }
    const comLinguagem = [...contagem.values()].reduce((soma, n) => soma + n, 0) || 1;
    const linguagens = [...contagem.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([nome, n]) => ({ nome, repos: n, percentual: (n / comLinguagem) * 100 }));

    return {
      usuario,
      url: perfil.html_url,
      dias,
      totalNoAno: calendario.total.lastYear ?? dias.reduce((s, d) => s + d.total, 0),
      diasAtivos: dias.filter((d) => d.total > 0).length,
      sequenciaAtual: atual,
      maiorSequencia: maior,
      melhorDia: melhor && melhor.total > 0 ? { data: melhor.data, total: melhor.total } : null,
      repositorios: perfil.public_repos,
      estrelas: proprios.reduce((soma, r) => soma + r.stargazers_count, 0),
      seguidores: perfil.followers,
      linguagens,
    };
  } catch (erro) {
    console.error("[github] falha ao buscar dados:", erro);
    return null;
  }
}
