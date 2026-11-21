import { useEffect, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!active || !container) return;

    const previous = document.activeElement as HTMLElement | null;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab" || !container) return;

      const nodes = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((node) => node.offsetParent !== null);

      if (nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const current = document.activeElement;

      if (event.shiftKey && (current === first || !container.contains(current))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (current === last || !container.contains(current))) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previous?.focus();
    };
  }, [containerRef, active]);
}
