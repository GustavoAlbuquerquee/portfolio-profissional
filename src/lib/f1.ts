/* ──────────────────────────────────────────────────────────────────────────
 * Dados de Formula 1 para a secao "Box ao vivo".
 *
 * Fonte: Jolpica F1 API (https://api.jolpi.ca), sucessora publica do Ergast.
 * Nao exige chave. A busca roda no servidor, com cache de uma hora: a pagina
 * continua estatica e rapida, e o visitante nunca espera a API externa.
 * Qualquer falha devolve null e a interface mostra um aviso, sem quebrar.
 * ────────────────────────────────────────────────────────────────────────── */

const BASE = "https://api.jolpi.ca/ergast/f1";
const UMA_HORA = 3600;

export type F1Resultado = {
  posicao: number;
  codigo: string;
  piloto: string;
  equipe: string;
  equipeId: string;
  largada: number;
  pontos: number;
  /** Tempo total do vencedor ou diferenca para ele; null quando nao terminou na volta do lider. */
  tempo: string | null;
  /** Voltas atras do vencedor (0 quando terminou na mesma volta). */
  voltasAtras: number;
  abandonou: boolean;
  voltaMaisRapida: boolean;
};

export type F1Classificacao = {
  posicao: number;
  piloto: string;
  equipe: string;
  equipeId: string;
  pontos: number;
  vitorias: number;
};

export type F1Painel = {
  corrida: {
    nome: string;
    circuito: string;
    local: string;
    data: string;
    rodada: number;
    temporada: string;
  };
  resultados: F1Resultado[];
  classificacao: F1Classificacao[];
};

/* Formatos minimos do que a API devolve, so com os campos usados. */
type ApiPiloto = { code?: string; givenName: string; familyName: string };
type ApiEquipe = { constructorId: string; name: string };
type ApiResultado = {
  position: string;
  grid: string;
  points: string;
  laps: string;
  status: string;
  Driver: ApiPiloto;
  Constructor: ApiEquipe;
  Time?: { time: string };
  FastestLap?: { rank?: string };
};
type ApiCorrida = {
  season: string;
  round: string;
  raceName: string;
  date: string;
  Circuit: { circuitName: string; Location: { locality: string; country: string } };
  Results: ApiResultado[];
};
type ApiPosicaoPiloto = {
  position: string;
  points: string;
  wins: string;
  Driver: ApiPiloto;
  Constructors: ApiEquipe[];
};

async function buscar<T>(caminho: string): Promise<T> {
  const resposta = await fetch(`${BASE}${caminho}`, {
    next: { revalidate: UMA_HORA },
    signal: AbortSignal.timeout(8000),
  });
  if (!resposta.ok) throw new Error(`F1 API ${resposta.status} em ${caminho}`);
  return resposta.json() as Promise<T>;
}

const nomeCompleto = (p: ApiPiloto) => `${p.givenName} ${p.familyName}`;
const codigoPiloto = (p: ApiPiloto) => (p.code ?? p.familyName.slice(0, 3)).toUpperCase();

export async function buscarPainelF1(): Promise<F1Painel | null> {
  try {
    const [ultima, campeonato] = await Promise.all([
      buscar<{ MRData: { RaceTable: { Races: ApiCorrida[] } } }>("/current/last/results.json"),
      buscar<{
        MRData: { StandingsTable: { StandingsLists: { DriverStandings: ApiPosicaoPiloto[] }[] } };
      }>("/current/driverStandings.json"),
    ]);

    const corrida = ultima.MRData.RaceTable.Races[0];
    const posicoes = campeonato.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? [];
    if (!corrida) return null;

    const voltasDoLider = Number(corrida.Results[0]?.laps ?? 0);

    const resultados: F1Resultado[] = corrida.Results.slice(0, 10).map((r) => {
      const voltas = Number(r.laps);
      return {
        posicao: Number(r.position),
        codigo: codigoPiloto(r.Driver),
        piloto: nomeCompleto(r.Driver),
        equipe: r.Constructor.name,
        equipeId: r.Constructor.constructorId,
        largada: Number(r.grid),
        pontos: Number(r.points),
        tempo: r.Time?.time ?? null,
        voltasAtras: r.Time ? 0 : Math.max(0, voltasDoLider - voltas),
        abandonou: r.status === "Retired",
        voltaMaisRapida: r.FastestLap?.rank === "1",
      };
    });

    const classificacao: F1Classificacao[] = posicoes.slice(0, 5).map((p) => ({
      posicao: Number(p.position),
      piloto: nomeCompleto(p.Driver),
      equipe: p.Constructors[0]?.name ?? "",
      equipeId: p.Constructors[0]?.constructorId ?? "",
      pontos: Number(p.points),
      vitorias: Number(p.wins),
    }));

    return {
      corrida: {
        nome: corrida.raceName,
        circuito: corrida.Circuit.circuitName,
        local: `${corrida.Circuit.Location.locality}, ${corrida.Circuit.Location.country}`,
        data: corrida.date,
        rodada: Number(corrida.round),
        temporada: corrida.season,
      },
      resultados,
      classificacao,
    };
  } catch (erro) {
    console.error("[f1] falha ao buscar dados:", erro);
    return null;
  }
}
