const MAC_PATTERN = /Mac|iPhone|iPad|iPod/i;

export function getShortcutHint(): string {
  if (typeof navigator === "undefined") return "Ctrl K";

  return MAC_PATTERN.test(navigator.userAgent) ? "⌘K" : "Ctrl K";
}
