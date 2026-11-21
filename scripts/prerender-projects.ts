import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { projects } from "../src/data/projects.ts";
import { translations } from "../src/data/translations.ts";
import { formatPageTitle } from "../src/domain/blog.ts";
import type { Project } from "../src/domain/project.ts";
import { projectPath } from "../src/features/projects/projectQueries.ts";
import { DEFAULT_LANGUAGE } from "../src/lib/i18n.ts";
import { escapeAttribute } from "./blogContent.ts";
import { readMeta, renderPage, unescapeAttribute } from "./prerenderHtml.ts";

const ROOT_DIR = path.resolve(import.meta.dirname, "..");
const DIST_DIR = path.join(ROOT_DIR, "dist");

function list(items: string[]): string {
  return `<ul>${items.map((item) => `<li>${escapeAttribute(item)}</li>`).join("")}</ul>`;
}

function renderBody(project: Project): string {
  const lang = DEFAULT_LANGUAGE;
  const labels = translations[lang].projects;
  const links = [
    project.links.live
      ? `<a href="${escapeAttribute(project.links.live)}" rel="noopener noreferrer">${escapeAttribute(labels.live)}</a>`
      : "",
    project.links.github
      ? `<a href="${escapeAttribute(project.links.github)}" rel="noopener noreferrer">${escapeAttribute(labels.github)}</a>`
      : "",
  ].join(" ");
  const results = project.results
    .map(
      (result) =>
        `<li><strong>${escapeAttribute(result.value)}</strong> ${escapeAttribute(result.label[lang])}</li>`
    )
    .join("");
  const roadmap = project.roadmap?.[lang] ?? [];

  return [
    `<main id="main-content" class="prerender">`,
    `<article lang="${lang}">`,
    `<p><a href="/#projects">${escapeAttribute(labels.backToProjects)}</a></p>`,
    `<h1>${escapeAttribute(project.title)}</h1>`,
    `<p>${escapeAttribute(project.summary[lang])}</p>`,
    `<p>${links}</p>`,
    `<h2>${escapeAttribute(labels.problem)}</h2>`,
    `<p>${escapeAttribute(project.problem[lang])}</p>`,
    project.results.length > 0
      ? `<h2>${escapeAttribute(labels.results)}</h2><ul>${results}</ul>`
      : "",
    `<h2>${escapeAttribute(labels.features)}</h2>`,
    list(project.features[lang]),
    `<h2>${escapeAttribute(labels.techStack)}</h2>`,
    list(project.stack),
    roadmap.length > 0
      ? `<h2>${escapeAttribute(labels.roadmap)}</h2><p>${escapeAttribute(labels.roadmapPlanned)}</p>${list(roadmap)}`
      : "",
    `</article>`,
    `</main>`,
  ].join("");
}

function sitemapEntries(siteUrl: string): string {
  return projects
    .map(
      (project) =>
        `  <url>\n    <loc>${siteUrl}${projectPath(project.id)}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`
    )
    .join("\n");
}

async function updateSitemap(siteUrl: string) {
  const file = path.join(DIST_DIR, "sitemap.xml");
  const current = await readFile(file, "utf8");
  const marker = "</urlset>";

  if (!current.includes(marker)) {
    throw new Error("Prerender: </urlset> was not found in dist/sitemap.xml");
  }

  const cleaned = current.replace(
    /\s*<url>\s*<loc>[^<]*\/projects\/[^<]*<\/loc>[\s\S]*?<\/url>/g,
    ""
  );

  await writeFile(file, cleaned.replace(marker, `${sitemapEntries(siteUrl)}\n${marker}`));
}

async function main() {
  const template = await readFile(path.join(DIST_DIR, "index.html"), "utf8");
  const canonicalRaw = /<link\s+rel="canonical"\s+href="([^"]*)"/.exec(template)?.[1];

  if (!canonicalRaw) {
    throw new Error("Prerender: canonical link was not found in dist/index.html");
  }

  const siteUrl = new URL(unescapeAttribute(canonicalRaw)).origin;
  const fallbackImage = readMeta(template, "property", "og:image");
  const fallbackWidth = Number(readMeta(template, "property", "og:image:width"));
  const fallbackHeight = Number(readMeta(template, "property", "og:image:height"));
  const fallbackAlt = readMeta(template, "property", "og:image:alt");

  for (const project of projects) {
    const cover = project.visual.kind === "image" ? project.visual.image : undefined;
    const hasCover = cover !== undefined && cover.src !== "";
    const pagePath = projectPath(project.id);
    const html = renderPage(template, {
      title: formatPageTitle(project.title),
      description: project.summary[DEFAULT_LANGUAGE],
      url: `${siteUrl}${pagePath}`,
      image: hasCover ? new URL(cover.src, siteUrl).toString() : fallbackImage,
      imageWidth: hasCover ? cover.width : fallbackWidth,
      imageHeight: hasCover ? cover.height : fallbackHeight,
      imageAlt: hasCover ? cover.alt[DEFAULT_LANGUAGE] : fallbackAlt,
      type: "website",
      twitterCard: hasCover ? "summary_large_image" : "summary",
      lang: DEFAULT_LANGUAGE,
      body: renderBody(project),
    });
    const dir = path.join(DIST_DIR, pagePath.slice(1));

    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, "index.html"), html);
  }

  await updateSitemap(siteUrl);

  console.log(`Prerendered ${projects.length} project page(s)`);
}

await main();
