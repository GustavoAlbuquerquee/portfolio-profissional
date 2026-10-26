import { buscarPainelF1 } from "@/lib/f1";
import { PitWallView } from "./PitWallView";

/**
 * Secao "Box ao vivo". Componente de servidor: busca os dados da ultima
 * corrida antes de a pagina chegar ao navegador (com cache de uma hora) e
 * entrega para a visualizacao, que roda no cliente por causa do idioma.
 */
export async function PitWall() {
  const painel = await buscarPainelF1();
  return <PitWallView painel={painel} />;
}
