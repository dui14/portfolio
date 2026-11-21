import { motion } from "motion/react";

import { AppLink } from "../../components/ui/AppLink.tsx";
import { ProjectActions } from "../../components/project/ProjectActions.tsx";
import { ProjectResults } from "../../components/project/ProjectResults.tsx";
import { ProjectVisual } from "../../components/project/ProjectVisual.tsx";
import { useLanguage } from "../../context/useLanguage.ts";
import type { Project } from "../../domain/project.ts";
import { projectPath } from "../../features/projects/projectQueries.ts";
import { useReducedMotion } from "../../hooks/useReducedMotion.ts";
import { useScrollReveal } from "../../hooks/useScrollReveal.ts";
import { revealVariants } from "../../lib/motion.ts";

type ProjectCardProps = {
  project: Project;
  featured?: boolean;
};

const CARD_RESULTS = 2;

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const { ref, isInView } = useScrollReveal({ amount: 0.15 });
  const reducedMotion = useReducedMotion();
  const { language } = useLanguage();
  const titleId = `${project.id}-title`;

  return (
    <motion.article
      ref={ref as never}
      variants={reducedMotion ? undefined : revealVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      aria-labelledby={titleId}
      className={`group flex min-w-0 flex-col gap-[var(--space-6)] rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-[var(--space-4)] transition-[box-shadow,translate] duration-[var(--dur-base)] ease-[var(--ease-out)] hover:shadow-[var(--shadow-lg)] motion-safe:hover:-translate-y-0.5 md:p-[var(--space-5)] ${
        featured ? "lg:grid lg:grid-cols-12 lg:items-center lg:gap-[var(--space-10)]" : ""
      }`}
    >
      <div className={`flex min-w-0 flex-col ${featured ? "lg:col-span-7" : "flex-1"}`}>
        <ProjectVisual
          project={project}
          frameClassName={featured ? "" : "flex flex-1 flex-col justify-center"}
        />
      </div>

      <div
        className={`flex min-w-0 flex-col gap-[var(--space-5)] ${
          featured ? "lg:col-span-5" : ""
        }`}
      >
        <div className="flex flex-col gap-[var(--space-2)]">
          <h3
            id={titleId}
            className="text-h2 font-bold tracking-[-0.02em] md:text-h1"
          >
            <AppLink
              href={projectPath(project.id)}
              className="rounded-[var(--radius-sm)] decoration-[var(--accent)] decoration-2 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
            >
              {project.title}
            </AppLink>
          </h3>
          <p lang={language} className="text-base text-[var(--muted)]">
            {project.summary[language]}
          </p>
        </div>

        <ProjectResults
          results={project.results.slice(0, CARD_RESULTS)}
          size="compact"
          className="border-y border-[var(--border)] py-[var(--space-4)]"
        />

        <ProjectActions project={project} withDetails className="mt-auto" />
      </div>
    </motion.article>
  );
}
