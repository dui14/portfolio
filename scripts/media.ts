import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { createReadStream, existsSync } from "node:fs";
import { mkdir, readdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

import { MEDIA_SOURCE_DIR, hasMediaSource } from "./mediaSource.ts";
import { slugify } from "./slug.ts";

const ROOT_DIR = path.resolve(import.meta.dirname, "..");
const SOURCE_DIR = MEDIA_SOURCE_DIR;
const OUTPUT_DIR = path.join(ROOT_DIR, ".media-build");
const MANIFEST_PATH = path.join(ROOT_DIR, "src", "data", "media.generated.json");
const STATE_FILE = ".state.json";
const STATE_PATH = path.join(OUTPUT_DIR, STATE_FILE);
const TEMP_SUFFIX = ".tmp";
const RETIRED_SUFFIX = ".old";
const URL_PREFIX = "/media/";
const LOG = "[media]";
const WEBP_QUALITY = 78;
const PDF_PROBE_SCALE = 0.05;
const PDF_OVERSAMPLE = 1.25;
const VIDEO_MAX_WIDTH = 1920;
const VIDEO_MAX_HEIGHT = 1080;
const VIDEO_CRF = "24";
const VIDEO_AUDIO_BITRATE = "128k";
const POSTER_SECOND = 1;
const HASH_LENGTH = 8;
const MEDIA_CACHE_VERSION = "2";
const DEFAULT_WIDTHS = [800, 1600];
const GROUP_WIDTHS: Record<string, number[]> = {
  life: [640, 1280],
  experience: [640, 1280],
  projects: [800, 1600],
  blog: [800, 1600],
  certifications: [600, 1200],
  badges: [160, 320],
};
const IMAGE_PATTERN = /\.(png|jpe?g|webp|avif|tiff?)$/i;
const VIDEO_PATTERN = /\.(mov|mp4|m4v|webm)$/i;
const PDF_PATTERN = /\.pdf$/i;
const LIFE_INDEX = "life.json";

type Aspect = "portrait" | "tall" | "square" | "landscape" | "wide";

type Entry = {
  type: "image" | "video";
  width: number;
  height: number;
  aspect: Aspect;
  src: string;
  srcSet?: string;
  poster?: string;
  duration?: number;
  title?: string;
  place?: string;
};

type Manifest = Record<string, Entry>;

type SourceState = { size: number; mtimeMs: number; widths: number[] };

type State = Record<string, SourceState>;

type Kind = "image" | "video" | "pdf";

type Asset = {
  key: string;
  group: string;
  slug: string;
  file: string;
  kind: Kind;
  title?: string;
  place?: string;
};

type LifeEntry = { file: string; title: string; place: string };

type Source = { input: string | Buffer; width: number; height: number };

function titleFromFile(file: string): string {
  return path
    .parse(file)
    .name.replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function classify(width: number, height: number): Aspect {
  const ratio = width / height;
  if (ratio < 0.7) return "portrait";
  if (ratio < 0.9) return "tall";
  if (ratio <= 1.1) return "square";
  if (ratio <= 1.5) return "landscape";
  return "wide";
}

async function hashFile(file: string): Promise<string> {
  const hash = createHash("sha1");
  hash.update(MEDIA_CACHE_VERSION);
  for await (const chunk of createReadStream(file)) hash.update(chunk as Buffer);
  return hash.digest("hex").slice(0, HASH_LENGTH);
}

async function replaceFile(temp: string, target: string) {
  try {
    await rename(temp, target);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "EPERM" && code !== "EBUSY" && code !== "EACCES") throw error;
    const retired = `${target}${RETIRED_SUFFIX}`;
    await rm(retired, { force: true }).catch(() => undefined);
    await rename(target, retired);
    await rename(temp, target);
    await rm(retired, { force: true }).catch(() => undefined);
  }
}

async function writeAtomic(file: string, content: string) {
  const temp = `${file}${TEMP_SUFFIX}`;
  await writeFile(temp, content, "utf8");
  await replaceFile(temp, file);
}

async function loadState(): Promise<State> {
  try {
    const parsed: unknown = JSON.parse(await readFile(STATE_PATH, "utf8"));
    return parsed && typeof parsed === "object" ? (parsed as State) : {};
  } catch {
    return {};
  }
}

async function sourceStateOf(asset: Asset): Promise<SourceState> {
  const info = await stat(asset.file);
  return {
    size: info.size,
    mtimeMs: info.mtimeMs,
    widths: asset.kind === "video" ? [] : widthsFor(asset.group),
  };
}

function sameState(left: SourceState | undefined, right: SourceState): boolean {
  return (
    !!left &&
    left.size === right.size &&
    left.mtimeMs === right.mtimeMs &&
    Array.isArray(left.widths) &&
    left.widths.length === right.widths.length &&
    left.widths.every((width, index) => width === right.widths[index])
  );
}

function kindOf(file: string): Kind | null {
  if (IMAGE_PATTERN.test(file)) return "image";
  if (VIDEO_PATTERN.test(file)) return "video";
  if (PDF_PATTERN.test(file)) return "pdf";
  return null;
}

async function loadPrevious(): Promise<Manifest> {
  try {
    const parsed: unknown = JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
    return parsed && typeof parsed === "object" ? (parsed as Manifest) : {};
  } catch {
    return {};
  }
}

async function loadLifeIndex(dir: string): Promise<LifeEntry[]> {
  const indexPath = path.join(dir, LIFE_INDEX);
  if (!existsSync(indexPath)) return [];
  const parsed: unknown = JSON.parse(await readFile(indexPath, "utf8"));
  if (!Array.isArray(parsed)) throw new Error(`${LIFE_INDEX} must be an array`);

  const seen = new Set<string>();
  const entries: LifeEntry[] = [];
  parsed.forEach((item: unknown, index) => {
    const entry = item as Partial<Record<keyof LifeEntry, unknown>> | null;
    const label = `${LIFE_INDEX} entry ${index}`;
    if (
      !entry ||
      typeof entry.file !== "string" ||
      typeof entry.title !== "string" ||
      typeof entry.place !== "string"
    ) {
      throw new Error(`${label} needs string file, title and place`);
    }
    if (entry.file.length === 0 || entry.file.includes("..") || /[\\/]/.test(entry.file)) {
      throw new Error(`${label} has an unsafe file name: ${JSON.stringify(entry.file)}`);
    }
    if (seen.has(entry.file)) {
      console.warn(`${LOG} ${entry.file} is listed twice in ${LIFE_INDEX}, keeping the first entry`);
      return;
    }
    seen.add(entry.file);
    entries.push({ file: entry.file, title: entry.title, place: entry.place });
  });
  return entries;
}

async function walk(dir: string, relative: string[] = []): Promise<string[][]> {
  const found: string[][] = [];
  const items = (await readdir(path.join(dir, ...relative), { withFileTypes: true })).sort(
    (a, b) => a.name.localeCompare(b.name),
  );
  for (const item of items) {
    if (item.name.startsWith(".")) continue;
    if (item.isDirectory()) found.push(...(await walk(dir, [...relative, item.name])));
    else found.push([...relative, item.name]);
  }
  return found;
}

async function collectAssets(): Promise<Asset[]> {
  const files = await walk(SOURCE_DIR);
  const lifeIndex = await loadLifeIndex(path.join(SOURCE_DIR, "life"));
  const lifeInfo = new Map(lifeIndex.map((entry) => [entry.file, entry]));
  const assets: Asset[] = [];
  const owners = new Map<string, string>();

  for (const parts of files) {
    const fileName = parts[parts.length - 1];
    const relative = parts.join("/");
    const kind = kindOf(fileName);
    if (!kind) {
      if (!(parts.length === 2 && parts[0] === "life" && fileName === LIFE_INDEX)) {
        console.warn(`${LOG} ${relative} is not a supported media file, ignored`);
      }
      continue;
    }
    if (parts.length < 2) {
      console.warn(`${LOG} ${relative} is not inside a group folder, ignored`);
      continue;
    }

    const dirSlugs = parts.slice(0, -1).map((part) => slugify(part));
    if (dirSlugs.some((slug) => !slug)) {
      throw new Error(`${relative} sits in a folder with no usable ASCII name, rename the folder`);
    }
    const slug = slugify(path.parse(fileName).name);
    if (!slug) throw new Error(`${relative} has no usable ASCII slug, rename the file`);

    const group = dirSlugs.join("/");
    const key = `${group}/${slug}`;
    const owner = owners.get(key);
    if (owner) throw new Error(`${relative} and ${owner} both produce "${key}", rename one`);
    owners.set(key, relative);

    const asset: Asset = { key, group, slug, file: path.join(SOURCE_DIR, ...parts), kind };
    if (group === "life" && parts.length === 2) {
      const info = lifeInfo.get(fileName);
      if (!info) {
        console.warn(`${LOG} ${relative} is not listed in ${LIFE_INDEX}, using the file name as title`);
      }
      asset.title = info?.title ?? titleFromFile(fileName);
      asset.place = info?.place ?? "";
    }
    assets.push(asset);
  }

  for (const entry of lifeIndex) {
    if (!files.some((parts) => parts.length === 2 && parts[0] === "life" && parts[1] === entry.file)) {
      console.warn(`${LOG} ${entry.file} is listed in ${LIFE_INDEX} but missing, skipped`);
    }
  }

  const lifeOrder = lifeIndex.map((entry) => entry.file);
  assets.sort((a, b) => {
    if (a.group !== b.group) return a.group.localeCompare(b.group);
    if (a.group === "life") {
      const left = lifeOrder.indexOf(path.basename(a.file));
      const right = lifeOrder.indexOf(path.basename(b.file));
      if (left !== right) return (left < 0 ? Infinity : left) - (right < 0 ? Infinity : right);
    }
    return a.slug.localeCompare(b.slug);
  });
  return assets;
}

function widthsFor(group: string): number[] {
  const top = group.split("/")[0];
  const widths = GROUP_WIDTHS[top];
  if (!widths) console.warn(`${LOG} no widths defined for group "${top}", using ${DEFAULT_WIDTHS.join("/")}`);
  return widths ?? DEFAULT_WIDTHS;
}

function urlOf(group: string, name: string, hash: string): string {
  return `${URL_PREFIX}${group}/${name}?v=${hash}`;
}

function outputsOf(entry: Entry): string[] {
  const urls = [entry.src, entry.poster ?? "", ...(entry.srcSet ?? "").split(",")];
  return urls
    .map((part) => part.trim().split(/\s+/)[0])
    .filter((url) => url.startsWith(URL_PREFIX))
    .map((url) => url.slice(URL_PREFIX.length).split("?")[0]);
}

async function reversion(entry: Entry): Promise<Entry> {
  const next: Entry = { ...entry };
  async function rewrite(url: string): Promise<string> {
    if (!url.startsWith(URL_PREFIX)) return url;
    const [file] = url.slice(URL_PREFIX.length).split("?");
    return `${URL_PREFIX}${file}?v=${await hashFile(path.join(OUTPUT_DIR, file))}`;
  }
  next.src = await rewrite(entry.src);
  if (entry.poster) next.poster = await rewrite(entry.poster);
  if (entry.srcSet) {
    const parts = await Promise.all(
      entry.srcSet.split(",").map(async (part) => {
        const [url, ...rest] = part.trim().split(/\s+/);
        return [await rewrite(url), ...rest].join(" ");
      }),
    );
    next.srcSet = parts.join(", ");
  }
  return next;
}

function isFresh(
  entry: Entry | undefined,
  stored: SourceState | undefined,
  current: SourceState,
): boolean {
  if (!entry || !sameState(stored, current)) return false;
  const outputs = outputsOf(entry);
  if (outputs.length === 0) return false;
  return outputs.every((output) => existsSync(path.join(OUTPUT_DIR, output)));
}

async function renderPdf(file: string, targetWidth: number): Promise<Buffer> {
  const { pdf } = await import("pdf-to-img");
  const probeDoc = await pdf(file, { scale: PDF_PROBE_SCALE });
  let pointWidth: number;
  try {
    const probe = await sharp(await probeDoc.getPage(1)).metadata();
    pointWidth = (probe.width ?? 0) / PDF_PROBE_SCALE;
  } finally {
    await probeDoc.destroy();
  }
  if (!pointWidth) throw new Error(`Unreadable PDF: ${file}`);
  const doc = await pdf(file, { scale: (targetWidth * PDF_OVERSAMPLE) / pointWidth });
  try {
    return await doc.getPage(1);
  } finally {
    await doc.destroy();
  }
}

async function loadSource(asset: Asset, targetWidth: number): Promise<Source> {
  let input: string | Buffer = asset.file;
  if (asset.kind === "pdf") {
    input = await renderPdf(asset.file, targetWidth);
  }
  const meta = await sharp(input).metadata();
  const swap = (meta.orientation ?? 1) >= 5;
  const width = swap ? (meta.height ?? 0) : (meta.width ?? 0);
  const height = swap ? (meta.width ?? 0) : (meta.height ?? 0);
  if (!width || !height) throw new Error(`Unreadable image: ${asset.file}`);
  return { input, width, height };
}

async function writeImageSet(
  source: Source,
  group: string,
  slug: string,
  widths: number[],
): Promise<{ src: string; srcSet: string; width: number; height: number }> {
  const targets = [...new Set(widths.map((width) => Math.min(width, source.width)))].sort(
    (a, b) => a - b,
  );
  await mkdir(path.join(OUTPUT_DIR, group), { recursive: true });

  const parts: string[] = [];
  let largest = { width: source.width, height: source.height, url: "" };
  for (const width of targets) {
    const name = `${slug}-${width}.webp`;
    const outputPath = path.join(OUTPUT_DIR, group, name);
    const tempPath = `${outputPath}${TEMP_SUFFIX}`;
    await sharp(source.input)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(tempPath);
    await replaceFile(tempPath, outputPath);
    const url = urlOf(group, name, await hashFile(outputPath));
    parts.push(`${url} ${width}w`);
    largest = { width, height: Math.round((source.height * width) / source.width), url };
  }
  return { src: largest.url, srcSet: parts.join(", "), width: largest.width, height: largest.height };
}

async function processImage(asset: Asset): Promise<Entry> {
  const widths = widthsFor(asset.group);
  const source = await loadSource(asset, Math.max(...widths));
  const set = await writeImageSet(source, asset.group, asset.slug, widths);
  return {
    type: "image",
    width: set.width,
    height: set.height,
    aspect: classify(source.width, source.height),
    src: set.src,
    srcSet: set.srcSet,
  };
}

function run(binary: string, args: string[]): Promise<{ code: number; stdout: Buffer; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(binary, args, { stdio: ["ignore", "pipe", "pipe"] });
    const out: Buffer[] = [];
    let err = "";
    child.stdout.on("data", (chunk: Buffer) => out.push(chunk));
    child.stderr.on("data", (chunk: Buffer) => {
      err += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => resolve({ code: code ?? 1, stdout: Buffer.concat(out), stderr: err }));
  });
}

async function resolveFfmpeg(): Promise<string | null> {
  try {
    const mod = (await import("ffmpeg-static")) as { default: string | null };
    return mod.default && existsSync(mod.default) ? mod.default : null;
  } catch {
    return null;
  }
}

function parseProbe(stderr: string): { duration: number; width: number; height: number } {
  const time = stderr.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
  const size = stderr.match(/Video:.*?,\s*(\d{2,5})x(\d{2,5})[\s,[]/);
  if (!time || !size) throw new Error("Could not read video metadata");
  const duration = Number(time[1]) * 3600 + Number(time[2]) * 60 + Number(time[3]);
  return { duration: Math.round(duration * 10) / 10, width: Number(size[1]), height: Number(size[2]) };
}

async function processVideo(asset: Asset, ffmpeg: string): Promise<Entry> {
  const outDir = path.join(OUTPUT_DIR, asset.group);
  await mkdir(outDir, { recursive: true });
  const mp4Name = `${asset.slug}.mp4`;
  const mp4Path = path.join(outDir, mp4Name);
  const scale = `scale=w='min(${VIDEO_MAX_WIDTH},iw)':h='min(${VIDEO_MAX_HEIGHT},ih)':force_original_aspect_ratio=decrease:force_divisible_by=2`;

  const mp4Temp = `${mp4Path}${TEMP_SUFFIX}`;
  const encoded = await run(ffmpeg, [
    "-y",
    "-i", asset.file,
    "-map", "0:v:0",
    "-map", "0:a:0?",
    "-vf", scale,
    "-c:v", "libx264",
    "-crf", VIDEO_CRF,
    "-preset", "medium",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac",
    "-b:a", VIDEO_AUDIO_BITRATE,
    "-movflags", "+faststart",
    "-f", "mp4",
    mp4Temp,
  ]);
  if (encoded.code !== 0) throw new Error(`ffmpeg failed on ${asset.file}\n${encoded.stderr.slice(-600)}`);

  const probe = parseProbe((await run(ffmpeg, ["-i", mp4Temp])).stderr);
  const posterAt = Math.min(POSTER_SECOND, probe.duration / 2);
  const frame = await run(ffmpeg, [
    "-ss", String(posterAt),
    "-i", mp4Temp,
    "-frames:v", "1",
    "-f", "image2pipe",
    "-vcodec", "png",
    "-",
  ]);
  if (frame.code !== 0 || frame.stdout.length === 0) {
    throw new Error(`Could not extract a poster from ${asset.file}`);
  }
  const posterName = `${asset.slug}-poster.webp`;
  const posterPath = path.join(outDir, posterName);
  const posterTemp = `${posterPath}${TEMP_SUFFIX}`;
  await sharp(frame.stdout).webp({ quality: WEBP_QUALITY }).toFile(posterTemp);
  await replaceFile(mp4Temp, mp4Path);
  await replaceFile(posterTemp, posterPath);

  return {
    type: "video",
    width: probe.width,
    height: probe.height,
    aspect: classify(probe.width, probe.height),
    src: urlOf(asset.group, mp4Name, await hashFile(mp4Path)),
    poster: urlOf(asset.group, posterName, await hashFile(posterPath)),
    duration: probe.duration,
  };
}

async function prune(manifest: Manifest) {
  const keep = new Set(Object.values(manifest).flatMap((entry) => outputsOf(entry)));

  async function sweep(dir: string, relative: string): Promise<boolean> {
    let empty = true;
    for (const item of await readdir(dir, { withFileTypes: true })) {
      const rel = relative ? `${relative}/${item.name}` : item.name;
      const full = path.join(dir, item.name);
      if (item.isDirectory()) {
        if (await sweep(full, rel)) await rm(full, { recursive: true, force: true });
        else empty = false;
      } else if (keep.has(rel) || (!relative && item.name === STATE_FILE)) {
        empty = false;
      } else {
        await rm(full, { force: true });
      }
    }
    return empty;
  }

  if (existsSync(OUTPUT_DIR)) await sweep(OUTPUT_DIR, "");
}

function describe(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

async function main() {
  if (!hasMediaSource()) {
    console.warn(`${LOG} media source folder not found, keeping the committed manifest`);
    return;
  }

  await mkdir(OUTPUT_DIR, { recursive: true });
  const previous = await loadPrevious();
  const previousState = await loadState();
  const assets = await collectAssets();
  const manifest: Manifest = {};
  const state: State = {};
  const failures: string[] = [];
  let ffmpeg: string | null | undefined;
  let built = 0;
  let skipped = 0;

  function keepPrevious(key: string) {
    const old = previous[key];
    if (!old) return;
    manifest[key] = old;
    if (previousState[key]) state[key] = previousState[key];
  }

  for (const asset of assets) {
    const relative = path.relative(SOURCE_DIR, asset.file).replaceAll(path.sep, "/");
    const old = previous[asset.key];

    try {
      const current = await sourceStateOf(asset);
      let entry: Entry;

      if (isFresh(old, previousState[asset.key], current)) {
        entry = await reversion(old);
        skipped += 1;
      } else if (asset.kind === "video") {
        if (ffmpeg === undefined) {
          ffmpeg = await resolveFfmpeg();
          if (!ffmpeg) console.warn(`${LOG} ffmpeg is not available, videos are skipped`);
        }
        if (!ffmpeg) {
          keepPrevious(asset.key);
          continue;
        }
        entry = await processVideo(asset, ffmpeg);
        built += 1;
      } else {
        entry = await processImage(asset);
        built += 1;
      }

      if (asset.title !== undefined) entry.title = asset.title;
      else delete entry.title;
      if (asset.place !== undefined) entry.place = asset.place;
      else delete entry.place;
      manifest[asset.key] = entry;
      state[asset.key] = current;
    } catch (error) {
      failures.push(`${relative}: ${describe(error)}`);
      keepPrevious(asset.key);
    }
  }

  const serialized = `${JSON.stringify(manifest, null, 2)}\n`;
  const currentManifest = await readFile(MANIFEST_PATH, "utf8").catch(() => "");
  if (currentManifest !== serialized) await writeAtomic(MANIFEST_PATH, serialized);
  await writeAtomic(STATE_PATH, `${JSON.stringify(state)}\n`);
  await prune(manifest);

  console.log(`${LOG} ${Object.keys(manifest).length} assets (${built} built, ${skipped} up to date)`);

  if (failures.length > 0) {
    console.error(`${LOG} ${failures.length} asset(s) failed:`);
    for (const failure of failures) console.error(`${LOG}   ${failure}`);
    process.exitCode = 1;
  }
}

main().catch((error: unknown) => {
  console.error(`${LOG} failed`, error);
  process.exitCode = 1;
});
