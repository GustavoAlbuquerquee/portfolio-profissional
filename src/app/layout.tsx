import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { I18nProvider } from "@/context/I18nProvider";
import { ThemeProvider, themeInitScript } from "@/context/ThemeProvider";
import { profile } from "@/data/profile";

/* Titulos e numeros grandes: grotesca tecnica, com personalidade de painel. */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

/* Corpo de texto: neutra e legivel nos paragrafos longos da biografia. */
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${profile.name} — ${profile.role.pt}`,
    template: `%s · ${profile.name}`,
  },
  description: profile.headline.pt,
  keywords: [
    profile.name,
    "portfólio",
    "portfolio",
    "desenvolvedor",
    "engenharia de software",
    "PUC Minas",
    "Next.js",
    "React",
    "TypeScript",
  ],
  authors: [{ name: profile.name }],
  openGraph: {
    type: "website",
    title: `${profile.name} — ${profile.role.pt}`,
    description: profile.headline.pt,
    locale: "pt_BR",
    alternateLocale: "en_US",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f4f2" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0c" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geist.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans flex min-h-full flex-col">
        <ThemeProvider>
          <I18nProvider>
            <a
              href="#conteudo"
              className="bg-accent text-on-accent sr-only rounded px-4 py-2 text-sm font-semibold focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60]"
            >
              Pular para o conteúdo / Skip to content
            </a>
            <Header />
            <main id="conteudo" className="flex-1">
              {children}
            </main>
            <Footer />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
