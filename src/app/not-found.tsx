"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/Container";
import { useI18n } from "@/context/I18nProvider";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <Container className="grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <p className="text-accent font-mono text-6xl font-bold">404</p>
        <h1 className="text-fg mt-4 text-2xl font-semibold tracking-tight">{t.notFound.title}</h1>
        <p className="text-muted mt-2 text-sm">{t.notFound.description}</p>
        <Link
          href="/"
          className="bg-accent hover:bg-accent-2 mt-8 inline-flex items-center gap-2 rounded px-5 py-2.5 text-sm font-semibold text-on-accent transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t.notFound.back}
        </Link>
      </div>
    </Container>
  );
}
