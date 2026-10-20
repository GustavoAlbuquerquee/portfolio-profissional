import type { Localized } from "@/i18n/types";

export type SkillGroup = {
  id: string;
  title: Localized;
  items: string[];
};

/* Tecnologias e ferramentas usadas no dia a dia, agrupadas por area. */
export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    title: { pt: "Front-end", en: "Front-end" },
    items: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
    ],
  },
  {
    id: "mobile",
    title: { pt: "Mobile", en: "Mobile" },
    items: ["React Native", "Flutter", "Dart"],
  },
  {
    id: "backend",
    title: { pt: "Back-end", en: "Back-end" },
    items: ["Node.js", "NestJS", "Go", "REST APIs", "WordPress"],
  },
  {
    id: "data",
    title: { pt: "Dados", en: "Data" },
    items: ["PostgreSQL", "Supabase", "SQL"],
  },
  {
    id: "tools",
    title: { pt: "Ferramentas & Práticas", en: "Tools & Practices" },
    items: ["Git", "GitHub", "Vercel", "n8n", "Figma", "Scrum", "Kanban", "Git Flow"],
  },
];
