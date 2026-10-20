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

/* ──────────────────────────────────────────────────────────────────────────
 * Experiências profissionais, da mais antiga para a mais recente.
 * A ordenação de exibição fica em `sortExperiences`, no fim do arquivo.
 * ────────────────────────────────────────────────────────────────────────── */
export const experiences: Experience[] = [
  {
    id: "utua",
    organization: "Utua",
    role: { pt: "Estagiário de Desenvolvimento Web", en: "Web Development Intern" },
    type: "internship",
    start: "2024-09",
    end: "2025-04",
    location: { pt: "Belo Horizonte, MG (presencial)", en: "Belo Horizonte, Brazil (on-site)" },
    description: {
      pt: "Primeira experiência no mercado de trabalho, aplicando na prática o que aprendi no COTEMIG. Atuei no desenvolvimento web do UTUA, um blog financeiro, trabalhando em um ambiente de produção real com tráfego de leitores.",
      en: "My first experience in the job market, putting into practice what I learned at COTEMIG. I worked on the web development of UTUA, a personal finance blog, in a real production environment with live readership.",
    },
    achievements: {
      pt: [
        "Evolução de páginas e componentes do blog em produção, sem interromper a publicação",
        "Manutenção e customização do WordPress, integrando conteúdo e front-end",
        "Primeiro contato com versionamento, revisão de código e rotina de equipe",
      ],
      en: [
        "Evolved live blog pages and components without interrupting publishing",
        "Maintained and customised WordPress, integrating content and front-end",
        "First exposure to version control, code review and team routine",
      ],
    },
    technologies: ["JavaScript", "TypeScript", "React", "WordPress", "Node.js"],
  },
  {
    id: "assiny",
    organization: "Assiny",
    role: { pt: "Software Engineer", en: "Software Engineer" },
    type: "job",
    start: "2025-04",
    end: "2025-09",
    location: { pt: "Belo Horizonte, MG (presencial)", en: "Belo Horizonte, Brazil (on-site)" },
    description: {
      pt: "Desenvolvimento front-end de funcionalidades para a Assiny, um smart checkout de pagamentos. Foi o primeiro projeto em que atuei em contato direto com o cliente, participando das decisões de produto e não apenas da implementação.",
      en: "Front-end development of features for Assiny, a smart payments checkout. This was the first project where I worked directly with the client, taking part in product decisions rather than only implementation.",
    },
    achievements: {
      pt: [
        "Criação e evolução de interfaces de checkout com foco em usabilidade e performance",
        "Atuação direta junto ao cliente no levantamento e refinamento de requisitos",
        "Cuidado com fluxo de pagamento, onde cada passo a mais custa conversão",
      ],
      en: [
        "Built and evolved checkout interfaces focused on usability and performance",
        "Worked directly with the client gathering and refining requirements",
        "Careful attention to the payment flow, where every extra step costs conversion",
      ],
    },
    technologies: ["React", "JavaScript", "TypeScript", "CSS3"],
  },
  {
    id: "begrowth",
    organization: "BeGrowth",
    role: {
      pt: "Estagiário de Desenvolvimento Front-end",
      en: "Front-end Development Intern",
    },
    type: "internship",
    start: "2025-08",
    end: "2026-01",
    location: { pt: "Belo Horizonte, MG", en: "Belo Horizonte, Brazil" },
    description: {
      pt: "Apoio ao desenvolvimento front-end do produto, com construção de telas, correção de bugs e acompanhamento da equipe técnica em demandas contínuas de interface.",
      en: "Support work on the product front-end, building screens, fixing bugs and following the technical team through a continuous stream of interface tasks.",
    },
    achievements: {
      pt: [
        "Entrega contínua de telas e ajustes de interface acompanhada pela equipe técnica",
        "Correção de bugs de front-end com investigação da causa, não apenas do sintoma",
        "Consolidação da base em React e TypeScript em ritmo de time de produto",
      ],
      en: [
        "Steady delivery of screens and interface fixes alongside the technical team",
        "Front-end bug fixing that investigated root causes, not just symptoms",
        "Consolidated my React and TypeScript foundation at product-team pace",
      ],
    },
    technologies: ["HTML5", "CSS3", "JavaScript", "React"],
  },
  {
    id: "nextletter",
    organization: "Nextletter Holdings",
    role: { pt: "Software Engineer", en: "Software Engineer" },
    type: "job",
    start: "2025-12",
    end: "2026-05",
    location: { pt: "Belo Horizonte, MG (híbrido)", en: "Belo Horizonte, Brazil (hybrid)" },
    description: {
      pt: "Desenvolvimento front-end de interfaces modernas com React e TypeScript, somado à construção de automações internas no n8n que integram ferramentas e APIs para reduzir trabalho manual da equipe.",
      en: "Front-end development of modern interfaces with React and TypeScript, alongside internal automations built in n8n that integrate tools and APIs to cut down the team's manual work.",
    },
    achievements: {
      pt: [
        "Automações no n8n integrando ferramentas internas e APIs, otimizando processos repetitivos",
        "Gerenciamento de dados com Supabase, da modelagem ao consumo pelo front-end",
        "Foco constante em performance e Clean Code na base de código do produto",
      ],
      en: [
        "n8n automations integrating internal tools and APIs, streamlining repetitive processes",
        "Data management with Supabase, from modelling through to front-end consumption",
        "Consistent focus on performance and Clean Code across the product codebase",
      ],
    },
    technologies: ["React", "TypeScript", "n8n", "Supabase", "REST APIs"],
  },
  {
    id: "gymatch",
    organization: "Gymatch",
    role: { pt: "Full Stack Software Engineer", en: "Full Stack Software Engineer" },
    type: "job",
    start: "2026-03",
    end: "2026-05",
    location: { pt: "São Paulo, SP (remoto)", en: "São Paulo, Brazil (remote)" },
    description: {
      pt: "Atuação no desenvolvimento e na evolução do ecossistema mobile da Gymatch, um aplicativo de conexões no nicho fitness. Desenvolvimento de features em React Native, integração com APIs e contribuição direta na experiência do usuário.",
      en: "Development and evolution of Gymatch's mobile ecosystem, a connections app in the fitness niche. Feature development in React Native, API integration and direct contribution to the user experience.",
    },
    achievements: {
      pt: [
        "Features em React Native entregues no ecossistema mobile do aplicativo",
        "Integração do app com as APIs do back-end e tratamento dos estados de carregamento e erro",
        "Contribuição direta em decisões de experiência do usuário, e não só de implementação",
      ],
      en: [
        "React Native features shipped across the app's mobile ecosystem",
        "Integrated the app with back-end APIs, handling loading and error states",
        "Direct contribution to user-experience decisions, not just implementation",
      ],
    },
    technologies: ["React Native", "React", "TypeScript", "REST APIs"],
  },
  {
    id: "lits",
    organization: "LITS — Live the Standard",
    role: { pt: "Full Stack Software Engineer", en: "Full Stack Software Engineer" },
    type: "job",
    start: "2026-05",
    end: null,
    location: { pt: "Belo Horizonte, MG (híbrido)", en: "Belo Horizonte, Brazil (hybrid)" },
    description: {
      pt: "Desenvolvimento de um aplicativo mobile para tenistas, atuando desde a fase inicial do produto. Contribuo na arquitetura, no desenvolvimento de features e na evolução da plataforma com Flutter.",
      en: "Development of a mobile application for tennis players, involved since the product's earliest phase. I contribute to the architecture, feature development and the evolution of the platform with Flutter.",
    },
    achievements: {
      pt: [
        "Participação nas decisões de arquitetura do aplicativo desde a fase inicial do produto",
        "Desenvolvimento de features em Flutter e evolução contínua da plataforma",
        "Trabalho em produto novo, onde cada escolha técnica define o que vem depois",
      ],
      en: [
        "Took part in the app's architecture decisions from the product's earliest phase",
        "Feature development in Flutter and continuous evolution of the platform",
        "Work on a greenfield product, where each technical choice shapes what follows",
      ],
    },
    technologies: ["Flutter", "Dart", "REST APIs", "Git"],
  },
];

export function sortExperiences(list: Experience[]) {
  // Mais recentes primeiro (padrao de curriculo).
  return [...list].sort((a, b) => (b.end ?? "9999-99").localeCompare(a.end ?? "9999-99"));
}
