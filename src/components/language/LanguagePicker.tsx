import { useLanguage } from "../../context/useLanguage.ts";
import { languages, type Language } from "../../lib/i18n.ts";
import { RadioGroup } from "../ui/RadioGroup.tsx";

type LanguagePickerProps = {
  label: string;
  size?: "md" | "lg";
};

export function LanguagePicker({ label, size = "md" }: LanguagePickerProps) {
  const { language, setLanguage } = useLanguage();
  const heightClass = size === "lg" ? "min-h-11" : "min-h-9 [@media(pointer:coarse)]:min-h-11";

  function handleChange(item: Language) {
    setLanguage(item.id);
  }

  return (
    <RadioGroup
      items={languages}
      value={language}
      onChange={handleChange}
      label={label}
      className="grid grid-cols-4 gap-[var(--space-1)] rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg)] p-[var(--space-1)]"
      renderItem={(item, checked, props) => (
        <button
          key={item.id}
          {...props}
          lang={item.id}
          aria-label={item.nativeName}
          className={`${heightClass} rounded-[calc(var(--radius-sm)-var(--space-1))] px-[var(--space-2)] text-sm font-medium transition-colors duration-[var(--dur-fast)] ${
            checked
              ? "bg-[var(--text)] text-[var(--bg)]"
              : "text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
          }`}
        >
          {item.short}
        </button>
      )}
    />
  );
}
