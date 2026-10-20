import type { Localized } from "@/i18n/types";

/* ──────────────────────────────────────────────────────────────────────────
 * EDITE AQUI: todos os dados pessoais do portfolio ficam neste arquivo.
 * Nenhum componente tem texto pessoal "hardcoded".
 * ────────────────────────────────────────────────────────────────────────── */

export const profile = {
  name: "Gustavo Albuquerque",
  /** Usado no <title>, no rodape e no formulario de contato. */
  shortName: "Gustavo",
  initials: "GA",
  role: {
    pt: "Desenvolvedor Full Stack · Estudante de Engenharia de Software",
    en: "Full Stack Developer · Software Engineering Student",
  } satisfies Localized,
  location: {
    pt: "Belo Horizonte, Minas Gerais — Brasil",
    en: "Belo Horizonte, Minas Gerais — Brazil",
  } satisfies Localized,
  availability: {
    pt: "Aberto a novas oportunidades",
    en: "Open to new opportunities",
  } satisfies Localized,
  /** Foto de perfil opcional em /public/img. Deixe null para usar as iniciais. */
  avatar: "/img/perfil.jpg" as string | null,
  /** Curriculo opcional em /public. Deixe null para esconder o botao. */
  resume: null as string | null,

  headline: {
    pt: "Transformo ideias em produtos web e mobile completos — do wireframe ao deploy.",
    en: "I turn ideas into complete web and mobile products — from wireframe to deploy.",
  } satisfies Localized,

  /** Biografia: cada item vira um paragrafo na secao "Sobre Mim". */
  bio: {
    pt: [
      "Sou desenvolvedor full stack e estudante de Engenharia de Software na PUC Minas, no 2º período. Entrei na área pelo curso técnico do COTEMIG e, desde setembro de 2024, trabalho em produtos reais — hoje como Full Stack Software Engineer na LITS, onde desenvolvo um aplicativo mobile para tenistas desde a fase inicial do produto.",
      "No front-end trabalho com React, Next.js e TypeScript; no mobile, com React Native e Flutter; no back-end, com Node.js, NestJS e Go, sobre PostgreSQL e Supabase. Já passei por um smart checkout de pagamentos, por um blog financeiro em produção e pelo ecossistema mobile de um app de conexões fitness — cada um com um gargalo diferente, de conversão a performance.",
      "Tenho interesse particular por automação e integração de sistemas. Construí fluxos no n8n que fazem a triagem do atendimento pelo WhatsApp e um agente conversacional que consulta e atualiza a planilha de clientes e cursos de uma escola, respondendo aos alunos sem intervenção manual da equipe.",
      "Na faculdade trabalho mais perto da arquitetura: modelagem em camadas, separação de responsabilidades e dependências explícitas. Meu objetivo é evoluir nessa direção — arquitetura de software e sistemas inteligentes — mantendo as práticas que já levo para o time: Clean Code, code review e documentação.",
    ],
    en: [
      "I'm a full stack developer and a Software Engineering student at PUC Minas, currently in my 2nd semester. I came into the field through the technical course at COTEMIG and, since September 2024, I've been working on real products — today as a Full Stack Software Engineer at LITS, where I build a mobile app for tennis players from the product's earliest phase.",
      "On the front-end I work with React, Next.js and TypeScript; on mobile, with React Native and Flutter; on the back-end, with Node.js, NestJS and Go, over PostgreSQL and Supabase. I've worked on a smart payments checkout, a finance blog in production and the mobile ecosystem of a fitness connections app — each with a different bottleneck, from conversion to performance.",
      "I'm particularly drawn to automation and systems integration. I've built n8n flows that triage customer support over WhatsApp, and a conversational agent that reads and updates a school's client and course spreadsheet to answer students with no manual work from the team.",
      "At university I work closer to architecture: layered modelling, separation of concerns and explicit dependencies. My goal is to grow in that direction — software architecture and intelligent systems — while keeping the practices I already bring to a team: Clean Code, code review and documentation.",
    ],
  } satisfies Localized<string[]>,

  /** Cards de destaque da home. */
  highlights: [
    {
      value: "2 anos",
      label: { pt: "De experiência profissional", en: "Of professional experience" },
    },
    {
      value: "5",
      label: { pt: "Empresas onde atuei", en: "Companies I have worked for" },
    },
    {
      value: "PT / EN",
      label: { pt: "Idiomas de trabalho", en: "Working languages" },
    },
  ] satisfies { value: string; label: Localized }[],

  /** Dados usados no rodape e nas paginas de contato. */
  education: {
    institution: "PUC Minas",
    course: { pt: "Engenharia de Software", en: "Software Engineering" },
    period: "2026 — 2029",
  },
} as const;

export type SocialKey = "email" | "whatsapp" | "linkedin" | "github" | "instagram";

export type SocialLink = {
  key: SocialKey;
  label: string;
  /** Texto visivel ao lado do icone. */
  value: string;
  href: string;
  /** Mostrado no card de contato. */
  description: Localized;
};

/* EDITE AQUI: troque os usuarios/numeros pelos seus. */
export const socials: SocialLink[] = [
  {
    key: "email",
    label: "E-mail",
    value: "gustavoalbuquerque807@gmail.com",
    href: "mailto:gustavoalbuquerque807@gmail.com",
    description: {
      pt: "Melhor canal para assuntos profissionais e oportunidades.",
      en: "Best channel for professional matters and opportunities.",
    },
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    value: "+55 (31) 99795-6359",
    href: "https://wa.me/5531997956359",
    description: {
      pt: "Para conversas rápidas e alinhamentos de projeto.",
      en: "For quick conversations and project alignment.",
    },
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    value: "/in/gustavo-albuquerque-6574402b4",
    href: "https://www.linkedin.com/in/gustavo-albuquerque-6574402b4",
    description: {
      pt: "Trajetória acadêmica, certificações e rede profissional.",
      en: "Academic background, certifications and professional network.",
    },
  },
  {
    key: "github",
    label: "GitHub",
    value: "@GustavoAlbuquerquee",
    href: "https://github.com/GustavoAlbuquerquee",
    description: {
      pt: "Código dos projetos, contribuições e estudos.",
      en: "Project source code, contributions and studies.",
    },
  },
  {
    key: "instagram",
    label: "Instagram",
    value: "@gustavo_albuuquerque",
    href: "https://www.instagram.com/gustavo_albuuquerque",
    description: {
      pt: "Bastidores dos projetos e da rotina de estudos.",
      en: "Behind the scenes of my projects and study routine.",
    },
  },
];

export const githubUser = "GustavoAlbuquerquee";
