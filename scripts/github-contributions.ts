import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT_DIR = path.resolve(import.meta.dirname, "..");
const OUTPUT_PATH = path.join(ROOT_DIR, "src", "data", "githubContributions.json");
const SITE_PATH = path.join(ROOT_DIR, "src", "config", "site.ts");
const BASE_URL = "https://github.com/users";
const MAX_YEARS = 5;
const TIMEOUT_MS = 15000;
const USER_AGENT = "Mozilla/5.0 (compatible; contributions-sync)";

type Day = { date: string; count: number; level: number };

type Range = { id: string; total: number; weeks: Day[][] };

type Output = { user: string; fetchedAt: string; ranges: Range[] };

async function readSiteConfig(): Promise<{ user: string; firstYear: number }> {
  const source = await readFile(SITE_PATH, "utf8");
  const user = source.match(/githubUser:\s*"([^"]+)"/);
  if (!user) throw new Error("githubUser not found in site config");
  const firstYear = source.match(/contributionsFirstYear:\s*(\d{4})/);
  if (!firstYear) throw new Error("contributionsFirstYear not found in site config");
  return { user: user[1], firstYear: Number(firstYear[1]) };
}

async function fetchCalendar(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: { "user-agent": USER_AGENT, accept: "text/html" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`${url} responded ${response.status}`);
  return response.text();
}

function attribute(tag: string, name: string): string | null {
  const match = tag.match(new RegExp(`[ \\t\\n]${name}="([^"]*)"`));
  return match ? match[1] : null;
}

function parseCount(text: string): number {
  const clean = text.trim();
  if (/^No contributions/i.test(clean)) return 0;
  const match = clean.match(/^(\d[\d,]*)\s+contributions?/i);
  if (!match) throw new Error(`Unrecognised tooltip: ${clean}`);
  return Number(match[1].replace(/,/g, ""));
}

function parseDays(html: string): Day[] {
  const counts = new Map<string, number>();
  for (const match of html.matchAll(/<tool-tip\b([^>]*)>([^<]*)<\/tool-tip>/g)) {
    const target = attribute(match[1], "for");
    if (target) counts.set(target, parseCount(match[2]));
  }

  const days: Day[] = [];
  for (const match of html.matchAll(/<td\b[^>]*\sdata-date="[^"]*"[^>]*>/g)) {
    const tag = match[0];
    const date = attribute(tag, "data-date");
    const level = Number(attribute(tag, "data-level"));
    const id = attribute(tag, "id");
    if (!date || !id || !Number.isInteger(level) || level < 0 || level > 4) {
      throw new Error(`Malformed day cell: ${tag}`);
    }
    const count = counts.get(id);
    if (count === undefined) throw new Error(`No tooltip for ${id}`);
    days.push({ date, count, level });
  }

  if (days.length === 0) throw new Error("No day cells found");
  return days.sort((a, b) => a.date.localeCompare(b.date));
}

function toWeeks(days: Day[]): Day[][] {
  const weeks: Day[][] = [];
  let current: Day[] = [];
  for (const day of days) {
    const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay();
    if (weekday === 0 && current.length > 0) {
      weeks.push(current);
      current = [];
    }
    current.push(day);
  }
  if (current.length > 0) weeks.push(current);
  return weeks;
}

async function buildRange(id: string, url: string): Promise<Range> {
  const days = parseDays(await fetchCalendar(url));
  const total = days.reduce((sum, day) => sum + day.count, 0);
  return { id, total, weeks: toWeeks(days) };
}

async function readExistingTotal(): Promise<number> {
  try {
    const existing = JSON.parse(await readFile(OUTPUT_PATH, "utf8")) as Output;
    return existing.ranges.find((range) => range.id === "last-year")?.total ?? 0;
  } catch {
    return 0;
  }
}

async function main() {
  const { user, firstYear } = await readSiteConfig();
  const currentYear = new Date().getUTCFullYear();
  const lastYear = await buildRange("last-year", `${BASE_URL}/${user}/contributions`);
  if (lastYear.total === 0 && (await readExistingTotal()) > 0) {
    console.warn(
      "[github-contributions] fetched total is 0 but existing data has contributions, kept existing file",
    );
    return;
  }
  const ranges: Range[] = [lastYear];

  const yearRanges: Range[] = [];
  for (let year = currentYear; year > currentYear - MAX_YEARS && year >= firstYear; year -= 1) {
    const url = `${BASE_URL}/${user}/contributions?from=${year}-01-01&to=${year}-12-31`;
    yearRanges.push(await buildRange(String(year), url));
  }

  const firstActive = yearRanges.reduce(
    (found, range, index) => (range.total > 0 ? index : found),
    -1,
  );
  ranges.push(...yearRanges.slice(0, firstActive + 1));

  const output: Output = { user, fetchedAt: new Date().toISOString(), ranges };
  await writeFile(OUTPUT_PATH, `${JSON.stringify(output)}\n`, "utf8");
  console.log(
    `[github-contributions] ${ranges.map((range) => `${range.id}=${range.total}`).join(" ")}`,
  );
}

main().catch((error: unknown) => {
  console.warn("[github-contributions] kept existing data:", error);
  process.exitCode = 0;
});
