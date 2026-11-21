import { MapPin } from "lucide-react";

import { useLanguage } from "../../context/useLanguage.ts";
import { useLocalTime } from "../../features/navigation/useLocalTime.ts";

const TIME_PLACEHOLDER = "--:--";

type LocationProps = {
  inline?: boolean;
};

export function Location({ inline = false }: LocationProps) {
  const { t, language } = useLanguage();
  const { text, ready } = useLocalTime(language);
  const time = ready ? text : TIME_PLACEHOLDER;

  if (inline) {
    return (
      <p className="flex items-start gap-[var(--space-2)] font-mono text-xs uppercase tracking-[0.04em] text-[var(--muted)]">
        <MapPin
          className="mt-0.5 size-4 shrink-0"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <span>
          {t.header.location}
          {time ? ` · ${time}` : ""}
        </span>
      </p>
    );
  }

  return (
    <div className="flex items-start gap-[var(--space-3)] p-[var(--space-4)]">
      <MapPin
        className="mt-0.5 size-4 shrink-0 text-[var(--accent-text)]"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.04em] text-[var(--text)]">
          {t.header.location}
        </p>
        {time && (
          <p className="mt-[var(--space-1)] font-mono text-xs text-[var(--muted)]">
            {time}
          </p>
        )}
      </div>
    </div>
  );
}
