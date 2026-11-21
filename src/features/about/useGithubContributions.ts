import { useCallback, useEffect, useState } from "react";

import { loadGithubContributions } from "../../data/githubContributions.ts";
import type { ContributionData } from "../../data/githubContributions.ts";

type Settled = { attempt: number; data: ContributionData | null };

type ContributionsState =
  | { status: "idle" | "loading" | "error"; data: null }
  | { status: "ready"; data: ContributionData };

export function useGithubContributions(enabled: boolean) {
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<Settled | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    loadGithubContributions()
      .then((data) => {
        if (!cancelled) setSettled({ attempt, data });
      })
      .catch(() => {
        if (!cancelled) setSettled({ attempt, data: null });
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, attempt]);

  const retry = useCallback(() => setAttempt((current) => current + 1), []);

  let state: ContributionsState = { status: "idle", data: null };
  if (enabled) {
    if (settled?.attempt !== attempt) state = { status: "loading", data: null };
    else if (settled.data) state = { status: "ready", data: settled.data };
    else state = { status: "error", data: null };
  }

  return { ...state, retry };
}
