import { useLanguage } from "../../context/useLanguage.ts";
import type { BlogLang } from "../../domain/blog.ts";
import { languages } from "../../lib/i18n.ts";

type LanguageChipsProps = {
  available: BlogLang[];
  current: BlogLang;
  className?: string;
};

export function LanguageChips({
  available,
  current,
  className = "",
}: LanguageChipsProps) {
  const { t } = useLanguage();

  return (
    <ul
      aria-label={t.blog.readIn}
      className={`flex flex-wrap gap-[var(--space-1)] ${className}`}
    >
      {languages
        .filter((language) => available.includes(language.id))
        .map((language) => (
          <li
            key={language.id}
            lang={language.id}
            title={language.nativeName}
            className={`rounded-[var(--radius-sm)] border px-[var(--space-2)] py-[var(--space-1)] font-mono text-xs leading-none ${
              language.id === current
                ? "border-[var(--text)] text-[var(--text)]"
                : "border-[var(--border)] text-[var(--muted)]"
            }`}
          >
            {language.short}
          </li>
        ))}
    </ul>
  );
}
