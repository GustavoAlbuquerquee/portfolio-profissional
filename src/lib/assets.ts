/**
 * Prefixa caminhos da pasta /public com o basePath da aplicacao.
 *
 * Necessario apenas na exportacao estatica para o GitHub Pages, em que o site
 * fica servido sob /nome-do-repositorio. Em Vercel, Render ou localmente o
 * basePath e vazio e a funcao devolve o caminho original.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string) {
  return `${basePath}${path}`;
}
