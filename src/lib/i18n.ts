export type LanguageId = "en" | "vi" | "zh" | "ja";

export type Language = {
  id: LanguageId;
  short: string;
  nativeName: string;
};

export const DEFAULT_LANGUAGE: LanguageId = "en";

export function isLanguageId(value: unknown): value is LanguageId {
  return languages.some((language) => language.id === value);
}

export const languages: Language[] = [
  { id: "en", short: "EN", nativeName: "English" },
  { id: "vi", short: "VI", nativeName: "Tiếng Việt" },
  { id: "zh", short: "中文", nativeName: "中文" },
  { id: "ja", short: "日本語", nativeName: "日本語" },
];
