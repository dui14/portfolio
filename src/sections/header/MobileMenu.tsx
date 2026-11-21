import { X } from "lucide-react";
import { useEffect, useRef } from "react";

import { useLanguage } from "../../context/useLanguage.ts";
import { useFocusTrap } from "../../features/navigation/useFocusTrap.ts";
import { useScrollLock } from "../../features/navigation/useScrollLock.ts";
import { HeaderCta } from "./HeaderCta.tsx";
import { Location } from "./Location.tsx";
import { Navigation } from "./Navigation.tsx";
import { PreferencesPanel } from "./PreferencesPanel.tsx";
import { Profile } from "./Profile.tsx";

type MobileMenuProps = {
  onClose: () => void;
};

export function MobileMenu({ onClose }: MobileMenuProps) {
  const { t } = useLanguage();
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useFocusTrap(sheetRef, true);
  useScrollLock(true);

  useEffect(() => {
    closeRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      ref={sheetRef}
      role="dialog"
      aria-modal="true"
      aria-label={t.header.menuLabel}
      className="popover-panel fixed inset-0 z-[60] overflow-y-auto bg-[var(--bg)]"
    >
      <div className="mx-auto flex min-h-full w-full max-w-[var(--container)] flex-col px-[var(--space-4)] md:px-[var(--space-6)]">
        <div className="flex h-16 shrink-0 items-center justify-between">
          <Profile onNavigate={onClose} />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t.header.closeMenu}
            className="inline-flex size-11 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text)] transition-colors duration-[var(--dur-fast)] hover:bg-[var(--surface-2)] active:scale-[0.98]"
          >
            <X className="size-6" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-[var(--space-6)]">
          <Navigation variant="sheet" onNavigate={onClose} />
        </div>

        <div className="mt-[var(--space-8)]">
          <HeaderCta fullWidth onNavigate={onClose} />
        </div>

        <div className="mt-[var(--space-8)] flex flex-col gap-[var(--space-6)] border-t border-[var(--border)] pb-[var(--space-8)] pt-[var(--space-6)]">
          <Location inline />
          <PreferencesPanel size="lg" />
        </div>
      </div>
    </div>
  );
}
