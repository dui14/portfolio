import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import rust from "highlight.js/lib/languages/rust";
import typescript from "highlight.js/lib/languages/typescript";
import { Marked } from "marked";
import type { Tokens } from "marked";
import sanitize from "sanitize-html";
import type { IOptions } from "sanitize-html";

import {
  BLOG_LANGS,
  bodyKey,
  isBlogLang,
  parseBlogFrontmatter,
} from "../src/domain/blog.ts";
import type { BlogLang, BlogPost } from "../src/domain/blog.ts";
import { DEFAULT_LANGUAGE } from "../src/lib/i18n.ts";
import { slugify } from "./slug.ts";

const EXTERNAL_LINK = /^https?:\/\//i;
export function escapeAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const EMBED_PATH = "/embed/";
const EMBED_HOSTS = ["www.youtube-nocookie.com", "www.youtube.com"];
const ALLOWED_SCHEMES = ["https", "http", "mailto"];

function isAllowedEmbed(src: string | undefined): boolean {
  if (!src) return false;

  try {
    const url = new URL(src);

    return (
      url.protocol === "https:" &&
      EMBED_HOSTS.includes(url.hostname) &&
      url.pathname.startsWith(EMBED_PATH)
    );
  } catch {
    return false;
  }
}

const SRCSET_ALLOWED = /^(\/media\/|https:\/\/)/;

function filterSrcset(value: string): string {
  return value
    .split(",")
    .map((candidate) => candidate.trim())
    .filter((candidate) => SRCSET_ALLOWED.test(candidate))
    .join(", ");
}

const SANITIZE_OPTIONS: IOptions = {
  allowedTags: [
    "p",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "a",
    "img",
    "video",
    "source",
    "figure",
    "figcaption",
    "blockquote",
    "ul",
    "ol",
    "li",
    "code",
    "pre",
    "em",
    "strong",
    "del",
    "hr",
    "br",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "span",
    "sup",
    "sub",
    "div",
    "iframe",
  ],
  allowedAttributes: {
    a: ["href", "title", "rel", "target"],
    img: [
      "src",
      "srcset",
      "sizes",
      "alt",
      "title",
      "width",
      "height",
      "loading",
      "decoding",
    ],
    video: [
      "src",
      "poster",
      "controls",
      "width",
      "height",
      "muted",
      "loop",
      "playsinline",
      "preload",
    ],
    source: ["src", "type"],
    code: ["class"],
    span: ["class"],
    div: ["class", "data-lang"],
    th: ["align"],
    td: ["align"],
    iframe: ["src", "allowfullscreen", "title", "width", "height"],
  },
  allowedClasses: {
    code: ["language-*"],
    span: ["hljs*", "token*"],
    div: ["blog-code", "blog-table"],
  },
  allowedSchemes: ALLOWED_SCHEMES,
  allowedSchemesByTag: { iframe: ["https"] },
  allowedSchemesAppliedToAttributes: ["href", "src", "srcset", "poster"],
  allowProtocolRelative: false,
  allowedIframeHostnames: EMBED_HOSTS,
  allowIframeRelativeUrls: false,
  transformTags: {
    a: (tagName, attribs) => {
      const next = { ...attribs };

      if (next.target === "_blank") {
        next.rel = "noopener noreferrer";
      } else {
        delete next.target;
      }

      return { tagName, attribs: next };
    },
    img: (tagName, attribs) => {
      const next: Record<string, string> = { ...attribs, loading: "lazy" };

      if (next.srcset) {
        const safe = filterSrcset(next.srcset);

        if (safe) next.srcset = safe;
        else delete next.srcset;
      }

      return { tagName, attribs: next };
    },
  },
  exclusiveFilter: (frame) => {
    if (frame.tag !== "iframe") return false;

    return !isAllowedEmbed(frame.attribs.src);
  },
};

export function sanitizeHtml(html: string): string {
  return sanitize(html, SANITIZE_OPTIONS);
}

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("rust", rust);
hljs.registerLanguage("typescript", typescript);
hljs.registerAliases(["sh", "shell", "zsh", "console"], { languageName: "bash" });
hljs.registerAliases(["js", "jsx"], { languageName: "javascript" });
hljs.registerAliases(["ts", "tsx"], { languageName: "typescript" });
hljs.registerAliases(["move"], { languageName: "rust" });

function highlightCode(text: string, language: string): string {
  if (!language || !hljs.getLanguage(language)) return escapeAttribute(text);

  return hljs.highlight(text, { language, ignoreIllegals: true }).value;
}

const LANGUAGE_NAME = /^[a-z0-9+#-]{1,20}$/i;

function renderCodeBlock({ text, lang }: Tokens.Code): string {
  const requested = (lang ?? "").trim().split(/\s+/)[0].toLowerCase();
  const language = LANGUAGE_NAME.test(requested) ? requested : "";
  const labelAttribute = language ? ` data-lang="${escapeAttribute(language)}"` : "";
  const classAttribute = language ? ` class="language-${escapeAttribute(language)}"` : "";

  return `<div class="blog-code"${labelAttribute}><pre><code${classAttribute}>${highlightCode(text, language)}</code></pre></div>
`;
}

const SCHEME = /^[a-z][a-z0-9+.-]*:/i;
const BLOG_MEDIA_PATH = /^\/media\/blog\/([^/]+)\/(.+)$/;
const IMAGE_SIZES = "(min-width: 768px) 68ch, 100vw";
const MEDIA_TAG = /<(video|img)\b((?:[^>"']|"[^"]*"|'[^']*')*)>/gi;
const ATTRIBUTE = /([a-zA-Z][\w-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
const VIDEO_PASSTHROUGH = ["muted", "loop"];

export type MediaEntry = {
  type: "image" | "video";
  width: number;
  height: number;
  src: string;
  srcSet?: string;
  poster?: string;
};

export type MediaManifest = Record<string, MediaEntry>;

export type MediaResolver = (reference: string) => MediaEntry | null;

function decodePath(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function createMediaResolver(
  manifest: MediaManifest,
  slug: string,
  file: string
): MediaResolver {
  return (reference) => {
    const value = reference.trim();

    if (!value || value.startsWith("#") || value.startsWith("//") || SCHEME.test(value)) {
      return null;
    }

    let owner = slug;
    let relative: string;

    if (value.startsWith("/")) {
      const match = BLOG_MEDIA_PATH.exec(value);

      if (!match) return null;

      owner = slugify(decodePath(match[1]));
      relative = match[2];
    } else {
      relative = value.replace(/^(\.\/)+/, "");
    }

    relative = decodePath(relative.split(/[?#]/)[0]);

    const parts = relative.split("/");
    const name = parts.pop() ?? "";
    const stem = slugify(path.parse(name).name);
    const folders = parts.map(slugify);
    const key = ["blog", owner, ...folders, stem].join("/");
    const entry = stem && folders.every(Boolean) ? manifest[key] : undefined;

    if (!entry) {
      throw new Error(
        `${file}: media/blog/${owner}/${relative} not found, run npm run media`
      );
    }

    return entry;
  };
}

function renderImageTag(
  entry: MediaEntry,
  alt: string,
  title: string | null | undefined
): string {
  const srcset = entry.srcSet ? ` srcset="${escapeAttribute(entry.srcSet)}"` : "";
  const sizes = entry.srcSet ? ` sizes="${escapeAttribute(IMAGE_SIZES)}"` : "";
  const titleAttribute = title ? ` title="${escapeAttribute(title)}"` : "";

  return `<img src="${escapeAttribute(entry.src)}"${srcset}${sizes} width="${entry.width}" height="${entry.height}" loading="lazy" decoding="async" alt="${escapeAttribute(alt)}"${titleAttribute} />`;
}

function renderVideoTag(entry: MediaEntry, flags: string[]): string {
  const poster = entry.poster ? ` poster="${escapeAttribute(entry.poster)}"` : "";
  const extra = flags.map((flag) => ` ${flag}`).join("");

  return `<video src="${escapeAttribute(entry.src)}"${poster} controls${extra} preload="metadata" playsinline width="${entry.width}" height="${entry.height}">`;
}

function parseAttributes(source: string): Map<string, string> {
  const attributes = new Map<string, string>();

  for (const match of source.matchAll(ATTRIBUTE)) {
    attributes.set(
      match[1].toLowerCase(),
      match[2] ?? match[3] ?? match[4] ?? ""
    );
  }

  return attributes;
}

function rewriteMediaTags(html: string, resolve: MediaResolver, file: string): string {
  return html.replace(MEDIA_TAG, (tag, name: string, rest: string) => {
    const attributes = parseAttributes(rest);
    const src = attributes.get("src");
    const entry = src === undefined ? null : resolve(src);

    if (!entry) return tag;

    if (name.toLowerCase() === "img") {
      if (entry.type !== "image") {
        throw new Error(`${file}: "${src}" is a video, use <video>`);
      }

      return renderImageTag(entry, attributes.get("alt") ?? "", attributes.get("title"));
    }

    if (entry.type !== "video") {
      throw new Error(`${file}: "${src}" is an image, use ![alt](...)`);
    }

    return renderVideoTag(
      entry,
      VIDEO_PASSTHROUGH.filter((flag) => attributes.has(flag))
    );
  });
}

function createMarked(resolve: MediaResolver, file: string): Marked {
  return new Marked({
    gfm: true,
    renderer: {
      code: renderCodeBlock,
      html({ text }: Tokens.HTML | Tokens.Tag) {
        return rewriteMediaTags(text, resolve, file);
      },
      image({ href, title, text }: Tokens.Image) {
        const entry = resolve(href);

        if (entry) {
          if (entry.type !== "image") {
            throw new Error(`${file}: "${href}" is a video, use <video>`);
          }

          return renderImageTag(entry, text, title);
        }

        const titleAttribute = title ? ` title="${escapeAttribute(title)}"` : "";

        return `<img src="${escapeAttribute(href)}" alt="${escapeAttribute(text)}"${titleAttribute} loading="lazy" decoding="async" />`;
      },
      link({ href, title, tokens }: Tokens.Link) {
        const inner = this.parser.parseInline(tokens);
        const titleAttribute = title ? ` title="${escapeAttribute(title)}"` : "";
        const externalAttributes = EXTERNAL_LINK.test(href)
          ? ` target="_blank" rel="noopener noreferrer"`
          : "";

        return `<a href="${escapeAttribute(href)}"${titleAttribute}${externalAttributes}>${inner}</a>`;
      },
    },
  });
}

export function renderMarkdown(
  markdown: string,
  resolve: MediaResolver,
  file: string
): string {
  const html = createMarked(resolve, file)
    .parse(markdown, { async: false })
    .replace(/<table>/g, '<div class="blog-table"><table>')
    .replace(/<\/table>/g, "</table></div>");

  return sanitizeHtml(html);
}

export function resolveCover(value: unknown, resolve: MediaResolver): unknown {
  if (typeof value !== "string") return value;

  const entry = resolve(value);

  if (!entry) return value;

  if (entry.type !== "image") {
    throw new Error(`"cover" "${value}" must be an image`);
  }

  return entry.src;
}

type LoadOptions = {
  dir: string;
  manifestPath: string;
  includeDrafts: boolean;
};

async function loadManifest(manifestPath: string): Promise<MediaManifest> {
  try {
    const parsed: unknown = JSON.parse(await readFile(manifestPath, "utf8"));

    return parsed && typeof parsed === "object" ? (parsed as MediaManifest) : {};
  } catch {
    return {};
  }
}

function compareNewestFirst(a: BlogPost, b: BlogPost): number {
  if (a.date !== b.date) return a.date < b.date ? 1 : -1;
  if (a.slug !== b.slug) return a.slug < b.slug ? -1 : 1;

  return a.lang < b.lang ? -1 : 1;
}

type SourceFile = {
  slug: string;
  lang: BlogLang;
  file: string;
};

async function collectSources(dir: string): Promise<SourceFile[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const sources: SourceFile[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith("_")) continue;

    if (entry.isFile() && entry.name.endsWith(".md")) {
      sources.push({
        slug: entry.name.slice(0, -".md".length),
        lang: DEFAULT_LANGUAGE,
        file: path.join(dir, entry.name),
      });
      continue;
    }

    if (!entry.isDirectory()) continue;

    const files = await readdir(path.join(dir, entry.name));

    for (const name of files) {
      if (name.startsWith("_") || !name.endsWith(".md")) continue;

      const lang = name.slice(0, -".md".length);

      if (!isBlogLang(lang)) {
        throw new Error(
          `Invalid blog post "${entry.name}": "${name}" must be named after a language (${BLOG_LANGS.join(", ")})`
        );
      }

      sources.push({
        slug: entry.name,
        lang,
        file: path.join(dir, entry.name, name),
      });
    }
  }

  const seen = new Set<string>();

  for (const source of sources) {
    const key = bodyKey(source.slug, source.lang);

    if (seen.has(key)) {
      throw new Error(
        `Invalid blog post "${source.slug}": more than one "${source.lang}" version`
      );
    }

    seen.add(key);
  }

  return sources;
}

export async function loadPosts({
  dir,
  manifestPath,
  includeDrafts,
}: LoadOptions): Promise<BlogPost[]> {
  let sources: SourceFile[];

  try {
    sources = await collectSources(dir);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];

    throw error;
  }

  const manifest = await loadManifest(manifestPath);

  const parsed = await Promise.all(
    sources.map(async (source) => {
      const raw = matter(await readFile(source.file, "utf8"));
      const label = path.relative(process.cwd(), source.file).replace(/\\/g, "/");
      const resolve = createMediaResolver(manifest, source.slug, label);
      const meta = parseBlogFrontmatter(
        source.slug,
        source.lang,
        { ...raw.data, cover: resolveCover(raw.data.cover, resolve) },
        raw.content
      );

      return {
        post: { ...meta, html: renderMarkdown(raw.content, resolve, label) },
        hasTags: raw.data.tags !== undefined,
        hasCover: raw.data.cover !== undefined,
      };
    })
  );

  const base = new Map<string, BlogPost>();

  for (const { post } of parsed) {
    if (post.lang === DEFAULT_LANGUAGE) base.set(post.slug, post);
  }

  const posts = parsed.map(({ post, hasTags, hasCover }) => {
    const fallback = base.get(post.slug);

    if (!fallback || post.lang === DEFAULT_LANGUAGE) return post;

    return {
      ...post,
      tags: hasTags ? post.tags : fallback.tags,
      cover: hasCover ? post.cover : fallback.cover,
    };
  });

  return posts
    .filter((post) => includeDrafts || !post.draft)
    .sort(compareNewestFirst);
}
