import { AppLink } from "../../components/ui/AppLink.tsx";
import { useLanguage } from "../../context/useLanguage.ts";

type HeaderCtaProps = {
  onNavigate?: () => void;
  fullWidth?: boolean;
};

export function HeaderCta({ onNavigate, fullWidth = false }: HeaderCtaProps) {
  const { t } = useLanguage();

  return (
    <AppLink
      href="/#contact"
      onNavigate={onNavigate}
      className={`group inline-flex items-center justify-center gap-[var(--space-2)] whitespace-nowrap rounded-[var(--radius-sm)] border border-[var(--text)] bg-transparent px-[var(--space-4)] text-sm font-medium text-[var(--text)] transition-all duration-[var(--dur-fast)] hover:bg-[var(--text)] hover:text-[var(--bg)] active:scale-[0.98] ${
        fullWidth ? "min-h-12 w-full" : "min-h-9"
      }`}
    >
      {t.header.cta}
      <span
        aria-hidden="true"
        className="transition-transform duration-[var(--dur-fast)] group-hover:translate-x-0.5"
      >
        →
      </span>
    </AppLink>
  );
}
