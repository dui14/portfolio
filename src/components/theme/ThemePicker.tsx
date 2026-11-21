import { motion } from "motion/react";
import { useState } from "react";

import { useThemeContext } from "../../context/useThemeContext.ts";
import { useReducedMotion } from "../../hooks/useReducedMotion.ts";
import { spring } from "../../lib/motion.ts";
import { themes } from "../../lib/themes.ts";
import { RadioGroup } from "../ui/RadioGroup.tsx";

const HOVER_SCALE = 1.1;

type ThemePickerProps = {
  label: string;
};

export function ThemePicker({ label }: ThemePickerProps) {
  const { theme, setTheme } = useThemeContext();
  const reducedMotion = useReducedMotion();
  const [previewId, setPreviewId] = useState<string | null>(null);
  const shown = themes.find((item) => item.id === previewId) ?? theme;

  return (
    <div>
      <RadioGroup
        items={themes}
        value={theme.id}
        onChange={setTheme}
        label={label}
        className="flex items-center gap-[var(--space-1)]"
        renderItem={(item, checked, props) => (
          <motion.button
            key={item.id}
            {...props}
            aria-label={item.name}
            onPointerEnter={() => setPreviewId(item.id)}
            onPointerLeave={() => setPreviewId(null)}
            onFocus={() => setPreviewId(item.id)}
            onBlur={() => setPreviewId(null)}
            whileHover={reducedMotion ? undefined : { scale: HOVER_SCALE }}
            transition={spring}
            className="flex size-11 items-center justify-center rounded-full"
          >
            <span
              className={`block size-7 rounded-full border border-[var(--border)] ${
                checked
                  ? "ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--surface)]"
                  : ""
              }`}
              style={{
                background: `linear-gradient(135deg, ${item.background} 50%, ${item.accent} 50%)`,
              }}
            />
          </motion.button>
        )}
      />
      <p
        className="mt-[var(--space-1)] min-h-5 text-sm text-[var(--muted)]"
        aria-live="polite"
      >
        {shown.name}
      </p>
    </div>
  );
}
