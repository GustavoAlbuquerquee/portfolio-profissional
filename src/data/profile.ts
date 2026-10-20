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
    pt: "Estudante de Engenharia de Software · Desenvolvedor Full Stack",
    en: "Software Engineering Student · Full Stack Developer",
  } satisfies Localized,
  location: {
    pt: "Belo Horizonte, Minas Gerais — Brasil",
    en: "Belo Horizonte, Minas Gerais — Brazil",
  } satisfies Localized,
  availability: {
    pt: "Aberto a estágios e projetos",
    en: "Open to internships and projects",
  } satisfies Localized,
  /** Foto de perfil opcional em /public/img. Deixe null para usar as iniciais. */
  avatar: null as string | null,
  /** Curriculo opcional em /public. Deixe null para esconder o botao. */
  resume: null as string | null,

  headline: {
    pt: "Transformo ideias em aplicações web completas — do wireframe ao deploy.",
    en: "I turn ideas into complete web applications — from wireframe to deploy.",
  } satisfies Localized,

  /** Biografia: cada item vira um paragrafo na secao "Sobre Mim". */
  bio: {
    pt: [
      "Sou estudante de Engenharia de Software na PUC Minas, atualmente no 2º período, e desenvolvedor com foco em aplicações web. Meu interesse pela área começou pela curiosidade de entender como os sistemas que uso todos os dias são construídos — e hoje esse interesse virou prática diária de código.",
      "Trabalho principalmente com o ecossistema JavaScript/TypeScript: React e Next.js no front-end, Node.js no back-end, além de bancos relacionais e versionamento com Git. Gosto de cuidar da experiência do usuário tanto quanto da arquitetura: interfaces acessíveis, responsivas e código organizado, testável e fácil de manter.",
      "Tenho interesse particular por arquitetura de software, integração de APIs, automação e boas práticas de engenharia (code review, CI/CD, documentação). Também valorizo trabalho em equipe e metodologias ágeis, que pratico nos laboratórios e projetos da faculdade.",
      "Meu objetivo profissional é atuar como desenvolvedor full stack em um time que entregue produtos de impacto real, evoluindo em arquitetura e engenharia de plataforma, e contribuindo com projetos open source ao longo do caminho.",
    ],
    en: [
      "I'm a Software Engineering student at PUC Minas, currently in my 2nd semester, and a developer focused on web applications. My interest in the field started from the curiosity of understanding how the systems I use every day are built — and today that curiosity has become daily coding practice.",
      "I work mainly within the JavaScript/TypeScript ecosystem: React and Next.js on the front-end, Node.js on the back-end, plus relational databases and version control with Git. I care about user experience as much as about architecture: accessible, responsive interfaces backed by organised, testable and maintainable code.",
      "I'm particularly interested in software architecture, API integration, automation and engineering best practices (code review, CI/CD, documentation). I also value teamwork and agile methodologies, which I practise in university labs and projects.",
      "My professional goal is to work as a full stack developer in a team that ships products with real impact, growing in architecture and platform engineering, and contributing to open source projects along the way.",
    ],
  } satisfies Localized<string[]>,

  /** Cards de destaque da home. */
  highlights: [
    {
      value: "2º",
      label: { pt: "Período em Engenharia de Software", en: "Semester in Software Engineering" },
    },
    {
      value: "5+",
      label: { pt: "Projetos desenvolvidos", en: "Projects built" },
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
    period: "2025 — 2029",
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
    value: "+55 (31) 90000-0000",
    href: "https://wa.me/5531900000000",
    description: {
      pt: "Para conversas rápidas e alinhamentos de projeto.",
      en: "For quick conversations and project alignment.",
    },
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    value: "/in/seu-usuario",
    href: "https://www.linkedin.com/in/seu-usuario",
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
];

export const githubUser = "GustavoAlbuquerquee";
