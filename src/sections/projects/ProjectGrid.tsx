import { useLanguage } from "../../context/useLanguage.ts";
import { projects } from "../../data/projects.ts";
import { ProjectCard } from "./ProjectCard.tsx";

export function ProjectGrid() {
  const { t } = useLanguage();

  if (projects.length === 0) {
    return (
      <div className="py-[var(--space-16)] text-center text-[var(--muted)]">
        <p className="text-lg">{t.projects.empty}</p>
        <p className="mt-[var(--space-2)] text-sm">{t.projects.emptyHint}</p>
      </div>
    );
  }

  const [featured, ...rest] = projects;

  return (
    <div className="flex flex-col gap-[var(--space-6)] md:gap-[var(--space-8)]">
      <ProjectCard project={featured} featured />
      {rest.length > 0 && (
        <div className="grid grid-cols-1 gap-[var(--space-6)] md:grid-cols-2 md:gap-[var(--space-8)]">
          {rest.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
