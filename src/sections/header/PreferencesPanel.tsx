import { LanguagePicker } from "../../components/language/LanguagePicker.tsx";
import { PetToggles } from "../../components/pet/PetToggles.tsx";
import { ThemePicker } from "../../components/theme/ThemePicker.tsx";
import { useLanguage } from "../../context/useLanguage.ts";

type PreferencesPanelProps = {
  size?: "md" | "lg";
};

export function PreferencesPanel({ size = "md" }: PreferencesPanelProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-[var(--space-4)]">
      <section>
        <h3 className="mb-[var(--space-2)] font-mono text-xs uppercase tracking-[0.04em] text-[var(--muted)]">
          {t.header.themeLabel}
        </h3>
        <ThemePicker label={t.header.themeLabel} />
      </section>
      <section>
        <h3 className="mb-[var(--space-2)] font-mono text-xs uppercase tracking-[0.04em] text-[var(--muted)]">
          {t.header.languageLabel}
        </h3>
        <LanguagePicker label={t.header.languageLabel} size={size} />
      </section>
      <PetToggles />
    </div>
  );
}
