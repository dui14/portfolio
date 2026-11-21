import { parsePetManifest, type PetManifest } from "../domain/pet.ts";

const FETCH_TIMEOUT_MS = 5000;

let failed = false;
let pending: Promise<PetManifest> | null = null;
const audios = new Map<string, HTMLAudioElement>();

function preloadImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => reject(new Error(`Pet frame failed: ${url}`));
    image.src = url;
  });
}

function preloadAudio(url: string) {
  if (audios.has(url)) return;
  const audio = new Audio();
  audio.preload = "auto";
  audio.src = url;
  audio.load();
  audios.set(url, audio);
}

async function fetchPet(manifestUrl: string): Promise<PetManifest> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(manifestUrl, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Pet manifest ${response.status}`);
    const manifest = parsePetManifest(await response.json());
    if (!manifest) throw new Error("Pet manifest is invalid");
    const urls = new Set(Object.values(manifest.skins).flatMap((skin) => Object.values(skin)));
    await Promise.all([...urls].map(preloadImage));
    manifest.sounds.forEach(preloadAudio);
    return manifest;
  } finally {
    window.clearTimeout(timer);
  }
}

export function isPetDisabled(): boolean {
  return failed;
}

export function disablePet() {
  failed = true;
}

export function loadPet(manifestUrl: string): Promise<PetManifest> {
  if (failed) return Promise.reject(new Error("Pet is disabled for this session"));
  if (!pending) {
    pending = fetchPet(manifestUrl).catch((error: unknown) => {
      failed = true;
      throw error;
    });
  }
  return pending;
}

export function playBark(sounds: string[], volume: number) {
  if (sounds.length === 0) return;
  const url = sounds[Math.floor(Math.random() * sounds.length)];
  preloadAudio(url);
  const audio = audios.get(url);
  if (!audio) return;
  audio.volume = volume;
  if (audio.currentTime > 0) audio.currentTime = 0;
  audio.play().catch(() => undefined);
}
