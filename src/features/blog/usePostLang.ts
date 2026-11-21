import { useCallback, useState } from "react";

import { isBlogLang, pickLang } from "../../domain/blog.ts";
import type { BlogLang, BlogPostGroup } from "../../domain/blog.ts";
import type { LanguageId } from "../../lib/i18n.ts";

const LANG_PARAM = "lang";

function readRequestedLang(group: BlogPostGroup): BlogLang | null {
  if (typeof window === "undefined") return null;

  const value = new URLSearchParams(window.location.search).get(LANG_PARAM);

  return isBlogLang(value) && group.versions[value] ? value : null;
}

export function usePostLang(group: BlogPostGroup, uiLanguage: LanguageId) {
  const [selected, setSelected] = useState<BlogLang | null>(() =>
    readRequestedLang(group)
  );

  const lang = selected ?? pickLang(group, uiLanguage);

  const select = useCallback((next: BlogLang) => {
    setSelected(next);

    const params = new URLSearchParams(window.location.search);
    params.set(LANG_PARAM, next);

    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}?${params.toString()}${window.location.hash}`
    );
  }, []);

  return { lang, select };
}
