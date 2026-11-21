import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { blogMeta } from "../src/data/blogMeta.ts";
import { translations } from "../src/data/translations.ts";
import { formatPageTitle, groupPosts } from "../src/domain/blog.ts";
import type { BlogPost, BlogPostGroup } from "../src/domain/blog.ts";
import { DATE_LOCALES } from "../src/lib/dates.ts";
import { DEFAULT_LANGUAGE } from "../src/lib/i18n.ts";
import { escapeAttribute, loadPosts } from "./blogContent.ts";
import { readMeta, renderPage, unescapeAttribute } from "./prerenderHtml.ts";
import type { MediaManifest } from "./blogContent.ts";

const ROOT_DIR = path.resolve(import.meta.dirname, "..");
const DIST_DIR = path.join(ROOT_DIR, "dist");
const CONTENT_DIR = path.join(ROOT_DIR, "content", "blog");
const MANIFEST_PATH = path.join(ROOT_DIR, "src", "data", "media.generated.json");

type Size = { width: number; height: number };

function formatDate(isoDate: string, lang: BlogPost["lang"]): string {
  return new Intl.DateTimeFormat(DATE_LOCALES[lang], {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

function readingLabel(post: BlogPost): string {
  return translations[post.lang].blog.minRead.replace("{minutes}", String(post.readingMinutes));
}

function coverSize(manifest: MediaManifest, cover: string): Size {
  const entry = Object.values(manifest).find(
    (candidate) => candidate.type === "image" && candidate.src === cover
  );

  return entry ? { width: entry.width, height: entry.height } : blogMeta.cover;
}

function renderPostBody(post: BlogPost, manifest: MediaManifest): string {
  const langAttribute = ` lang="${post.lang}"`;
  const size = post.cover ? coverSize(manifest, post.cover) : null;
  const cover =
    post.cover && size
      ? `<div class="blog-prose"><img src="${escapeAttribute(post.cover)}" alt="${escapeAttribute(post.title)}" width="${size.width}" height="${size.height}" /></div>`
      : "";

  return [
    `<main id="main-content" class="prerender">`,
    `<article${langAttribute}>`,
    `<h1>${escapeAttribute(post.title)}</h1>`,
    `<p class="prerender-meta"><time datetime="${post.date}">${formatDate(post.date, post.lang)}</time> · ${readingLabel(post)}</p>`,
    cover,
    `<div class="blog-prose">${post.html}</div>`,
    `</article>`,
    `</main>`,
  ].join("");
}

function renderListBody(posts: BlogPost[]): string {
  const labels = translations[DEFAULT_LANGUAGE].blog;
  const content =
    posts.length === 0
      ? `<p>${escapeAttribute(labels.emptyTitle)}</p><p><a href="/">${escapeAttribute(labels.goHome)}</a></p>`
      : `<ul class="prerender-list">${posts
          .map(
            (post) =>
              `<li lang="${escapeAttribute(post.lang)}"><a href="${blogMeta.path}/${post.slug}">${escapeAttribute(post.title)}</a><p>${formatDate(post.date, post.lang)} · ${readingLabel(post)}</p><p>${escapeAttribute(post.summary)}</p></li>`
          )
          .join("")}</ul>`;

  return `<main id="main-content" class="prerender"><h1>${escapeAttribute(blogMeta.title)}</h1>${content}</main>`;
}

function renderSitemap(siteUrl: string, posts: BlogPost[]): string {
  const entries = [
    `  <url>\n    <loc>${siteUrl}/</loc>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>`,
    ...(posts.length > 0
      ? [
          `  <url>\n    <loc>${siteUrl}${blogMeta.path}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
        ]
      : []),
    ...posts.map(
      (post) =>
        `  <url>\n    <loc>${siteUrl}${blogMeta.path}/${post.slug}</loc>\n    <lastmod>${post.date}</lastmod>\n    <changefreq>yearly</changefreq>\n    <priority>0.6</priority>\n  </url>`
    ),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;
}

async function writePage(relativeDir: string, html: string) {
  const dir = path.join(DIST_DIR, relativeDir);

  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "index.html"), html);
}

function defaultPost(posts: BlogPost[], group: BlogPostGroup): BlogPost {
  return posts.find(
    (post) => post.slug === group.slug && post.lang === group.defaultLang
  ) as BlogPost;
}

async function loadMediaManifest(): Promise<MediaManifest> {
  try {
    const parsed: unknown = JSON.parse(await readFile(MANIFEST_PATH, "utf8"));

    return parsed && typeof parsed === "object" ? (parsed as MediaManifest) : {};
  } catch {
    return {};
  }
}

async function main() {
  const manifest = await loadMediaManifest();
  const template = await readFile(path.join(DIST_DIR, "index.html"), "utf8");
  const allPosts = await loadPosts({
    dir: CONTENT_DIR,
    manifestPath: MANIFEST_PATH,
    includeDrafts: false,
  });
  const groups = groupPosts(allPosts);
  const posts = groups.map((group) => defaultPost(allPosts, group));

  const canonicalRaw = /<link\s+rel="canonical"\s+href="([^"]*)"/.exec(template)?.[1];
  const canonical = canonicalRaw === undefined ? undefined : unescapeAttribute(canonicalRaw);

  if (!canonical) {
    throw new Error(`Prerender: canonical link was not found in dist/index.html`);
  }

  const siteUrl = new URL(canonical).origin;
  const fallbackImage = readMeta(template, "property", "og:image");
  const fallbackWidth = Number(readMeta(template, "property", "og:image:width"));
  const fallbackHeight = Number(readMeta(template, "property", "og:image:height"));
  const fallbackAlt = readMeta(template, "property", "og:image:alt");

  await writePage(
    blogMeta.path.slice(1),
    renderPage(template, {
      title: formatPageTitle(blogMeta.title),
      description: blogMeta.description,
      url: `${siteUrl}${blogMeta.path}`,
      image: fallbackImage,
      imageWidth: fallbackWidth,
      imageHeight: fallbackHeight,
      imageAlt: fallbackAlt,
      type: "website",
      twitterCard: "summary",
      body: renderListBody(posts),
    })
  );

  for (const group of groups) {
    const post = defaultPost(allPosts, group);
    const postUrl = `${siteUrl}${blogMeta.path}/${post.slug}`;
    const size = post.cover ? coverSize(manifest, post.cover) : null;

    await writePage(
      path.join(blogMeta.path.slice(1), post.slug),
      renderPage(template, {
        title: formatPageTitle(post.title),
        description: post.summary,
        url: postUrl,
        image: post.cover ? new URL(post.cover, siteUrl).toString() : fallbackImage,
        imageWidth: size ? size.width : fallbackWidth,
        imageHeight: size ? size.height : fallbackHeight,
        imageAlt: size ? post.title : fallbackAlt,
        type: "article",
        twitterCard: size ? "summary_large_image" : "summary",
        lang: post.lang,
        body: renderPostBody(post, manifest),
      })
    );
  }

  await writeFile(path.join(DIST_DIR, "sitemap.xml"), renderSitemap(siteUrl, posts));

  console.log(`Prerendered /blog and ${groups.length} post page(s) (${allPosts.length} version(s))`);
}

await main();
