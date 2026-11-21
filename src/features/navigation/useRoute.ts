import { useMemo, useSyncExternalStore } from "react";

import {
  getPathnameSnapshot,
  parseRoute,
  subscribeLocation,
} from "../../lib/router.ts";
import type { Route } from "../../lib/router.ts";

export function useRoute(): Route {
  const pathname = useSyncExternalStore(
    subscribeLocation,
    getPathnameSnapshot,
    () => "/"
  );

  return useMemo(() => parseRoute(pathname), [pathname]);
}

export function usePathname(): string {
  return useSyncExternalStore(subscribeLocation, getPathnameSnapshot, () => "/");
}
