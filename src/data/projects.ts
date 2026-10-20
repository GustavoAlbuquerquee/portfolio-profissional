import type { Localized } from "@/i18n/types";

export type ProjectCategory = "web" | "mobile" | "api" | "academic";

export type Project = {
  id: string;
  name: string;
  /** Usado para ordenar a linha do tempo (ISO: AAAA-MM). */
  startDate: string;
  endDate: string | null;
  category: ProjectCategory;
  featured?: boolean;
  description: Localized;
  /** Pontos de destaque exibidos no card. */
  highlights: Localized<string[]>;
  technologies: string[];
  repository: string;
  demo?: string;
  /** Imagem ou GIF do projeto em funcionamento (pasta /public/projects). */
  image: string;
};

/* ──────────────────────────────────────────────────────────────────────────
 * EDITE AQUI: substitua pelos seus projetos reais.
 * Para trocar a imagem, coloque o arquivo em /public/projects e
 * aponte `image` para ele (ex.: "/projects/meu-projeto.gif").
 * ────────────────────────────────────────────────────────────────────────── */
export const projects: Project[] = [
  {
    id: "jogo-da-memoria",
    name: "Jogo da Memória Web",
    startDate: "2025-03",
    endDate: "2025-04",
    category: "web",
    description: {
      pt: "Primeiro projeto autoral: um jogo da memória jogável no navegador, construído apenas com HTML, CSS e JavaScript puro para fixar manipulação de DOM, eventos e lógica de estado.",
      en: "My first personal project: a browser-based memory game built with plain HTML, CSS and JavaScript to practise DOM manipulation, events and state logic.",
    },
    highlights: {
      pt: [
        "Três níveis de dificuldade com embaralhamento aleatório das cartas",
        "Contador de jogadas, cronômetro e ranking salvo em localStorage",
        "Layout responsivo com CSS Grid, sem nenhuma dependência externa",
      ],
      en: [
        "Three difficulty levels with randomised card shuffling",
        "Move counter, timer and a leaderboard stored in localStorage",
        "Responsive CSS Grid layout with zero external dependencies",
      ],
    },
    technologies: ["HTML5", "CSS3", "JavaScript", "LocalStorage"],
    repository: "https://github.com/GustavoAlbuquerquee/jogo-da-memoria",
    image: "/projects/jogo-da-memoria.svg",
  },
  {
    id: "api-biblioteca",
    name: "API de Biblioteca",
    startDate: "2025-05",
    endDate: "2025-07",
    category: "api",
    description: {
      pt: "API REST para gestão de acervo de uma biblioteca, com cadastro de livros, usuários e controle de empréstimos. Projeto usado para estudar modelagem de dados, camadas de serviço e autenticação.",
      en: "REST API for managing a library collection, with book and user registration plus loan control. Built to study data modelling, service layers and authentication.",
    },
    highlights: {
      pt: [
        "CRUD completo com validação de entrada e tratamento centralizado de erros",
        "Autenticação com JWT e controle de acesso por papel (admin / leitor)",
        "Modelagem relacional com PostgreSQL e migrations versionadas",
      ],
      en: [
        "Full CRUD with input validation and centralised error handling",
        "JWT authentication and role-based access control (admin / reader)",
        "Relational modelling with PostgreSQL and versioned migrations",
      ],
    },
    technologies: ["Node.js", "Express", "PostgreSQL", "JWT", "Docker"],
    repository: "https://github.com/GustavoAlbuquerquee/api-biblioteca",
    image: "/projects/api-biblioteca.svg",
  },
  {
    id: "dashboard-financeiro",
    name: "Dashboard Financeiro",
    startDate: "2025-08",
    endDate: "2025-11",
    category: "web",
    featured: true,
    description: {
      pt: "Aplicação de controle de despesas pessoais com dashboard de indicadores, categorização automática de lançamentos e relatórios mensais exportáveis.",
      en: "Personal expense tracking application with an indicator dashboard, automatic transaction categorisation and exportable monthly reports.",
    },
    highlights: {
      pt: [
        "Gráficos interativos de evolução de gastos por categoria e período",
        "Importação de extratos em CSV com reconciliação de lançamentos",
        "Tela de login, sessão persistente e tema claro/escuro",
      ],
      en: [
        "Interactive charts of spending by category and period",
        "CSV statement import with transaction reconciliation",
        "Login screen, persistent session and light/dark theme",
      ],
    },
    technologies: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Prisma"],
    repository: "https://github.com/GustavoAlbuquerquee/dashboard-financeiro",
    image: "/projects/dashboard-financeiro.svg",
  },
  {
    id: "sistema-agendamento",
    name: "Sistema de Agendamento",
    startDate: "2026-02",
    endDate: "2026-06",
    category: "academic",
    featured: true,
    description: {
      pt: "Projeto interdisciplinar da PUC Minas: plataforma de agendamento de atendimentos com painel administrativo, notificações por e-mail e controle de disponibilidade por profissional.",
      en: "Interdisciplinary project at PUC Minas: an appointment scheduling platform with an admin panel, e-mail notifications and per-professional availability control.",
    },
    highlights: {
      pt: [
        "Calendário com bloqueio de horários conflitantes em tempo real",
        "Papéis de cliente, profissional e administrador com permissões distintas",
        "Desenvolvido em equipe com Scrum, code review e integração contínua",
      ],
      en: [
        "Calendar with real-time blocking of conflicting time slots",
        "Client, professional and administrator roles with distinct permissions",
        "Built as a team using Scrum, code review and continuous integration",
      ],
    },
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Vercel"],
    repository: "https://github.com/GustavoAlbuquerquee/sistema-agendamento",
    image: "/projects/sistema-agendamento.svg",
  },
  {
    id: "portfolio-profissional",
    name: "Portfólio Profissional",
    startDate: "2026-09",
    endDate: null,
    category: "web",
    featured: true,
    description: {
      pt: "Este site. Portfólio bilíngue (português/inglês) com linha do tempo de projetos, seção de experiências e formulário de contato com envio real de e-mail, hospedado na nuvem.",
      en: "This website. A bilingual (Portuguese/English) portfolio with a project timeline, an experience section and a contact form with real e-mail delivery, hosted in the cloud.",
    },
    highlights: {
      pt: [
        "Internacionalização PT/EN com troca instantânea e preferência persistida",
        "Tema claro/escuro, design responsivo e navegação acessível por teclado",
        "Formulário com validação e back-end próprio em API Route (Nodemailer)",
      ],
      en: [
        "PT/EN internationalisation with instant switching and persisted preference",
        "Light/dark theme, responsive design and accessible keyboard navigation",
        "Validated contact form with its own API Route back-end (Nodemailer)",
      ],
    },
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Nodemailer"],
    repository: "https://github.com/GustavoAlbuquerquee/portfolio-profissional",
    image: "/projects/portfolio-profissional.svg",
  },
];

/** Linha do tempo pedida pelo PO: do mais antigo para o mais recente. */
export function sortProjects(list: Project[], order: "asc" | "desc" = "asc") {
  return [...list].sort((a, b) =>
    order === "asc"
      ? a.startDate.localeCompare(b.startDate)
      : b.startDate.localeCompare(a.startDate),
  );
}
