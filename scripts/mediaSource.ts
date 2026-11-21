import { existsSync } from "node:fs";
import path from "node:path";

const ROOT_DIR = path.resolve(import.meta.dirname, "..");
const SOURCE_ENV = "DUII_MEDIA_DIR";
const DEFAULT_SOURCE = "media";

export const MEDIA_SOURCE_DIR = process.env[SOURCE_ENV]
  ? path.resolve(process.env[SOURCE_ENV])
  : path.join(ROOT_DIR, DEFAULT_SOURCE);

export function hasMediaSource(): boolean {
  return existsSync(MEDIA_SOURCE_DIR);
}
