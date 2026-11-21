import { useEffect } from "react";

import { setSmoothScrollLocked } from "../../lib/scroll.ts";

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setSmoothScrollLocked(true);

    return () => {
      document.body.style.overflow = previousOverflow;
      setSmoothScrollLocked(false);
    };
  }, [active]);
}
