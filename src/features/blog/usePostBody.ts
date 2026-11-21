import { useCallback, useEffect, useState } from "react";

import { postBodyLoaders } from "../../data/blog.ts";
import { bodyKey } from "../../domain/blog.ts";
import type { BlogLang } from "../../domain/blog.ts";

type Settled = {
  key: string;
  attempt: number;
  html: string | null;
};

export type PostBody =
  | { status: "loading" }
  | { status: "ready"; html: string }
  | { status: "error"; retry: () => void };

export function usePostBody(slug: string, lang: BlogLang): PostBody {
  const key = bodyKey(slug, lang);
  const [settled, setSettled] = useState<Settled | null>(null);
  const [attempt, setAttempt] = useState(0);
  const load = postBodyLoaders[key];

  useEffect(() => {
    if (!load) return;

    let cancelled = false;

    load()
      .then((module) => {
        if (!cancelled) setSettled({ key, attempt, html: module.default });
      })
      .catch(() => {
        if (!cancelled) setSettled({ key, attempt, html: null });
      });

    return () => {
      cancelled = true;
    };
  }, [load, key, attempt]);

  const retry = useCallback(() => {
    setSettled(null);
    setAttempt((count) => count + 1);
  }, []);

  if (!load) return { status: "error", retry };

  if (!settled || settled.key !== key || settled.attempt !== attempt) {
    return { status: "loading" };
  }

  if (settled.html === null) return { status: "error", retry };

  return { status: "ready", html: settled.html };
}
