import { useEffect } from "react";

import { siteConfig } from "../../config/site.ts";
import { applyDocumentMeta } from "../../lib/documentMeta.ts";
import type { DocumentMeta } from "../../lib/documentMeta.ts";

export type PageMeta = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  type?: "website" | "article";
  twitterCard?: "summary" | "summary_large_image";
  robots?: "noindex";
};

function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

export function buildDocumentMeta(meta: PageMeta): DocumentMeta {
  return {
    title: meta.title,
    description: meta.description,
    url: absoluteUrl(meta.path),
    image: absoluteUrl(meta.image ?? siteConfig.home.image),
    imageAlt: meta.imageAlt ?? siteConfig.home.imageAlt,
    imageWidth: meta.imageWidth ?? siteConfig.home.imageWidth,
    imageHeight: meta.imageHeight ?? siteConfig.home.imageHeight,
    type: meta.type ?? "website",
    twitterCard:
      meta.twitterCard ?? (meta.type === "article" ? "summary_large_image" : "summary"),
    robots: meta.robots,
  };
}

export function usePageMeta(meta: PageMeta) {
  const { title, description, path, image, imageAlt, imageWidth, imageHeight, type, twitterCard, robots } =
    meta;

  useEffect(() => {
    applyDocumentMeta(
      buildDocumentMeta({
        title,
        description,
        path,
        image,
        imageAlt,
        imageWidth,
        imageHeight,
        type,
        twitterCard,
        robots,
      })
    );
  }, [
    title,
    description,
    path,
    image,
    imageAlt,
    imageWidth,
    imageHeight,
    type,
    twitterCard,
    robots,
  ]);
}
