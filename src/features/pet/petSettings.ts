import { useSyncExternalStore } from "react";

import type { PetSettings } from "../../domain/pet.ts";
import { useReducedMotion } from "../../hooks/useReducedMotion.ts";
import {
  DEFAULT_PET_SETTINGS,
  isPetStorageEvent,
  readPetSettings,
  writePetSettings,
} from "../../services/petStore.ts";
import { PET_FINE_POINTER_QUERY } from "./petConfig.ts";

const listeners = new Set<() => void>();
let cached: PetSettings | null = null;

function getSnapshot(): PetSettings {
  if (!cached) cached = readPetSettings();
  return cached;
}

function write(next: PetSettings) {
  cached = next;
  writePetSettings(next);
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (!isPetStorageEvent(event)) return;
    cached = readPetSettings();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getServerSnapshot(): PetSettings {
  return DEFAULT_PET_SETTINGS;
}

export function setPetEnabled(enabled: boolean) {
  write({ ...getSnapshot(), enabled });
}

export function setPetSound(sound: boolean) {
  write({ ...getSnapshot(), sound });
}

export function getPetSound(): boolean {
  return getSnapshot().sound;
}

export function usePetSettings(): PetSettings {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function subscribePointer(listener: () => void) {
  const media = window.matchMedia(PET_FINE_POINTER_QUERY);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}

function getPointerSnapshot() {
  return window.matchMedia(PET_FINE_POINTER_QUERY).matches;
}

export function usePetAvailable(): boolean {
  return useSyncExternalStore(subscribePointer, getPointerSnapshot, () => false);
}

export function usePetEnabled(): boolean {
  const { enabled } = usePetSettings();
  const reducedMotion = useReducedMotion();
  return enabled ?? !reducedMotion;
}
