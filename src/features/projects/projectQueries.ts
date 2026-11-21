import { projects } from "../../data/projects.ts";
import type { Project } from "../../domain/project.ts";

export type AdjacentProjects = {
  previous: Project | null;
  next: Project | null;
};

export function projectPath(id: string): string {
  return `/projects/${id}`;
}

export function findProject(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}

export function getAdjacentProjects(id: string): AdjacentProjects {
  const index = projects.findIndex((project) => project.id === id);

  if (index === -1) return { previous: null, next: null };

  return {
    previous: index > 0 ? projects[index - 1] : null,
    next: index < projects.length - 1 ? projects[index + 1] : null,
  };
}
