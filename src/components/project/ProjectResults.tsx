import type { ProjectResult } from "../../domain/project.ts";
import { useLanguage } from "../../context/useLanguage.ts";

type ProjectResultsProps = {
  results: ProjectResult[];
  size?: "compact" | "full";
  className?: string;
};

export function ProjectResults({
  results,
  size = "full",
  className = "",
}: ProjectResultsProps) {
  const { language, t } = useLanguage();

  if (results.length === 0) return null;

  const valueClass =
    size === "full"
      ? "text-h2 md:text-h1 font-bold tracking-[-0.02em]"
      : "text-h3 font-bold tracking-[-0.02em]";

  return (
    <dl
      aria-label={t.projects.results}
      className={`grid grid-cols-2 gap-x-[var(--space-6)] gap-y-[var(--space-5)] ${className}`}
    >
      {results.map((result) => (
        <div key={result.value + result.label.en} className="flex min-w-0 flex-col">
          <dt className={`break-words text-[var(--accent-text)] ${valueClass}`}>
            {result.value}
          </dt>
          <dd className="text-xs text-[var(--muted)]">{result.label[language]}</dd>
        </div>
      ))}
    </dl>
  );
}
