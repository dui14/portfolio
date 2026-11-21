import { useEffect, useState } from "react";

import { DEFAULT_LANGUAGE, isLanguageId, type LanguageId } from "../lib/i18n.ts";
import { translations } from "../data/translations.ts";
import { LanguageContext } from "./languageContext.ts";

const STORAGE_KEY = "duii-language";

function getInitialLanguage(): LanguageId {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (isLanguageId(stored)) return stored;
  } catch {
    return DEFAULT_LANGUAGE;
  }

  return DEFAULT_LANGUAGE;
}

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState<LanguageId>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;

    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      return;
    }
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
