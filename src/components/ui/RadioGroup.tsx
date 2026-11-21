import { type KeyboardEvent, type ReactNode } from "react";

export type RadioItemProps = {
  role: "radio";
  type: "button";
  "aria-checked": boolean;
  tabIndex: 0 | -1;
  onClick: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
};

type RadioGroupProps<T extends { id: string }> = {
  items: readonly T[];
  value: string;
  onChange: (item: T) => void;
  label: string;
  renderItem: (item: T, checked: boolean, props: RadioItemProps) => ReactNode;
  className?: string;
};

const NEXT_KEYS = ["ArrowRight", "ArrowDown"];
const PREV_KEYS = ["ArrowLeft", "ArrowUp"];

export function RadioGroup<T extends { id: string }>({
  items,
  value,
  onChange,
  label,
  renderItem,
  className = "",
}: RadioGroupProps<T>) {
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === value)
  );

  function targetIndex(from: number, key: string) {
    if (NEXT_KEYS.includes(key)) return (from + 1) % items.length;
    if (PREV_KEYS.includes(key)) return (from - 1 + items.length) % items.length;
    if (key === "Home") return 0;
    if (key === "End") return items.length - 1;
    return -1;
  }

  function move(from: number, event: KeyboardEvent<HTMLButtonElement>) {
    const next = targetIndex(from, event.key);
    if (next < 0) return false;

    onChange(items[next]);
    event.currentTarget
      .closest("[role=radiogroup]")
      ?.querySelectorAll<HTMLElement>("[role=radio]")[next]?.focus();
    return true;
  }

  return (
    <div role="radiogroup" aria-label={label} className={className}>
      {items.map((item, index) => {
        const checked = index === activeIndex;

        return renderItem(item, checked, {
          role: "radio",
          type: "button",
          "aria-checked": checked,
          tabIndex: checked ? 0 : -1,
          onClick: () => onChange(item),
          onKeyDown: (event) => {
            if (move(index, event)) event.preventDefault();
          },
        });
      })}
    </div>
  );
}
