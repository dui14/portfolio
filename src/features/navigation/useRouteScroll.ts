import { useEffect, useRef } from "react";

import { resolveArrivalScroll } from "../../lib/router.ts";
import { waitForCondition } from "../../lib/scroll.ts";
import { usePathname } from "./useRoute.ts";

const FOCUS_TIMEOUT_MS = 1500;
const FOCUS_TARGET = "main h1";

function findFocusTarget(): HTMLElement | null {
  return (
    document.querySelector<HTMLElement>(FOCUS_TARGET) ??
    document.getElementById("main-content")
  );
}

function focusPage() {
  const target = findFocusTarget();

  if (!target) return;

  if (!target.hasAttribute("tabindex")) {
    target.setAttribute("tabindex", "-1");
  }

  target.focus({ preventScroll: true });
}

export function useRouteScroll() {
  const pathname = usePathname();
  const handled = useRef<string | null>(null);

  useEffect(() => {
    if (handled.current === pathname) return;

    const isInitial = handled.current === null;
    handled.current = pathname;

    resolveArrivalScroll(isInitial, () => {
      if (isInitial) return;

      waitForCondition(
        () => document.querySelector(FOCUS_TARGET) !== null,
        focusPage,
        FOCUS_TIMEOUT_MS
      );
    });
  }, [pathname]);
}
