import type { LanguageId } from "../lib/i18n.ts";

export type LocalizedText = Record<LanguageId, string>;

export type ProjectImage = {
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
  alt: LocalizedText;
  fit?: "cover" | "contain";
};

export type ProjectVideo = {
  src: string;
  poster: string;
  width: number;
  height: number;
  label: LocalizedText;
};

export type ProjectTerminal = {
  title: string;
  banner: string;
  tagline: string;
  status: string;
  hint: string;
  prompt: string;
  filter: string;
  menu: string[];
  description: LocalizedText;
};

export type ProjectVisual =
  | { kind: "image"; image: ProjectImage }
  | { kind: "terminal"; terminal: ProjectTerminal };

export type ProjectLinks = {
  live?: string;
  github?: string;
};

export type ProjectGalleryItem = {
  key: string;
  alt: LocalizedText;
};

export type ProjectResult = {
  value: string;
  label: LocalizedText;
};

export type Project = {
  id: string;
  title: string;
  summary: LocalizedText;
  problem: LocalizedText;
  features: Record<LanguageId, string[]>;
  stack: string[];
  links: ProjectLinks;
  results: ProjectResult[];
  security?: Record<LanguageId, string[]>;
  openSource: boolean;
  visual: ProjectVisual;
  demoVideo?: ProjectVideo;
  roadmap?: Record<LanguageId, string[]>;
  gallery?: ProjectGalleryItem[];
  relatedPost?: string;
};
