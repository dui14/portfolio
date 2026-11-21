import type { PetSettings } from "../domain/pet.ts";

const STORAGE_KEY = "duii-pet";
const STORAGE_VERSION = 2;

export const DEFAULT_PET_SETTINGS: PetSettings = { enabled: null, sound: true };

export function readPetSettings(): PetSettings {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PET_SETTINGS;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return DEFAULT_PET_SETTINGS;
    const { enabled, sound, version } = parsed as Record<string, unknown>;
    return {
      enabled: typeof enabled === "boolean" ? enabled : null,
      sound: version === STORAGE_VERSION && typeof sound === "boolean" ? sound : DEFAULT_PET_SETTINGS.sound,
    };
  } catch {
    return DEFAULT_PET_SETTINGS;
  }
}

export function writePetSettings(settings: PetSettings) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...settings, version: STORAGE_VERSION }));
  } catch {
    return;
  }
}

export function isPetStorageEvent(event: StorageEvent): boolean {
  return event.key === STORAGE_KEY;
}
