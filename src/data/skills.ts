import type { Localized } from "@/i18n/types";

export type SkillGroup = {
  id: string;
  title: Localized;
  items: string[];
};

/* EDITE AQUI: suas tecnologias e ferramentas. */
export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    title: { pt: "Front-end", en: "Front-end" },
    items: ["HTML5", "CSS3", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS"],
  },
  {
    id: "backend",
    title: { pt: "Back-end", en: "Back-end" },
    items: ["Node.js", "Express", "REST APIs", "Java", "Python"],
  },
  {
    id: "data",
    title: { pt: "Dados", en: "Data" },
    items: ["PostgreSQL", "MySQL", "Prisma", "SQL", "Docker Compose"],
  },
  {
    id: "tools",
    title: { pt: "Ferramentas & Práticas", en: "Tools & Practices" },
    items: ["Git", "GitHub", "Docker", "Figma", "Scrum", "CI/CD", "Vercel"],
  },
];
