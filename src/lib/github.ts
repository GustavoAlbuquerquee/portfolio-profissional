/* ──────────────────────────────────────────────────────────────────────────
 * Atividade no GitHub para a secao "Telemetria de codigo".
 *
 * - Calendario de contribuicoes: github-contributions-api.jogruber.de, que
 *   le o grafico publico do perfil e nao exige token (a API oficial so
 *   entrega esse calendario pela GraphQL, que pede autenticacao).
 * - Perfil e repositorios: API REST do GitHub. GITHUB_TOKEN e opcional;
 *   sem ele o limite e de 60 requisicoes por hora, o que basta com o cache.
 *
 * - Radio de commits: os ultimos commits dos repositorios com push mais
 *   recente. A API de eventos parou de mandar as mensagens dos pushes, entao
 *   as mensagens vem da lista de commits de cada repositorio.
 *
 * Tudo roda no servidor com cache de uma hora. Falha vira null.
 * ────────────────────────────────────────────────────────────────────────── */

import { githubHiddenRepos, githubPrivateSources, githubUser } from "@/data/profile";

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
/** `data` e ISO 8601, data de autoria. Commit privado chega sem mensagem nem link. */
export type CommitRecente =
  | {
      id: string;
      privado: false;
      repositorio: string;
      /** Primeira linha da mensagem. */
      mensagem: string;
      data: string;
      url: string;
    }
  | { id: string; privado: true; rotulo: string; data: string };

type ApiPerfil = { public_repos: number; followers: number; html_url: string };
type ApiRepo = {
  name: string;
  full_name: string;
  fork: boolean;
  language: string | null;
  stargazers_count: number;
};
type ApiCommit = {
  sha: string;
  html_url: string;
  parents: { sha: string }[];
  commit: { message: string; author: { date: string } | null };
};

/* Radio de commits: quantos repositorios consultar, quantos commits pegar de
   cada um (assim um repositorio muito ativo nao ocupa a faixa toda) e quantos
   entram na faixa. */
const REPOS_NO_RADIO = 6;
const COMMITS_POR_REPO = 4;
const COMMITS_NO_RADIO = 12;
/* Commits privados entram no maximo nesta quantidade, para nao tomarem a faixa. */
const PRIVADOS_NO_RADIO = 4;

function cabecalhosGitHub(token = process.env.GITHUB_TOKEN): HeadersInit {
  const cabecalhos: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-albuquerquee",
  };
  if (token) cabecalhos.Authorization = `Bearer ${token}`;
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

export async function buscarCommitsRecentes(): Promise<CommitRecente[] | null> {
  const [publicos, privados] = await Promise.all([
    buscarCommitsPublicos(),
    buscarCommitsPrivados(),
  ]);
  const commits = [...(publicos ?? []), ...privados.slice(0, PRIVADOS_NO_RADIO)]
    .sort((a, b) => b.data.localeCompare(a.data))
    .slice(0, COMMITS_NO_RADIO);
  return commits.length ? commits : null;
}

/**
 * Commits em organizacoes privadas (githubPrivateSources), lidos com
 * GITHUB_PRIVATE_TOKEN. Daqui so saem rotulo e horario: mensagem, nome do
 * repositorio, sha e link ficam no servidor. Sem token, nada aparece.
 */
async function buscarCommitsPrivados(): Promise<CommitRecente[]> {
  const token = process.env.GITHUB_PRIVATE_TOKEN;
  if (!token) return [];
  const usuario = githubUser;

  const porFonte = await Promise.allSettled(
    githubPrivateSources.map(async (fonte) => {
      const repos = await buscarJson<ApiRepo[]>(
        `https://api.github.com/orgs/${fonte.owner}/repos?sort=pushed&per_page=${REPOS_NO_RADIO}`,
        cabecalhosGitHub(token),
      );
      const porRepo = await Promise.allSettled(
        repos.map((repo) =>
          buscarJson<ApiCommit[]>(
            `https://api.github.com/repos/${repo.full_name}/commits?author=${usuario}&per_page=${COMMITS_POR_REPO * 2}`,
            cabecalhosGitHub(token),
          ),
        ),
      );
      return porRepo.flatMap((r) =>
        r.status === "fulfilled"
          ? r.value
              .flatMap((c) =>
                c.parents.length < 2 && c.commit.author
                  ? [{ rotulo: fonte.label, data: c.commit.author.date }]
                  : [],
              )
              .slice(0, COMMITS_POR_REPO)
          : [],
      );
    }),
  );

  const falhas = porFonte.filter((r) => r.status === "rejected");
  if (falhas.length) console.error("[github] falha nos commits privados:", falhas);

  return porFonte
    .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
    .sort((a, b) => b.data.localeCompare(a.data))
    .map<CommitRecente>((c, i) => ({
      id: `privado-${i}`,
      privado: true,
      rotulo: c.rotulo,
      data: c.data,
    }));
}

async function buscarCommitsPublicos(): Promise<CommitRecente[] | null> {
  const usuario = githubUser;
  try {
    // Mesma URL da telemetria: o cache do fetch serve as duas secoes.
    const repos = await buscarJson<ApiRepo[]>(
      `https://api.github.com/users/${usuario}/repos?per_page=100&sort=pushed`,
      cabecalhosGitHub(),
    );
    const recentes = repos
      .filter((r) => !r.fork && !githubHiddenRepos.includes(r.name))
      .slice(0, REPOS_NO_RADIO);

    /* Repositorio vazio responde 409: ele fica sem commits, sem derrubar os outros.
       Pede alguns a mais porque os merges saem da lista. */
    const porRepo = await Promise.allSettled(
      recentes.map(async (repo) => {
        const commits = await buscarJson<ApiCommit[]>(
          `https://api.github.com/repos/${repo.full_name}/commits?author=${usuario}&per_page=${COMMITS_POR_REPO * 2}`,
          cabecalhosGitHub(),
        );
        return commits
          .flatMap<CommitRecente>((c) =>
            c.parents.length < 2 && c.commit.author
              ? [
                  {
                    id: c.sha,
                    privado: false,
                    repositorio: repo.name,
                    mensagem: c.commit.message.split("\n")[0].trim(),
                    data: c.commit.author.date,
                    url: c.html_url,
                  },
                ]
              : [],
          )
          .slice(0, COMMITS_POR_REPO);
      }),
    );

    return porRepo.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
  } catch (erro) {
    console.error("[github] falha ao buscar commits:", erro);
    return null;
  }
}
