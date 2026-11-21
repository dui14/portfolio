import { DEFAULT_LANGUAGE, languages } from "../lib/i18n.ts";
import type { LanguageId } from "../lib/i18n.ts";

export type BlogLang = LanguageId;

export const BLOG_LANGS: readonly BlogLang[] = languages.map(
  (language) => language.id
);

export type BlogPostMeta = {
  slug: string;
  lang: BlogLang;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  cover?: string;
  draft: boolean;
  readingMinutes: number;
};

export type BlogPost = BlogPostMeta & {
  html: string;
};

export type BlogPostGroup = {
  slug: string;
  versions: Partial<Record<BlogLang, BlogPostMeta>>;
  languages: BlogLang[];
  defaultLang: BlogLang;
};

export type ResolvedPost = BlogPostMeta & {
  languages: BlogLang[];
};

export function isBlogLang(value: unknown): value is BlogLang {
  return BLOG_LANGS.some((lang) => lang === value);
}

export function bodyKey(slug: string, lang: BlogLang): string {
  return `${slug}/${lang}`;
}

export function groupPosts(metas: BlogPostMeta[]): BlogPostGroup[] {
  const bySlug = new Map<string, Partial<Record<BlogLang, BlogPostMeta>>>();

  for (const meta of metas) {
    const versions = bySlug.get(meta.slug) ?? {};
    versions[meta.lang] = meta;
    bySlug.set(meta.slug, versions);
  }

  const groups = [...bySlug.entries()].map(([slug, versions]) => {
    const available = BLOG_LANGS.filter((lang) => versions[lang]);
    const defaultLang = versions[DEFAULT_LANGUAGE]
      ? DEFAULT_LANGUAGE
      : available[0];

    return { slug, versions, languages: available, defaultLang };
  });

  return groups.sort((a, b) => {
    const dateA = a.versions[a.defaultLang]?.date ?? "";
    const dateB = b.versions[b.defaultLang]?.date ?? "";

    if (dateA !== dateB) return dateA < dateB ? 1 : -1;

    return a.slug < b.slug ? -1 : 1;
  });
}

export function pickLang(group: BlogPostGroup, preferred: BlogLang): BlogLang {
  if (group.versions[preferred]) return preferred;

  return group.defaultLang;
}

export function resolvePost(
  group: BlogPostGroup,
  preferred: BlogLang
): ResolvedPost {
  const lang = pickLang(group, preferred);
  const meta = group.versions[lang] as BlogPostMeta;

  return { ...meta, languages: group.languages };
}

export const BLOG_LIMITS = {
  summaryMax: 200,
  wordsPerMinute: 200,
  cjkCharsPerWord: 2,
} as const;

export const PAGE_TITLE_SUFFIX = "duii.dev";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const CJK_PATTERN = /[㐀-鿿]/g;

export function formatPageTitle(title: string): string {
  return `${title} | ${PAGE_TITLE_SUFFIX}`;
}

export function isValidSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

export function estimateReadingMinutes(markdown: string): number {
  const cjkCount = markdown.match(CJK_PATTERN)?.length ?? 0;
  const latinWords = markdown
    .replace(CJK_PATTERN, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  const words = latinWords + cjkCount / BLOG_LIMITS.cjkCharsPerWord;

  return Math.max(1, Math.ceil(words / BLOG_LIMITS.wordsPerMinute));
}

function fail(slug: string, message: string): never {
  throw new Error(`Invalid blog post "${slug}": ${message}`);
}

function readRequiredString(
  slug: string,
  data: Record<string, unknown>,
  key: string
): string {
  const value = data[key];

  if (typeof value !== "string" || value.trim() === "") {
    fail(slug, `"${key}" is required and must be a non-empty string`);
  }

  return value.trim();
}

function readDate(slug: string, data: Record<string, unknown>): string {
  const raw = data.date;
  const value =
    raw instanceof Date && !Number.isNaN(raw.getTime())
      ? raw.toISOString().slice(0, 10)
      : raw;

  if (typeof value !== "string" || !DATE_PATTERN.test(value)) {
    fail(slug, `"date" must be an ISO date such as 2026-11-19`);
  }

  if (Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
    fail(slug, `"date" is not a real calendar date`);
  }

  return value;
}

function readTags(slug: string, data: Record<string, unknown>): string[] {
  const raw = data.tags;

  if (raw === undefined) return [];

  if (
    !Array.isArray(raw) ||
    raw.some((tag) => typeof tag !== "string" || tag.trim() === "")
  ) {
    fail(slug, `"tags" must be a list of non-empty strings`);
  }

  return (raw as string[]).map((tag) => tag.trim());
}

function readCover(
  slug: string,
  data: Record<string, unknown>
): string | undefined {
  const raw = data.cover;

  if (raw === undefined) return undefined;

  if (
    typeof raw !== "string" ||
    !(/^\/(?!\/)/.test(raw) || /^https:\/\//.test(raw))
  ) {
    fail(slug, `"cover" must be a root-relative path or an https URL`);
  }

  return raw;
}

export function parseBlogFrontmatter(
  slug: string,
  lang: BlogLang,
  data: Record<string, unknown>,
  body: string
): BlogPostMeta {
  if (!isValidSlug(slug)) {
    fail(slug, "slug must be lowercase letters, digits and hyphens");
  }

  const summary = readRequiredString(slug, data, "summary");

  if (summary.length > BLOG_LIMITS.summaryMax) {
    fail(slug, `"summary" must be at most ${BLOG_LIMITS.summaryMax} characters`);
  }

  if (data.draft !== undefined && typeof data.draft !== "boolean") {
    fail(slug, `"draft" must be true or false`);
  }

  return {
    slug,
    lang,
    title: readRequiredString(slug, data, "title"),
    date: readDate(slug, data),
    summary,
    tags: readTags(slug, data),
    cover: readCover(slug, data),
    draft: data.draft === true,
    readingMinutes: estimateReadingMinutes(body),
  };
}
