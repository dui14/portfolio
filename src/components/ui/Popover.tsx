import {
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type PopoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerLabel: string;
  icon: ReactNode;
  children: ReactNode;
  panelClassName?: string;
};

export function Popover({
  open,
  onOpenChange,
  triggerLabel,
  icon,
  children,
  panelClassName = "",
}: PopoverProps) {
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;

    if (!panel) return;

    const first = panel.querySelector<HTMLElement>(FOCUSABLE);

    if (first) {
      first.focus();
      return;
    }

    panel.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      const root = rootRef.current;

      if (!root || root.contains(event.target as Node)) return;

      const hadFocus = root.contains(document.activeElement);

      onOpenChange(false);

      if (hadFocus) triggerRef.current?.focus();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      onOpenChange(false);
      triggerRef.current?.focus();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={(event) => {
        const next = event.relatedTarget;

        if (open && next instanceof Node && !event.currentTarget.contains(next)) {
          onOpenChange(false);
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={() => onOpenChange(!open)}
        aria-label={triggerLabel}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-haspopup="dialog"
        className={`inline-flex size-9 [@media(pointer:coarse)]:size-11 items-center justify-center rounded-[var(--radius-sm)] transition-colors duration-[var(--dur-fast)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] active:scale-[0.98] ${
          open
            ? "bg-[var(--surface-2)] text-[var(--text)]"
            : "text-[var(--muted)]"
        }`}
      >
        {icon}
      </button>

      {open && (
        <div
          id={panelId}
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-label={triggerLabel}
          className={`popover-panel absolute right-0 top-full mt-[var(--space-2)] z-10 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-md)] outline-none ${panelClassName}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
