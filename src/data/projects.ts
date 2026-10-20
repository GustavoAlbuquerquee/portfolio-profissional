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
  /** Opcional: projetos de cliente sem codigo publico nao exibem o botao. */
  repository?: string;
  demo?: string;
  /** Imagem ou GIF do projeto em funcionamento (pasta /public/projects). */
  image: string;
};

/* ──────────────────────────────────────────────────────────────────────────
 * Projetos reais, ordenados do mais antigo para o mais recente.
 * Para trocar a imagem, coloque o arquivo em /public/projects e
 * aponte `image` para ele (ex.: "/projects/meu-projeto.gif").
 * ────────────────────────────────────────────────────────────────────────── */
export const projects: Project[] = [
  {
    id: "primor-moveis",
    name: "Primor Móveis Planejados",
    startDate: "2025-05",
    endDate: "2026-09",
    category: "web",
    featured: true,
    description: {
      pt: "Site institucional e atendimento automatizado por WhatsApp para uma marcenaria de móveis planejados. O projeto uniu presença digital e captação de leads: a vitrine atrai o cliente e a automação faz a triagem da conversa antes de passar o contato para a equipe.",
      en: "Institutional website and automated WhatsApp support for a custom furniture workshop. The project combined digital presence with lead generation: the storefront attracts the client and the automation triages the conversation before handing the contact to the team.",
    },
    highlights: {
      pt: [
        "Fluxos de atendimento automatizado no n8n integrados à API do WhatsApp",
        "Site institucional focado em captação de leads, publicado na Vercel",
        "Configuração de domínio próprio, hospedagem e monitoramento do fluxo",
      ],
      en: [
        "Automated support flows built in n8n and wired to the WhatsApp API",
        "Lead-oriented institutional website deployed on Vercel",
        "Custom domain setup, hosting and monitoring of the automation flow",
      ],
    },
    technologies: ["React", "TypeScript", "Tailwind CSS", "n8n", "Vercel"],
    repository: "https://github.com/GustavoAlbuquerquee/primor-moveis",
    image: "/projects/primor-moveis.svg",
  },
  {
    id: "arquiteck",
    name: "Arquiteck",
    startDate: "2026-04",
    endDate: null,
    category: "web",
    featured: true,
    description: {
      pt: "CRM feito sob medida para marcenarias. Nasceu da experiência com a Primor: o atendimento automatizado trazia os leads, mas faltava um lugar para acompanhar orçamento, projeto e produção de cada cliente até a entrega.",
      en: "A CRM built specifically for custom furniture workshops. It grew out of the Primor project: automated support brought the leads in, but there was no single place to track each client from quote and design through to delivery.",
    },
    highlights: {
      pt: [
        "Cadastro de clientes e acompanhamento de orçamentos por estágio do funil",
        "Modelagem do fluxo de produção específico de marcenaria, do projeto à entrega",
        "Interface em TypeScript construída com componentes reaproveitáveis",
      ],
      en: [
        "Client records and quote tracking across each stage of the pipeline",
        "Modelling of the furniture-making workflow, from design to delivery",
        "TypeScript interface built around reusable components",
      ],
    },
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
    repository: "https://github.com/GustavoAlbuquerquee/Arquiteck",
    image: "/projects/arquiteck.svg",
  },
  {
    id: "estagi-on",
    name: "Estagi.ON",
    startDate: "2026-04",
    endDate: "2026-06",
    category: "academic",
    description: {
      pt: "Plataforma web de gestão de vagas de estágio, criada como projeto acadêmico de Engenharia de Software para aproximar estudantes e recrutadores. O trabalho cobriu da prototipação das telas à implementação da navegação e dos papéis de acesso.",
      en: "Web platform for internship vacancy management, built as a Software Engineering coursework project to connect students and recruiters. The work spanned screen prototyping through to navigation and access-role implementation.",
    },
    highlights: {
      pt: [
        "Wireframes de alta fidelidade e arquitetura de navegação das telas no Figma",
        "Controle de acesso com papéis distintos de estudante e recrutador",
        "Organização das tarefas de desenvolvimento com issues no GitHub",
      ],
      en: [
        "High-fidelity wireframes and screen navigation architecture in Figma",
        "Access control with separate student and recruiter roles",
        "Development tasks organised through GitHub issues",
      ],
    },
    technologies: ["React", "TypeScript", "Figma", "GitHub"],
    image: "/projects/estagi-on.svg",
  },
  {
    id: "yesalyle",
    name: "Yesalyle",
    startDate: "2026-07",
    endDate: "2026-09",
    category: "web",
    featured: true,
    description: {
      pt: "Modernização do site da Yesalyle e criação de um agente conversacional que atende os alunos pelo WhatsApp. O agente consulta e atualiza a planilha de clientes e cursos em tempo real, respondendo dúvidas sem intervenção manual da equipe.",
      en: "Modernisation of the Yesalyle website plus a conversational agent that serves students over WhatsApp. The agent reads and updates the client and course spreadsheet in real time, answering questions with no manual work from the team.",
    },
    highlights: {
      pt: [
        "Agente conversacional no WhatsApp que lê e grava na planilha de clientes e cursos",
        "Redesign e reconstrução do site institucional, com foco em performance",
        "Orquestração das integrações no n8n, eliminando o atendimento manual repetitivo",
      ],
      en: [
        "WhatsApp conversational agent that reads from and writes to the client and course spreadsheet",
        "Redesign and rebuild of the institutional website, focused on performance",
        "Integrations orchestrated in n8n, removing repetitive manual support work",
      ],
    },
    technologies: ["React", "TypeScript", "n8n", "REST APIs", "Vercel"],
    image: "/projects/yesalyle.svg",
  },
  {
    id: "vitalis",
    name: "Vitalis",
    startDate: "2026-09",
    endDate: null,
    category: "academic",
    description: {
      pt: "Sistema de Informação Hospitalar desenvolvido como trabalho prático de Programação Modular na PUC Minas. O foco do projeto é arquitetural: separar o sistema em camadas com responsabilidades bem definidas e dependências explícitas.",
      en: "Hospital Information System built as the practical assignment for Modular Programming at PUC Minas. The focus is architectural: splitting the system into layers with well-defined responsibilities and explicit dependencies.",
    },
    highlights: {
      pt: [
        "Arquitetura modular em camadas, com fronteiras explícitas entre domínio e infraestrutura",
        "Modelagem das entidades hospitalares e das regras de atendimento",
        "Código em TypeScript organizado para ser testável e extensível por módulo",
      ],
      en: [
        "Layered modular architecture with explicit boundaries between domain and infrastructure",
        "Modelling of hospital entities and patient-care rules",
        "TypeScript codebase organised to be testable and extensible module by module",
      ],
    },
    technologies: ["TypeScript", "Node.js", "Arquitetura em camadas"],
    repository: "https://github.com/GustavoAlbuquerquee/vitalis",
    image: "/projects/vitalis.svg",
  },
  {
    id: "portfolio-profissional",
    name: "Portfólio Profissional",
    startDate: "2026-09",
    endDate: null,
    category: "web",
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
