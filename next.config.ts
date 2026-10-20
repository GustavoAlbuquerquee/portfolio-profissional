import type { NextConfig } from "next";

/**
 * Build padrao (Vercel / Render / local): aplicacao Next completa,
 * com a API route /api/contact ativa.
 *
 * Build estatico (GitHub Pages): defina GITHUB_PAGES=true e
 * GITHUB_PAGES_BASE_PATH=/nome-do-repositorio.
 */
const isStaticExport = process.env.GITHUB_PAGES === "true";
const basePath = process.env.GITHUB_PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Exposto ao cliente para prefixar assets de /public (ver src/lib/assets.ts).
  // O basePath do Next cobre rotas e chunks, mas nao o `src` de imagens estaticas.
  env: { NEXT_PUBLIC_BASE_PATH: isStaticExport ? basePath : "" },
  ...(isStaticExport
    ? {
        output: "export",
        trailingSlash: true,
        basePath,
        assetPrefix: basePath || undefined,
        images: { unoptimized: true },
      }
    : {}),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
