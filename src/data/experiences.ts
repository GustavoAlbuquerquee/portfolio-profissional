import type { Localized } from "@/i18n/types";

export type ExperienceType =
  | "job"
  | "internship"
  | "freelance"
  | "opensource"
  | "event"
  | "academic";

export type Experience = {
  id: string;
  organization: string;
  role: Localized;
  type: ExperienceType;
  /** ISO AAAA-MM. `end` nulo significa "até o momento". */
  start: string;
  end: string | null;
  location: Localized;
  description: Localized;
  achievements: Localized<string[]>;
  technologies?: string[];
  url?: string;
};

/* EDITE AQUI: substitua pelas suas experiências reais. */
export const experiences: Experience[] = [
  {
    id: "puc-liga-dev",
    organization: "PUC Minas — Liga de Desenvolvimento",
    role: { pt: "Membro / Desenvolvedor", en: "Member / Developer" },
    type: "academic",
    start: "2025-03",
    end: null,
    location: { pt: "Belo Horizonte, MG (presencial)", en: "Belo Horizonte, Brazil (on-site)" },
    description: {
      pt: "Participação em grupo de estudos e projetos práticos de desenvolvimento web, com encontros semanais de pair programming e apresentações técnicas.",
      en: "Member of a study group focused on hands-on web development projects, with weekly pair programming sessions and technical talks.",
    },
    achievements: {
      pt: [
        "Desenvolvimento de dois projetos internos usando React e Node.js",
        "Apresentação técnica sobre versionamento com Git e fluxo de pull requests",
        "Mentoria informal para colegas de períodos iniciais",
      ],
      en: [
        "Built two internal projects using React and Node.js",
        "Gave a technical talk on Git versioning and the pull request workflow",
        "Informal mentoring for students in earlier semesters",
      ],
    },
    technologies: ["React", "Node.js", "Git"],
  },
  {
    id: "freela-landing",
    organization: "Freelance",
    role: { pt: "Desenvolvedor Front-end", en: "Front-end Developer" },
    type: "freelance",
    start: "2025-07",
    end: "2025-10",
    location: { pt: "Remoto", en: "Remote" },
    description: {
      pt: "Criação de landing pages e sites institucionais para pequenos negócios locais, do levantamento de requisitos ao deploy e à entrega do domínio configurado.",
      en: "Built landing pages and institutional websites for small local businesses, from requirements gathering to deployment and domain setup.",
    },
    achievements: {
      pt: [
        "Três sites entregues com pontuação acima de 90 no Lighthouse",
        "Integração de formulários de contato com envio de e-mail",
        "Treinamento dos clientes para manutenção básica do conteúdo",
      ],
      en: [
        "Three websites delivered with Lighthouse scores above 90",
        "Contact form integration with e-mail delivery",
        "Trained clients to handle basic content maintenance",
      ],
    },
    technologies: ["HTML5", "CSS3", "JavaScript", "Vercel"],
  },
  {
    id: "opensource",
    organization: "Open Source",
    role: { pt: "Colaborador", en: "Contributor" },
    type: "opensource",
    start: "2025-09",
    end: null,
    location: { pt: "Remoto", en: "Remote" },
    description: {
      pt: "Contribuições pontuais em projetos open source da comunidade brasileira, principalmente em documentação, correção de bugs e tradução de conteúdo técnico.",
      en: "Occasional contributions to open source projects from the Brazilian community, mostly documentation, bug fixes and technical content translation.",
    },
    achievements: {
      pt: [
        "Pull requests aceitos em repositórios de conteúdo educacional",
        "Tradução de trechos de documentação técnica para português",
        "Participação em discussões de issues e revisão de PRs de terceiros",
      ],
      en: [
        "Pull requests merged into educational content repositories",
        "Translated sections of technical documentation into Portuguese",
        "Took part in issue discussions and reviewed third-party PRs",
      ],
    },
    technologies: ["Git", "GitHub", "Markdown"],
  },
  {
    id: "hackathon",
    organization: "Hackathon PUC Minas",
    role: { pt: "Participante — equipe de 4 pessoas", en: "Participant — team of 4" },
    type: "event",
    start: "2026-04",
    end: "2026-04",
    location: { pt: "Belo Horizonte, MG", en: "Belo Horizonte, Brazil" },
    description: {
      pt: "Maratona de desenvolvimento de 36 horas com o desafio de criar uma solução digital para acessibilidade urbana.",
      en: "A 36-hour development marathon with the challenge of building a digital solution for urban accessibility.",
    },
    achievements: {
      pt: [
        "Protótipo funcional entregue dentro do prazo, com front-end e API integrados",
        "Responsável pela interface e pela integração com a API de mapas",
        "Apresentação do projeto para banca de avaliadores",
      ],
      en: [
        "Working prototype delivered on time, with integrated front-end and API",
        "Responsible for the interface and the maps API integration",
        "Pitched the project to a panel of judges",
      ],
    },
    technologies: ["React", "TypeScript", "REST APIs"],
  },
];

export function sortExperiences(list: Experience[]) {
  // Mais recentes primeiro (padrao de curriculo).
  return [...list].sort((a, b) => (b.end ?? "9999-99").localeCompare(a.end ?? "9999-99"));
}
