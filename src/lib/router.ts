import { scrollToPosition, scrollToSection, waitForCondition } from "./scroll.ts";

export type Route =
  | { name: "home" }
  | { name: "blog" }
  | { name: "post"; slug: string }
  | { name: "project"; id: string }
  | { name: "notFound" };

const BLOG_PATH = "/blog";
const POST_PATH = /^\/blog\/([^/]+)$/;
const PROJECT_PATH = /^\/projects\/([^/]+)$/;
const INDEX_FILE = /\/index\.html$/i;
const SCROLL_SAVE_INTERVAL_MS = 300;
const ARRIVAL_TIMEOUT_MS = 1500;
const STABLE_FRAMES = 5;
const INTENT_EVENTS = ["wheel", "touchstart", "keydown"] as const;

const listeners = new Set<() => void>();

function normalizePath(pathname: string): string {
  const withoutIndex = pathname.replace(INDEX_FILE, "/");

  if (withoutIndex.length > 1 && withoutIndex.endsWith("/")) {
    return withoutIndex.slice(0, -1);
  }

  return withoutIndex;
}

function readSavedScroll(): number {
  const state: unknown = window.history.state;

  return typeof state === "object" &&
    state !== null &&
    "scrollY" in state &&
    typeof state.scrollY === "number"
    ? state.scrollY
    : 0;
}

let pathname =
  typeof window === "undefined" ? "/" : normalizePath(window.location.pathname);

let saveTimer = 0;
let cancelArrival: (() => void) | null = null;

function emit() {
  listeners.forEach((listener) => listener());
}

function saveScroll() {
  window.clearTimeout(saveTimer);
  saveTimer = 0;

  if (cancelArrival) return;

  const state: unknown = window.history.state;
  const base = typeof state === "object" && state !== null ? state : {};

  window.history.replaceState({ ...base, scrollY: window.scrollY }, "");
}

function scheduleSave() {
  if (saveTimer) return;

  saveTimer = window.setTimeout(saveScroll, SCROLL_SAVE_INTERVAL_MS);
}

function cancelPendingSave() {
  window.clearTimeout(saveTimer);
  saveTimer = 0;
}

function stopArrival() {
  cancelArrival?.();
  cancelArrival = null;
}

if (typeof window !== "undefined") {
  window.history.scrollRestoration = "manual";

  if (pathname !== window.location.pathname) {
    window.history.replaceState(
      window.history.state,
      "",
      pathname + window.location.search + window.location.hash
    );
  }

  window.addEventListener("scroll", scheduleSave, { passive: true });
  window.addEventListener("pagehide", saveScroll);

  window.addEventListener("popstate", () => {
    cancelPendingSave();

    const nextPath = normalizePath(window.location.pathname);

    if (nextPath === pathname) {
      resolveArrivalScroll(false);
      return;
    }

    pathname = nextPath;
    emit();
  });
}

export function parseRoute(path: string): Route {
  if (path === "/") return { name: "home" };
  if (path === BLOG_PATH) return { name: "blog" };

  const match = POST_PATH.exec(path);

  if (match) {
    try {
      return { name: "post", slug: decodeURIComponent(match[1]) };
    } catch {
      return { name: "notFound" };
    }
  }

  const projectMatch = PROJECT_PATH.exec(path);

  if (projectMatch) {
    try {
      return { name: "project", id: decodeURIComponent(projectMatch[1]) };
    } catch {
      return { name: "notFound" };
    }
  }

  return { name: "notFound" };
}

export function subscribeLocation(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getPathnameSnapshot() {
  return pathname;
}

export function isInternalUrl(href: string): boolean {
  try {
    const url = new URL(href, window.location.href);

    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      url.origin === window.location.origin
    );
  } catch {
    return false;
  }
}

function decodeHash(hash: string): string {
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return hash.slice(1);
  }
}

export function navigate(to: string) {
  if (!isInternalUrl(to)) {
    window.location.assign(to);
    return;
  }

  const url = new URL(to, window.location.href);
  const nextPath = normalizePath(url.pathname);

  cancelPendingSave();
  stopArrival();
  saveScroll();

  if (nextPath === pathname) {
    if (url.hash) {
      if (url.hash !== window.location.hash) {
        window.history.pushState({ scrollY: 0 }, "", nextPath + url.search + url.hash);
      }

      scrollToSection(decodeHash(url.hash));
    } else if (nextPath === "/") {
      scrollToSection("home");
    } else {
      scrollToPosition(0);
    }

    return;
  }

  window.history.pushState({ scrollY: 0 }, "", nextPath + url.search + url.hash);
  pathname = nextPath;
  emit();
}

function startArrival(
  check: () => boolean,
  action: () => void,
  onSettled?: () => void
) {
  let settled = false;

  function removeIntent() {
    INTENT_EVENTS.forEach((name) => window.removeEventListener(name, onIntent));
  }

  function onIntent() {
    removeIntent();
    stopArrival();
  }

  const cancel = waitForCondition(
    check,
    () => {
      settled = true;
      cancelArrival = null;
      removeIntent();
      action();
      onSettled?.();
    },
    ARRIVAL_TIMEOUT_MS
  );

  if (settled) return;

  INTENT_EVENTS.forEach((name) =>
    window.addEventListener(name, onIntent, { passive: true })
  );

  cancelArrival = () => {
    removeIntent();
    cancel();
  };
}

export function resolveArrivalScroll(isInitial: boolean, onSettled?: () => void) {
  stopArrival();

  const savedY = readSavedScroll();
  const hash = decodeHash(window.location.hash);

  if (hash && savedY === 0) {
    let lastHeight = -1;
    let stableFrames = 0;

    startArrival(
      () => {
        if (document.getElementById(hash) === null) return false;

        const height = document.documentElement.scrollHeight;
        stableFrames = height === lastHeight ? stableFrames + 1 : 0;
        lastHeight = height;

        return stableFrames >= STABLE_FRAMES;
      },
      () => scrollToSection(hash, { immediate: true }),
      onSettled
    );
    return;
  }

  if (isInitial && savedY === 0) {
    onSettled?.();
    return;
  }

  startArrival(
    () =>
      savedY === 0 ||
      document.documentElement.scrollHeight >= savedY + window.innerHeight,
    () => scrollToPosition(savedY),
    onSettled
  );
}
