import { postGroups } from "../../data/blog.ts";
import { blogMeta } from "../../data/blogMeta.ts";
import { resolvePost } from "../../domain/blog.ts";
import type { BlogPostGroup, ResolvedPost } from "../../domain/blog.ts";
import type { LanguageId } from "../../lib/i18n.ts";

export type AdjacentPosts = {
  newer: ResolvedPost | null;
  older: ResolvedPost | null;
};

export function getResolvedPosts(language: LanguageId): ResolvedPost[] {
  return postGroups.map((group) => resolvePost(group, language));
}

export function getLatestPosts(
  language: LanguageId,
  count: number = blogMeta.homeLatestCount
): ResolvedPost[] {
  return getResolvedPosts(language).slice(0, count);
}

export function findGroup(slug: string): BlogPostGroup | undefined {
  return postGroups.find((group) => group.slug === slug);
}

export function getAdjacentPosts(
  slug: string,
  language: LanguageId
): AdjacentPosts {
  const index = postGroups.findIndex((group) => group.slug === slug);

  if (index === -1) return { newer: null, older: null };

  return {
    newer:
      index > 0 ? resolvePost(postGroups[index - 1], language) : null,
    older:
      index < postGroups.length - 1
        ? resolvePost(postGroups[index + 1], language)
        : null,
  };
}

export function getAllTags(language: LanguageId): string[] {
  return [
    ...new Set(getResolvedPosts(language).flatMap((post) => post.tags)),
  ].sort((a, b) => a.localeCompare(b));
}

export function postPath(slug: string, lang?: LanguageId): string {
  const base = `${blogMeta.path}/${slug}`;

  return lang ? `${base}?lang=${lang}` : base;
}
