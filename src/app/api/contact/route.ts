import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { contactSchema } from "@/lib/contact-schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Rate limit simples em memoria: 5 envios por IP a cada 10 minutos. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_REQUESTS;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": "600" } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation_error", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  // Honeypot preenchido: responde 200 sem enviar nada (nao avisa o bot).
  if (parsed.data.website) {
    return NextResponse.json({ ok: true, delivered: false });
  }

  const { name, email, subject, message } = parsed.data;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.CONTACT_TO ?? user;

  if (!host || !user || !pass || !to) {
    // SMTP nao configurado: o front-end cai para o fallback mailto.
    console.warn("[contact] SMTP nao configurado — defina SMTP_HOST, SMTP_USER, SMTP_PASS.");
    return NextResponse.json({ ok: false, error: "smtp_not_configured" }, { status: 503 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"Portfólio — ${name}" <${user}>`,
      to,
      replyTo: `${name} <${email}>`,
      subject: `[Portfólio] ${subject}`,
      text: `Nome: ${name}\nE-mail: ${email}\nAssunto: ${subject}\n\n${message}`,
      html: `
        <div style="font-family:system-ui,-apple-system,sans-serif;line-height:1.6;color:#101428">
          <h2 style="margin:0 0 16px">Nova mensagem pelo portfólio</h2>
          <p style="margin:0 0 4px"><strong>Nome:</strong> ${escapeHtml(name)}</p>
          <p style="margin:0 0 4px"><strong>E-mail:</strong> ${escapeHtml(email)}</p>
          <p style="margin:0 0 16px"><strong>Assunto:</strong> ${escapeHtml(subject)}</p>
          <div style="padding:16px;background:#f1f3f9;border-radius:8px;white-space:pre-wrap">${escapeHtml(
            message,
          )}</div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true, delivered: true });
  } catch (error) {
    console.error("[contact] Falha ao enviar e-mail:", error);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
}
