import { classNames } from "@/lib/format";

export function Container({
  children,
  className,
  id,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: "div" | "section" | "header" | "footer" | "main" | "nav";
}) {
  return (
    <Tag id={id} className={classNames("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </Tag>
  );
}
