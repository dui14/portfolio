import type { LanguageId } from "../../lib/i18n.ts";

export function formatPostDate(isoDate: string, language: LanguageId): string {
  const date = new Date(`${isoDate}T00:00:00Z`);

  return new Intl.DateTimeFormat(language, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(date);
}
