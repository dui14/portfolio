import { ArrowUpRight, PlayCircle } from "lucide-react";

import type { Project } from "../../domain/project.ts";
import { useLanguage } from "../../context/useLanguage.ts";
import { projectPath } from "../../features/projects/projectQueries.ts";
import { socialIcons } from "../../lib/icons.tsx";
import { AppLink } from "../ui/AppLink.tsx";

type ProjectActionsProps = {
  project: Project;
  withDetails?: boolean;
  className?: string;
};

const GithubIcon = socialIcons.Github;

const ACTION_CLASS =
  "inline-flex min-h-11 items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-full)] px-[var(--space-5)] py-[var(--space-2)] text-sm font-medium transition-all duration-[var(--dur-fast)] active:scale-[0.98] motion-safe:hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]";
const PRIMARY_CLASS = `${ACTION_CLASS} bg-[var(--accent)] text-on-accent hover:shadow-[var(--shadow-md)]`;
const SECONDARY_CLASS = `${ACTION_CLASS} border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-2)]`;

export function ProjectActions({
  project,
  withDetails = false,
  className = "",
}: ProjectActionsProps) {
  const { language, t } = useLanguage();
  const { links, title } = project;

  return (
    <div className={`flex flex-wrap gap-[var(--space-3)] ${className}`}>
      {withDetails && (
        <AppLink
          href={projectPath(project.id)}
          lang={language}
          aria-label={t.projects.detailsOf.replace("{title}", title)}
          className={PRIMARY_CLASS}
        >
          {t.projects.details}
        </AppLink>
      )}
      {links.live && (
        <a
          href={links.live}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.projects.openLiveOf.replace("{title}", title)}
          className={withDetails ? SECONDARY_CLASS : PRIMARY_CLASS}
        >
          {t.projects.live}
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      )}
      {links.github && (
        <a
          href={links.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.projects.viewOnGithub.replace("{title}", title)}
          className={SECONDARY_CLASS}
        >
          <GithubIcon className="h-4 w-4" aria-hidden="true" />
          {t.projects.github}
        </a>
      )}
      {links.video && (
        <a
          href={links.video}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.projects.watchVideoOf.replace("{title}", title)}
          className={SECONDARY_CLASS}
        >
          <PlayCircle className="h-4 w-4" aria-hidden="true" />
          {t.projects.video}
        </a>
      )}
    </div>
  );
}
