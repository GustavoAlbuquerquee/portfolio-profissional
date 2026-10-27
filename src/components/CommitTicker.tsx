import { buscarCommitsRecentes } from "@/lib/github";
import { CommitTickerView } from "./CommitTickerView";

/**
 * Radio do box: os ultimos commits publicos rolando numa faixa logo abaixo
 * do heroi. Componente de servidor, com cache de uma hora; se o GitHub nao
 * responder, a faixa simplesmente nao aparece.
 */
export async function CommitTicker() {
  const commits = await buscarCommitsRecentes();
  if (!commits) return null;  return <CommitTickerView commits={commits} />;
}
