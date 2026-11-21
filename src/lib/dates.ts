import type { LanguageId } from "./i18n.ts";

export const DATE_LOCALES: Record<LanguageId, string> = {
  en: "en-US",
  vi: "vi-VN",
  zh: "zh-CN",
  ja: "ja-JP",
};

export function createMonthYearFormatter(language: LanguageId) {
  const formatter = new Intl.DateTimeFormat(DATE_LOCALES[language], {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  return (iso: string) => formatter.format(new Date(`${iso}T00:00:00Z`));
}
