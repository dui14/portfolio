import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { useFocusTrap } from "../../features/navigation/useFocusTrap.ts";
import { useScrollLock } from "../../features/navigation/useScrollLock.ts";

const AUTOFOCUS_SELECTOR = "[data-autofocus]";
const FOCUSABLE_SELECTOR = "button:not([disabled]), a[href]";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  panelClassName?: string;
};

export function Dialog({
  open,
  onClose,
  children,
  title,
  panelClassName = "max-w-2xl",
}: DialogProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useScrollLock(open);
  useFocusTrap(panelRef, open);

  useEffect(() => {
    if (!open) return;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const firstFocusable =
      panel?.querySelector<HTMLElement>(AUTOFOCUS_SELECTOR) ??
      panel?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    (firstFocusable ?? panel)?.focus();
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-[var(--space-4)]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
    >
      <div
        className="absolute inset-0 bg-[var(--text)] opacity-40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        className={`relative w-full max-h-[90vh] overflow-y-auto rounded-[var(--radius-lg)] bg-[var(--bg)] border border-[var(--border)] shadow-[var(--shadow-lg)] p-[var(--space-6)] outline-none ${panelClassName}`}
      >
        {title && (
          <h2 id={titleId} className="text-h2 font-bold mb-[var(--space-4)]">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}
