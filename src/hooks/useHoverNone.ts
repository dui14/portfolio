import { useSyncExternalStore } from "react";

const QUERY = "(hover: none)";

function subscribe(listener: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export function useHoverNone(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
