export type PetState = "idle" | "run" | "chase" | "catch" | "bark" | "sleep";

export type PetHeading = "side" | "up" | "down";

export type PetMotion = "none" | "breathe" | "bob" | "hop" | "recoil";

export type PetAnimationName =
  | "idle"
  | "run"
  | "runUp"
  | "runDown"
  | "catch"
  | "bark"
  | "sleep";

export type PetPoint = {
  x: number;
  y: number;
};

export type PetAnimation = {
  frames: string[];
  fps: number;
  motion: PetMotion;
};

export type PetSkin = Record<string, string>;

export type PetManifest = {
  version: number;
  size: { width: number; height: number };
  defaultSkin: string;
  themeSkins: Record<string, string>;
  skins: Record<string, PetSkin>;
  animations: Record<PetAnimationName, PetAnimation>;
  sounds: string[];
};

export type PetSettings = {
  enabled: boolean | null;
  sound: boolean;
};

export const PET_MOTIONS: readonly PetMotion[] = ["none", "breathe", "bob", "hop", "recoil"];

export const PET_ANIMATION_NAMES: readonly PetAnimationName[] = [
  "idle",
  "run",
  "runUp",
  "runDown",
  "catch",
  "bark",
  "sleep",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return isRecord(value) && Object.values(value).every((item) => typeof item === "string");
}

function isAnimation(value: unknown): value is PetAnimation {
  return (
    isRecord(value) &&
    Array.isArray(value.frames) &&
    value.frames.length > 0 &&
    value.frames.every((frame) => typeof frame === "string") &&
    typeof value.fps === "number" &&
    value.fps > 0 &&
    typeof value.motion === "string" &&
    (PET_MOTIONS as readonly string[]).includes(value.motion) &&
    Number.isFinite(value.fps)
  );
}

export function parsePetManifest(value: unknown): PetManifest | null {
  if (!isRecord(value)) return null;
  const { size, defaultSkin, themeSkins, skins, animations, sounds } = value;
  if (
    !isRecord(size) ||
    typeof size.width !== "number" ||
    typeof size.height !== "number" ||
    !Number.isFinite(size.width) ||
    !Number.isFinite(size.height) ||
    size.width <= 0 ||
    size.height <= 0
  ) {
    return null;
  }
  if (typeof defaultSkin !== "string" || !isStringRecord(themeSkins)) return null;
  if (!isRecord(skins) || !Object.values(skins).every(isStringRecord)) return null;
  if (!isRecord(animations)) return null;
  if (!PET_ANIMATION_NAMES.every((name) => isAnimation(animations[name]))) return null;
  if (!Array.isArray(sounds) || !sounds.every((sound) => typeof sound === "string")) return null;
  const base = Object.hasOwn(skins, defaultSkin) ? skins[defaultSkin] : undefined;
  if (!base) return null;
  const frameKnown = PET_ANIMATION_NAMES.every((name) =>
    (animations[name] as PetAnimation).frames.every((frame) => Object.hasOwn(base as PetSkin, frame)),
  );
  if (!frameKnown) return null;
  return {
    version: typeof value.version === "number" ? value.version : 1,
    size: { width: size.width, height: size.height },
    defaultSkin,
    themeSkins,
    skins: skins as Record<string, PetSkin>,
    animations: animations as Record<PetAnimationName, PetAnimation>,
    sounds: sounds as string[],
  };
}
