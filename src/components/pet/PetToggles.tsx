import { useLanguage } from "../../context/useLanguage.ts";
import {
  setPetEnabled,
  setPetSound,
  usePetAvailable,
  usePetEnabled,
  usePetSettings,
} from "../../features/pet/petSettings.ts";

type ToggleRowProps = {
  label: string;
  stateLabel: string;
  checked: boolean;
  onToggle: () => void;
};

function ToggleRow({ label, stateLabel, checked, onToggle }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-[var(--space-3)]">
      <span className="text-sm text-[var(--text)]">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onToggle}
        className={`min-h-9 min-w-16 rounded-[var(--radius-sm)] border border-[var(--border)] px-[var(--space-3)] text-sm font-medium transition-colors duration-[var(--dur-fast)] active:scale-[0.98] [@media(pointer:coarse)]:min-h-11 ${
          checked
            ? "bg-[var(--text)] text-[var(--bg)]"
            : "bg-[var(--bg)] text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
        }`}
      >
        {stateLabel}
      </button>
    </div>
  );
}

export function PetToggles() {
  const { t } = useLanguage();
  const available = usePetAvailable();
  const enabled = usePetEnabled();
  const { sound } = usePetSettings();

  if (!available) return null;

  return (
    <section className="flex flex-col gap-[var(--space-2)]">
      <ToggleRow
        label={t.pet.label}
        stateLabel={enabled ? t.pet.on : t.pet.off}
        checked={enabled}
        onToggle={() => setPetEnabled(!enabled)}
      />
      <ToggleRow
        label={t.pet.soundLabel}
        stateLabel={sound ? t.pet.on : t.pet.off}
        checked={sound}
        onToggle={() => setPetSound(!sound)}
      />
    </section>
  );
}
