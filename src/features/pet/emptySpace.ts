import { PET_INTERACTIVE_SELECTOR } from "./petConfig.ts";

function hitsText(x: number, y: number): boolean {
  const doc = document as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node } | null;
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
  };
  let node: Node | null = null;
  if (doc.caretRangeFromPoint) {
    const range = doc.caretRangeFromPoint(x, y);
    node = range?.startContainer ?? null;
  } else if (doc.caretPositionFromPoint) {
    node = doc.caretPositionFromPoint(x, y)?.offsetNode ?? null;
  }
  if (!node || node.nodeType !== Node.TEXT_NODE) return false;
  const text = node.textContent ?? "";
  if (text.trim().length === 0) return false;
  const range = document.createRange();
  range.setStart(node, 0);
  range.setEnd(node, text.length);
  const hit = Array.from(range.getClientRects()).some(
    (rect) => x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom,
  );
  return hit;
}

export function isEmptySpace(event: MouseEvent): boolean {
  const target = event.target;
  if (!(target instanceof Element)) return false;
  if (target.closest(PET_INTERACTIVE_SELECTOR)) return false;
  return !hitsText(event.clientX, event.clientY);
}
