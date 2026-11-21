import { listGroup } from "./media.ts";
import type { MediaAspect } from "./media.ts";

export type LifeAspect = MediaAspect;

export type LifePhoto = {
  slug: string;
  title: string;
  place: string;
  width: number;
  height: number;
  aspect: LifeAspect;
  src: string;
  srcSet: string;
};

const LIFE_GROUP = "life";

export const lifePhotos: LifePhoto[] = listGroup(LIFE_GROUP).flatMap((entry) =>
  entry.type === "image"
    ? [
        {
          slug: entry.key.slice(LIFE_GROUP.length + 1),
          title: entry.title ?? "",
          place: entry.place ?? "",
          width: entry.width,
          height: entry.height,
          aspect: entry.aspect,
          src: entry.src,
          srcSet: entry.srcSet,
        },
      ]
    : [],
);
