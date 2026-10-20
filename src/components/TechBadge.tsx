export function TechBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="border-line bg-surface-2 text-muted inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-xs font-medium">
      {children}
    </span>
  );
}
