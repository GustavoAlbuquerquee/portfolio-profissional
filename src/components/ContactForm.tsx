"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CircleAlert, CircleCheck, LoaderCircle, Send } from "lucide-react";
import { useI18n } from "@/context/I18nProvider";
import { LIMITS } from "@/lib/contact-schema";
import { socials } from "@/data/profile";
import { classNames } from "@/lib/format";

type FormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
  /** Honeypot anti-spam: invisivel para pessoas. */
  website: string;
};

type Status = "idle" | "sending" | "success" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function ContactForm() {
  const { t } = useI18n();
  const [status, setStatus] = useState<Status>("idle");
  const [messageLength, setMessageLength] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: { name: "", email: "", subject: "", message: "", website: "" },
  });

  // Registrado fora do JSX para encadear o `onChange` do react-hook-form
  // com o contador de caracteres.
  const messageField = register("message", {
    required: t.contact.required,
    minLength: { value: LIMITS.message.min, message: t.contact.minChars(LIMITS.message.min) },
    maxLength: { value: LIMITS.message.max, message: t.contact.maxChars(LIMITS.message.max) },
  });

  async function onSubmit(values: FormValues) {
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      setStatus("success");
      reset();
      setMessageLength(0);
    } catch {
      // Em hospedagem estatica (sem API Route) o envio cai para o cliente de e-mail.
      const mailto = socials.find((item) => item.key === "email")?.href;
      if (mailto) {
        const body = `${values.message}\n\n---\n${values.name} <${values.email}>`;
        const href = `${mailto}?subject=${encodeURIComponent(
          values.subject,
        )}&body=${encodeURIComponent(body)}`;
        // `mailto:` abre o cliente de e-mail do usuário — é um destino externo,
        // não uma rota da aplicação.
        window.open(href, "_self");
      }
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t.contact.name} htmlFor="name" error={errors.name?.message}>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder={t.contact.namePlaceholder}
            aria-invalid={Boolean(errors.name)}
            className={inputClass(Boolean(errors.name))}
            {...register("name", {
              required: t.contact.required,
              minLength: { value: LIMITS.name.min, message: t.contact.minChars(LIMITS.name.min) },
              maxLength: { value: LIMITS.name.max, message: t.contact.maxChars(LIMITS.name.max) },
            })}
          />
        </Field>

        <Field label={t.contact.email} htmlFor="email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={t.contact.emailPlaceholder}
            aria-invalid={Boolean(errors.email)}
            className={inputClass(Boolean(errors.email))}
            {...register("email", {
              required: t.contact.required,
              pattern: { value: EMAIL_PATTERN, message: t.contact.invalidEmail },
            })}
          />
        </Field>
      </div>

      <Field label={t.contact.subject} htmlFor="subject" error={errors.subject?.message}>
        <input
          id="subject"
          type="text"
          placeholder={t.contact.subjectPlaceholder}
          aria-invalid={Boolean(errors.subject)}
          className={inputClass(Boolean(errors.subject))}
          {...register("subject", {
            required: t.contact.required,
            minLength: {
              value: LIMITS.subject.min,
              message: t.contact.minChars(LIMITS.subject.min),
            },
            maxLength: {
              value: LIMITS.subject.max,
              message: t.contact.maxChars(LIMITS.subject.max),
            },
          })}
        />
      </Field>

      <Field
        label={t.contact.message}
        htmlFor="message"
        error={errors.message?.message}
        hint={t.contact.charactersLeft(Math.max(LIMITS.message.max - messageLength, 0))}
      >
        <textarea
          id="message"
          rows={6}
          placeholder={t.contact.messagePlaceholder}
          aria-invalid={Boolean(errors.message)}
          className={classNames(inputClass(Boolean(errors.message)), "resize-y")}
          {...messageField}
          onChange={(event) => {
            setMessageLength(event.target.value.length);
            return messageField.onChange(event);
          }}
        />
      </Field>

      {/* Honeypot: fora da tela e ignorado por leitores de tela. */}
      <div className="absolute left-[-9999px]" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-accent hover:bg-accent-2 inline-flex items-center gap-2 rounded px-5 py-2.5 text-sm font-semibold text-on-accent pressable disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "sending" ? (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <Send className="h-4 w-4" aria-hidden />
          )}
          {status === "sending" ? t.contact.sending : t.contact.send}
        </button>

        <p aria-live="polite" className="text-sm">
          {status === "success" ? (
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
              <CircleCheck className="h-4 w-4" aria-hidden />
              {t.contact.success}
            </span>
          ) : null}
          {status === "error" ? (
            <span className="inline-flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-400">
              <CircleAlert className="h-4 w-4" aria-hidden />
              {t.contact.error}
            </span>
          ) : null}
        </p>
      </div>
    </form>
  );
}

function inputClass(hasError: boolean) {
  return classNames(
    "border-line bg-surface-2 text-fg placeholder:text-muted/70 w-full rounded border px-3.5 py-2.5 text-sm pressable",
    "focus:border-accent focus:outline-none",
    hasError && "border-red-500/70",
  );
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="text-fg text-sm font-medium">
          {label}
        </label>
        {hint ? <span className="text-muted font-mono text-xs">{hint}</span> : null}
      </div>
      {children}
      {error ? (
        <p role="alert" className="mt-1.5 text-xs font-medium text-red-500">
          {error}
        </p>
      ) : null}
    </div>
  );
}
