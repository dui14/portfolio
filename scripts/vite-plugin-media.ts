import { createReadStream, existsSync } from "node:fs";
import { cp, readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream";

import type { Plugin } from "vite";

import { hasMediaSource } from "./mediaSource.ts";

const BUILD_DIR_NAME = ".media-build";
const STATE_FILE = ".state.json";
const MANIFEST_RELATIVE = "src/data/media.generated.json";
const URL_PREFIX = "/media/";
const CACHE_CONTROL = "public, max-age=604800";

const CONTENT_TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".pdf": "application/pdf",
};

async function manifestHasEntries(file: string): Promise<boolean> {
  try {
    const parsed: unknown = JSON.parse(await readFile(file, "utf8"));
    return !!parsed && typeof parsed === "object" && Object.keys(parsed).length > 0;
  } catch {
    return false;
  }
}

export function mediaPlugin(): Plugin {
  let root = "";
  let buildDir = "";
  let outDir = "";
  let manifestPath = "";
  let isBuild = false;

  return {
    name: "duii-media",

    configResolved(config) {
      root = config.root;
      buildDir = path.resolve(root, BUILD_DIR_NAME);
      outDir = path.resolve(root, config.build.outDir);
      manifestPath = path.resolve(root, MANIFEST_RELATIVE);
      isBuild = config.command === "build";
    },

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = (req.url ?? "").split("?")[0];
        if (!pathname.startsWith(URL_PREFIX) || (req.method !== "GET" && req.method !== "HEAD")) {
          next();
          return;
        }

        let relative: string;
        try {
          relative = decodeURIComponent(pathname.slice(URL_PREFIX.length));
        } catch {
          res.statusCode = 400;
          res.end();
          return;
        }
        const file = path.resolve(buildDir, relative);
        if (!file.startsWith(buildDir + path.sep)) {
          res.statusCode = 403;
          res.end();
          return;
        }

        const info = await stat(file).catch(() => null);
        if (!info || !info.isFile()) {
          next();
          return;
        }

        const total = info.size;
        res.setHeader("Content-Type", CONTENT_TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream");
        res.setHeader("Accept-Ranges", "bytes");
        res.setHeader("Cache-Control", CACHE_CONTROL);

        const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? "");
        let start = 0;
        let end = total - 1;
        if (range && (range[1] || range[2])) {
          if (range[1]) {
            start = Number(range[1]);
            if (range[2]) end = Math.min(Number(range[2]), total - 1);
          } else {
            start = Math.max(total - Number(range[2]), 0);
          }
          if (start > end || start >= total) {
            res.statusCode = 416;
            res.setHeader("Content-Range", `bytes */${total}`);
            res.end();
            return;
          }
          res.statusCode = 206;
          res.setHeader("Content-Range", `bytes ${start}-${end}/${total}`);
        }

        res.setHeader("Content-Length", end - start + 1);
        if (req.method === "HEAD") {
          res.end();
          return;
        }
        pipeline(createReadStream(file, { start, end }), res, (error) => {
          if (error) res.destroy();
        });
      });
    },

    async writeBundle() {
      const outputs = existsSync(buildDir)
        ? (await readdir(buildDir)).filter((name) => name !== STATE_FILE)
        : [];

      if (outputs.length === 0) {
        if (isBuild && hasMediaSource() && (await manifestHasEntries(manifestPath))) {
          this.error("media/ outputs missing: run npm run media (needs the media/ folder on this machine)");
        }
        this.warn(`${BUILD_DIR_NAME}/ is missing or empty, dist/media is not created`);
        return;
      }

      await cp(buildDir, path.join(outDir, "media"), {
        recursive: true,
        filter: (source) => path.basename(source) !== STATE_FILE,
      });
    },
  };
}
