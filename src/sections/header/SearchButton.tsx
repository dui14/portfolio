import { Search } from "lucide-react";

import { useLanguage } from "../../context/useLanguage.ts";
import { getShortcutHint } from "../../features/navigation/getShortcutHint.ts";
import { useCommandPalette } from "../../features/search/useCommandPalette.ts";

type SearchButtonProps = {
  variant: "pill" | "icon";
};

export function SearchButton({ variant }: SearchButtonProps) {
  const { t } = useLanguage();
  const { open } = useCommandPalette();

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={open}
        aria-label={t.header.openPalette}
        className="inline-flex size-11 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text)] transition-colors duration-[var(--dur-fast)] hover:bg-[var(--surface-2)] active:scale-[0.98]"
      >
        <Search className="size-5" strokeWidth={1.75} aria-hidden="true" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={open}
      aria-label={t.header.openPalette}
      className="inline-flex min-h-9 items-center gap-[var(--space-2)] whitespace-nowrap rounded-[var(--radius-full)] border border-[var(--border)] px-[var(--space-3)] text-xs text-[var(--muted)] transition-colors duration-[var(--dur-fast)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] active:scale-[0.98]"
    >
      <Search className="size-4" strokeWidth={1.75} aria-hidden="true" />
      <span className="font-mono">{getShortcutHint()}</span>
    </button>
  );
}
