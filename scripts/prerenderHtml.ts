import { escapeAttribute } from "./blogContent.ts";

export type PageMeta = {
  title: string;
  description: string;
  url: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
  type: "website" | "article";
  twitterCard: "summary" | "summary_large_image";
  lang?: string;
  body: string;
};

function replaceOnce(html: string, pattern: RegExp, replacement: string, label: string) {
  if (!pattern.test(html)) {
    throw new Error(`Prerender: "${label}" was not found in dist/index.html`);
  }

  return html.replace(pattern, () => replacement);
}

function metaPattern(attribute: "name" | "property", key: string): RegExp {
  return new RegExp(
    `<meta\\s+${attribute}="${key}"\\s+content="[^"]*"\\s*/?>`
  );
}

function setMeta(
  html: string,
  attribute: "name" | "property",
  key: string,
  content: string
) {
  return replaceOnce(
    html,
    metaPattern(attribute, key),
    `<meta ${attribute}="${key}" content="${escapeAttribute(content)}" />`,
    `${attribute}=${key}`
  );
}

export function unescapeAttribute(value: string): string {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&");
}

export function readMeta(html: string, attribute: "name" | "property", key: string): string {
  const match = metaPattern(attribute, key).exec(html);
  const content = match ? /content="([^"]*)"/.exec(match[0])?.[1] : undefined;

  if (content === undefined) {
    throw new Error(`Prerender: "${attribute}=${key}" was not found in dist/index.html`);
  }

  return unescapeAttribute(content);
}

export function renderPage(template: string, meta: PageMeta): string {
  let html = template;

  html = replaceOnce(
    html,
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeAttribute(meta.title)}</title>`,
    "title"
  );
  html = setMeta(html, "name", "description", meta.description);
  html = replaceOnce(
    html,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${escapeAttribute(meta.url)}" />`,
    "canonical"
  );
  html = setMeta(html, "property", "og:type", meta.type);
  html = setMeta(html, "property", "og:url", meta.url);
  html = setMeta(html, "property", "og:title", meta.title);
  html = setMeta(html, "property", "og:description", meta.description);
  html = setMeta(html, "property", "og:image", meta.image);
  html = setMeta(html, "property", "og:image:width", String(meta.imageWidth));
  html = setMeta(html, "property", "og:image:height", String(meta.imageHeight));
  html = setMeta(html, "property", "og:image:alt", meta.imageAlt);
  html = setMeta(html, "name", "twitter:card", meta.twitterCard);
  html = setMeta(html, "name", "twitter:image", meta.image);
  html = html.replace(/<link\s+rel="preload"\s+as="image"[^>]*>\s*/, "");

  if (meta.lang) {
    html = replaceOnce(
      html,
      /<html lang="[^"]*">/,
      `<html lang="${escapeAttribute(meta.lang)}">`,
      "html lang"
    );
  }

  return replaceOnce(
    html,
    /<div id="root"><\/div>/,
    `<div id="root">${meta.body}</div>`,
    "root element"
  );
}
