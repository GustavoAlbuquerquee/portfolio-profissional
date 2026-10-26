import { buscarPainelGitHub } from "@/lib/github";
import { buscarPainelWakaTime } from "@/lib/wakatime";
import { CodeTelemetryView } from "./CodeTelemetryView";

/**
 * Secao "Telemetria de codigo". Componente de servidor: busca GitHub e
 * WakaTime em paralelo, com cache de uma hora, e entrega para a
 * visualizacao no cliente (que depende do idioma ativo).
 */
export async function CodeTelemetry() {
  const [github, wakatime] = await Promise.all([buscarPainelGitHub(), buscarPainelWakaTime()]);
  return <CodeTelemetryView github={github} wakatime={wakatime} />;
}
