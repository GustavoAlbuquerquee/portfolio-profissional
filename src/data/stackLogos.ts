/* ──────────────────────────────────────────────────────────────────────────
 * Logo de cada tecnologia do globo de stacks.
 * Os SVGs vem do Simple Icons (dominio publico, CC0) e ficam em
 * /public/stack. Praticas e conceitos sem marca usam um icone do Lucide.
 * A chave e o nome exatamente como aparece em src/data/skills.ts.
 * ────────────────────────────────────────────────────────────────────────── */

export type StackIconKind = "network" | "database" | "repeat" | "kanban" | "branch";

export type StackLogo =
  | { type: "logo"; src: string }
  | { type: "icon"; icon: StackIconKind };

export const stackLogos: Record<string, StackLogo> = {
  HTML5: { type: "logo", src: "/stack/html5.svg" },
  CSS3: { type: "logo", src: "/stack/css.svg" },
  JavaScript: { type: "logo", src: "/stack/javascript.svg" },
  TypeScript: { type: "logo", src: "/stack/typescript.svg" },
  React: { type: "logo", src: "/stack/react.svg" },
  "Next.js": { type: "logo", src: "/stack/nextdotjs.svg" },
  "Tailwind CSS": { type: "logo", src: "/stack/tailwindcss.svg" },
  "React Native": { type: "logo", src: "/stack/react.svg" },
  Flutter: { type: "logo", src: "/stack/flutter.svg" },
  Dart: { type: "logo", src: "/stack/dart.svg" },
  "Node.js": { type: "logo", src: "/stack/nodedotjs.svg" },
  NestJS: { type: "logo", src: "/stack/nestjs.svg" },
  Go: { type: "logo", src: "/stack/go.svg" },
  WordPress: { type: "logo", src: "/stack/wordpress.svg" },
  PostgreSQL: { type: "logo", src: "/stack/postgresql.svg" },
  Supabase: { type: "logo", src: "/stack/supabase.svg" },
  Git: { type: "logo", src: "/stack/git.svg" },
  GitHub: { type: "logo", src: "/stack/github.svg" },
  Vercel: { type: "logo", src: "/stack/vercel.svg" },
  n8n: { type: "logo", src: "/stack/n8n.svg" },
  Figma: { type: "logo", src: "/stack/figma.svg" },
  "REST APIs": { type: "icon", icon: "network" },
  SQL: { type: "icon", icon: "database" },
  Scrum: { type: "icon", icon: "repeat" },
  Kanban: { type: "icon", icon: "kanban" },
  "Git Flow": { type: "icon", icon: "branch" },
};
