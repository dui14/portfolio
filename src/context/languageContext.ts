import { createContext } from "react";

import type { LanguageId } from "../lib/i18n.ts";
import type { Translation } from "../data/translations.ts";

export type LanguageContextType = {
  language: LanguageId;
  setLanguage: (language: LanguageId) => void;
  t: Translation;
};

export const LanguageContext = createContext<LanguageContextType | null>(null);
