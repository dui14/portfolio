import type { LanguageId } from "../lib/i18n.ts";

export type ExperienceSide = "left" | "right";

export type ExperienceText = Record<LanguageId, string>;

export type ExperienceItem = {
  id: string;
  period: ExperienceText;
  title: ExperienceText;
  description: ExperienceText;
  image?: string;
  tags?: string[];
  side?: ExperienceSide;
};
