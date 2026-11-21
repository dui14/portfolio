import path from "node:path";

import type { Plugin } from "vite";

import { bodyKey } from "../src/domain/blog.ts";
import type { BlogPost } from "../src/domain/blog.ts";
import { loadPosts } from "./blogContent.ts";

const POSTS_ID = "virtual:blog-posts";
const HTML_PREFIX = "virtual:blog-html:";
const RESOLVED_PREFIX = "\0";
const MANIFEST_PATH = "src/data/media.generated.json";

export function blogPlugin(): Plugin {
  let contentDir = "";
  let manifestPath = "";
  let includeDrafts = true;
  let cache: Promise<BlogPost[]> | null = null;

  function getPosts(): Promise<BlogPost[]> {
    cache ??= loadPosts({ dir: contentDir, manifestPath, includeDrafts });

    return cache;
  }

  return {
    name: "duii-blog",

    configResolved(config) {
      contentDir = path.resolve(config.root, "content/blog");
      manifestPath = path.resolve(config.root, MANIFEST_PATH);
      includeDrafts = !config.isProduction;
    },

    buildStart() {
      cache = null;
    },

    resolveId(id) {
      if (id === POSTS_ID || id.startsWith(HTML_PREFIX)) {
        return RESOLVED_PREFIX + id;
      }

      return null;
    },

    async load(id) {
      if (id === RESOLVED_PREFIX + POSTS_ID) {
        const posts = await getPosts();
        const metas = posts.map((post) => {
          const { html, ...meta } = post;
          void html;
          return meta;
        });
        const loaders = posts
          .map(
            (post) =>
              `${JSON.stringify(bodyKey(post.slug, post.lang))}: () => import(${JSON.stringify(HTML_PREFIX + bodyKey(post.slug, post.lang))})`
          )
          .join(",\n");

        return [
          `export const postMetas = ${JSON.stringify(metas)};`,
          `export const postHtmlLoaders = {\n${loaders}\n};`,
        ].join("\n");
      }

      if (id.startsWith(RESOLVED_PREFIX + HTML_PREFIX)) {
        const key = id.slice((RESOLVED_PREFIX + HTML_PREFIX).length);
        const posts = await getPosts();
        const post = posts.find(
          (candidate) => bodyKey(candidate.slug, candidate.lang) === key
        );

        if (!post) {
          this.error(`Blog post "${key}" was not found in content/blog`);
        }

        return `export default ${JSON.stringify(post.html)};`;
      }

      return null;
    },

    configureServer(server) {
      server.watcher.add([contentDir, manifestPath]);

      function reload(file: string) {
        const resolved = path.resolve(file);

        if (!resolved.startsWith(contentDir + path.sep) && resolved !== manifestPath) return;

        cache = null;
        server.moduleGraph.invalidateAll();
        server.ws.send({ type: "full-reload" });
      }

      server.watcher.on("add", reload);
      server.watcher.on("change", reload);
      server.watcher.on("unlink", reload);
    },
  };
}
