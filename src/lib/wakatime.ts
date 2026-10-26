/* ──────────────────────────────────────────────────────────────────────────
 * Tempo de programacao dos ultimos 7 dias, vindo do WakaTime.
 *
 * A chave secreta da conta (WAKATIME_API_KEY) fica so no servidor, como
 * variavel de ambiente na Vercel, e vai no cabecalho Basic. Sem a chave a
 * funcao devolve null e a secao simplesmente nao aparece: nada de painel
 * vazio para o visitante.
 * ────────────────────────────────────────────────────────────────────────── */

const UMA_HORA = 3600;

export type LinguagemWaka = { nome: string; percentual: number; texto: string };

export type PainelWakaTime = {
  totalTexto: string;
  mediaDiariaTexto: string;
  linguagens: LinguagemWaka[];
  editores: string[];
};

type ApiItem = { name: string; percent: number; text: string; total_seconds: number };
type ApiStats = {
  data: {
    human_readable_total?: string;
    human_readable_daily_average?: string;
    total_seconds?: number;
    languages?: ApiItem[];
    editors?: ApiItem[];
  };
};

export async function buscarPainelWakaTime(): Promise<PainelWakaTime | null> {
  const chave = process.env.WAKATIME_API_KEY;
  if (!chave) return null;

  try {
    const resposta = await fetch("https://wakatime.com/api/v1/users/current/stats/last_7_days", {
      headers: { Authorization: `Basic ${Buffer.from(chave).toString("base64")}` },
      next: { revalidate: UMA_HORA },
      signal: AbortSignal.timeout(10_000),
    });
    /* 202 = o WakaTime ainda esta calculando; trata como "sem dados por ora". */
    if (resposta.status !== 200) return null;

    const { data } = (await resposta.json()) as ApiStats;
    if (!data?.total_seconds) return null;

    return {
      totalTexto: data.human_readable_total ?? "",
      mediaDiariaTexto: data.human_readable_daily_average ?? "",
      linguagens: (data.languages ?? [])
        .filter((l) => l.total_seconds >= 60)
        .slice(0, 6)
        .map((l) => ({ nome: l.name, percentual: l.percent, texto: l.text })),
      editores: (data.editors ?? []).slice(0, 3).map((e) => e.name),
    };
  } catch (erro) {
    console.error("[wakatime] falha ao buscar dados:", erro);
    return null;
  }
}
