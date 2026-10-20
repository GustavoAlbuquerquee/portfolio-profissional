import { classNames } from "@/lib/format";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
}) {
  return (
    <div className={classNames("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <p className="text-accent mb-2 font-mono text-xs font-semibold tracking-[0.18em] uppercase">
          {eyebrow}
        </p>
      ) : null}
      <Tag
        className={classNames(
          "text-fg font-semibold tracking-tight text-balance",
          Tag === "h1" ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl",
        )}
      >
        {title}
      </Tag>
      {subtitle ? (
        <p className="text-muted mt-3 text-base leading-relaxed text-pretty sm:text-lg">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
