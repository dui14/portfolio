import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { ProjectActions } from "../../components/project/ProjectActions.tsx";
import { ProjectResults } from "../../components/project/ProjectResults.tsx";
import { ProjectVisual } from "../../components/project/ProjectVisual.tsx";
import { AppLink } from "../../components/ui/AppLink.tsx";
import { Container } from "../../components/ui/Container.tsx";
import { useLanguage } from "../../context/useLanguage.ts";
import { getImage } from "../../data/media.ts";
import { formatPageTitle } from "../../domain/blog.ts";
import type { Project } from "../../domain/project.ts";
import { findGroup, postPath } from "../../features/blog/postQueries.ts";
import { usePageMeta } from "../../features/blog/usePageMeta.ts";
import {
  findProject,
  getAdjacentProjects,
  projectPath,
} from "../../features/projects/projectQueries.ts";
import { NotFoundPage } from "../blog/NotFoundPage.tsx";
import { ProjectGallery } from "./ProjectGallery.tsx";

type ProjectDetailPageProps = {
  id: string;
};

type DetailSectionProps = {
  id: string;
  title: ReactNode;
  children: ReactNode;
};

const TEXT_LINK_CLASS =
  "inline-flex min-h-11 items-center gap-[var(--space-2)] rounded-[var(--radius-sm)] text-sm font-medium text-[var(--accent-text)] underline decoration-transparent decoration-2 underline-offset-4 transition-colors duration-[var(--dur-fast)] hover:decoration-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]";

const CHIP_CLASS =
  "rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-[var(--space-3)] py-[var(--space-1)] font-mono text-xs text-[var(--text)]";

export function ProjectDetailPage({ id }: ProjectDetailPageProps) {
  const project = findProject(id);

  if (!project) return <NotFoundPage />;

  return <ProjectView key={project.id} project={project} />;
}

function DetailSection({ id, title, children }: DetailSectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      aria-labelledby={headingId}
      className="grid grid-cols-1 gap-[var(--space-4)] border-t border-[var(--border)] pt-[var(--space-8)] md:grid-cols-12 md:gap-[var(--space-8)]"
    >
      <h2
        id={headingId}
        className="font-mono text-xs uppercase tracking-[0.04em] text-[var(--muted)] md:col-span-3"
      >
        {title}
      </h2>
      <div className="min-w-0 md:col-span-9">{children}</div>
    </section>
  );
}

function ProjectView({ project }: { project: Project }) {
  const { language, t } = useLanguage();
  const { previous, next } = getAdjacentProjects(project.id);
  const relatedGroup = project.relatedPost ? findGroup(project.relatedPost) : undefined;
  const security = project.security?.[language] ?? [];
  const roadmap = project.roadmap?.[language] ?? [];
  const gallery = (project.gallery ?? []).flatMap((item) => {
    const entry = getImage(item.key);
    return entry ? [{ key: entry.key, image: entry, alt: item.alt[language] }] : [];
  });
  const cover = project.visual.kind === "image" ? project.visual.image : undefined;

  usePageMeta({
    title: formatPageTitle(project.title),
    description: project.summary[language],
    path: projectPath(project.id),
    twitterCard: cover ? "summary_large_image" : undefined,
    image: cover?.src || undefined,
    imageAlt: cover ? cover.alt[language] : undefined,
    imageWidth: cover?.width,
    imageHeight: cover?.height,
  });

  return (
    <Container className="pb-[var(--space-24)] pt-[var(--space-24)]">
      <article className="mx-auto flex max-w-5xl flex-col gap-[var(--space-10)]">
        <header className="flex flex-col gap-[var(--space-4)]">
          <AppLink
            href="/#projects"
            lang={language}
            className="inline-flex min-h-11 items-center gap-[var(--space-2)] self-start rounded-[var(--radius-sm)] text-sm font-medium text-[var(--muted)] transition-colors duration-[var(--dur-fast)] hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
          >
            <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden="true" />
            {t.projects.backToProjects}
          </AppLink>

          <h1 className="font-display text-h1 font-bold leading-[1.1] tracking-[-0.02em]">
            {project.title}
          </h1>
          <p lang={language} className="max-w-3xl text-lg text-[var(--muted)]">
            {project.summary[language]}
          </p>
          <ProjectActions project={project} className="mt-[var(--space-2)]" />
        </header>

        <ProjectVisual project={project} variant="hero" />

        <div lang={language} className="flex flex-col gap-[var(--space-10)]">
          <DetailSection id="problem" title={t.projects.problem}>
            <p className="max-w-[68ch] text-lg">{project.problem[language]}</p>
          </DetailSection>

          {project.results.length > 0 && (
            <DetailSection id="results" title={t.projects.results}>
              <ProjectResults results={project.results} />
            </DetailSection>
          )}

          {security.length > 0 && (
            <DetailSection id="security" title={t.projects.security}>
              <ul className="flex flex-col gap-[var(--space-3)]">
                {security.map((item) => (
                  <li key={item} className="flex items-start gap-[var(--space-3)]">
                    <span
                      aria-hidden="true"
                      className="mt-[var(--space-2)] h-1.5 w-1.5 shrink-0 rounded-[var(--radius-full)] bg-[var(--accent)]"
                    />
                    <span className="max-w-[68ch]">{item}</span>
                  </li>
                ))}
              </ul>
            </DetailSection>
          )}

          <DetailSection id="features" title={t.projects.features}>
            <ul className="flex flex-col gap-[var(--space-3)]">
              {project.features[language].map((item) => (
                <li key={item} className="flex items-start gap-[var(--space-3)]">
                  <span
                    aria-hidden="true"
                    className="mt-[var(--space-2)] h-1.5 w-1.5 shrink-0 rounded-[var(--radius-full)] bg-[var(--accent)]"
                  />
                  <span className="max-w-[68ch]">{item}</span>
                </li>
              ))}
            </ul>
          </DetailSection>

          <DetailSection id="stack" title={t.projects.techStack}>
            <ul className="flex flex-wrap gap-[var(--space-2)]">
              {project.stack.map((item) => (
                <li key={item} className={CHIP_CLASS}>
                  {item}
                </li>
              ))}
            </ul>
          </DetailSection>

          {roadmap.length > 0 && (
            <DetailSection id="roadmap" title={t.projects.roadmap}>
              <p className="mb-[var(--space-3)] text-sm text-[var(--muted)]">
                {t.projects.roadmapPlanned}
              </p>
              <ul className="flex flex-col gap-[var(--space-3)]">
                {roadmap.map((item) => (
                  <li key={item} className="flex items-start gap-[var(--space-3)]">
                    <span
                      aria-hidden="true"
                      className="mt-[var(--space-2)] h-1.5 w-1.5 shrink-0 rounded-[var(--radius-full)] border border-[var(--muted)]"
                    />
                    <span className="max-w-[68ch] text-[var(--muted)]">{item}</span>
                  </li>
                ))}
              </ul>
            </DetailSection>
          )}

          {gallery.length > 0 && (
            <DetailSection id="gallery" title={t.projects.gallery}>
              <ProjectGallery items={gallery} fallbackLabel={project.title} />
            </DetailSection>
          )}

          {relatedGroup && project.relatedPost && (
            <AppLink
              href={postPath(project.relatedPost)}
              className={`${TEXT_LINK_CLASS} self-start`}
            >
              {t.projects.readPost}
              <ArrowRight className="size-4" aria-hidden="true" />
            </AppLink>
          )}
        </div>

        {(previous || next) && (
          <nav
            aria-label={t.projects.moreProjects}
            className="grid gap-[var(--space-4)] border-t border-[var(--border)] pt-[var(--space-8)] md:grid-cols-2"
          >
            {previous ? (
              <AdjacentLink project={previous} label={t.projects.previous} />
            ) : (
              <span aria-hidden="true" />
            )}
            {next && <AdjacentLink project={next} label={t.projects.next} alignEnd />}
          </nav>
        )}
      </article>
    </Container>
  );
}

type AdjacentLinkProps = {
  project: Project;
  label: string;
  alignEnd?: boolean;
};

function AdjacentLink({ project, label, alignEnd = false }: AdjacentLinkProps) {
  const { language } = useLanguage();

  return (
    <AppLink
      href={projectPath(project.id)}
      className={`flex min-h-11 flex-col gap-[var(--space-1)] rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-[var(--space-4)] transition-[background-color,translate] duration-[var(--dur-fast)] hover:bg-[var(--surface-2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)] motion-safe:hover:-translate-y-0.5 ${
        alignEnd ? "md:items-end md:text-right" : ""
      }`}
    >
      <span className="text-xs font-medium uppercase tracking-[0.04em] text-[var(--muted)]">
        {label}
      </span>
      <span className="font-semibold leading-snug">{project.title}</span>
      <span lang={language} className="text-sm text-[var(--muted)]">
        {project.summary[language]}
      </span>
    </AppLink>
  );
}
