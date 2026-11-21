import generated from "./media.generated.json" with { type: "json" };

export type MediaAspect = "portrait" | "tall" | "square" | "landscape" | "wide";

type MediaBase = {
  key: string;
  width: number;
  height: number;
  aspect: MediaAspect;
  src: string;
  title?: string;
  place?: string;
};

export type MediaImage = MediaBase & {
  type: "image";
  srcSet: string;
};

export type MediaVideo = MediaBase & {
  type: "video";
  poster: string;
  duration: number;
};

export type MediaEntry = MediaImage | MediaVideo;

type RawEntry = Omit<MediaImage, "key"> | Omit<MediaVideo, "key">;

const entries: MediaEntry[] = Object.entries(generated as unknown as Record<string, RawEntry>).map(
  ([key, entry]) => ({ ...entry, key }),
);

const byKey = new Map(entries.map((entry) => [entry.key, entry]));

function warnMissing(kind: string, key: string) {
  if ((import.meta as { env?: { DEV?: boolean } }).env?.DEV) console.warn(`[media] missing ${kind} "${key}", run npm run media`);
}

export function getImage(key: string): MediaImage | undefined {
  const entry = byKey.get(key);
  if (entry?.type === "image") return entry;
  warnMissing("image", key);
  return undefined;
}

export function getVideo(key: string): MediaVideo | undefined {
  const entry = byKey.get(key);
  if (entry?.type === "video") return entry;
  warnMissing("video", key);
  return undefined;
}

export function listGroup(group: string): MediaEntry[] {
  const prefix = `${group}/`;
  return entries.filter((entry) => entry.key.startsWith(prefix));
}
