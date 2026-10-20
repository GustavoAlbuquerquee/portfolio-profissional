import { z } from "zod";

/** Regras compartilhadas entre o formulario (cliente) e a API (servidor). */
export const LIMITS = {
  name: { min: 3, max: 80 },
  subject: { min: 3, max: 120 },
  message: { min: 10, max: 1200 },
} as const;

export const contactSchema = z.object({
  name: z.string().trim().min(LIMITS.name.min).max(LIMITS.name.max),
  email: z.string().trim().email().max(160),
  subject: z.string().trim().min(LIMITS.subject.min).max(LIMITS.subject.max),
  message: z.string().trim().min(LIMITS.message.min).max(LIMITS.message.max),
  /**
   * Campo honeypot: preenchido apenas por bots.
   * Aceito pelo schema de propósito — quem decide o que fazer é a API Route,
   * que responde 200 sem enviar nada para não revelar a armadilha.
   */
  website: z.string().max(200).optional(),
});

export type ContactPayload = z.infer<typeof contactSchema>;
