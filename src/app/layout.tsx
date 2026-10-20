import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { I18nProvider } from "@/context/I18nProvider";
import { ThemeProvider, themeInitScript } from "@/context/ThemeProvider";
import { profile } from "@/data/profile";

const inter = Inter({
  variable: "--font-inter",
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
    { media: "(prefers-color-scheme: light)", color: "#f6f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#070a13" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans flex min-h-full flex-col">
        <ThemeProvider>
          <I18nProvider>
            <a
              href="#conteudo"
              className="bg-accent sr-only rounded-lg px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60]"
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
