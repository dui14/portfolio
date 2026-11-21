import { useMotionTemplate, useSpring } from "motion/react";
import type { FocusEvent, PointerEvent } from "react";

const PERSPECTIVE = 1400;
const MAX_ROTATE_Y = 10;
const MAX_ROTATE_X = 8;
const REST = { rotateX: 3, rotateY: -4, rotateZ: -1, scale: 0.96 } as const;
const ACTIVE_SCALE = 0.98;
const GLARE_CENTER = 50;
const SPRING = { stiffness: 260, damping: 24 } as const;

function ratio(value: number, start: number, size: number) {
  if (size <= 0) return 0.5;
  return Math.min(1, Math.max(0, (value - start) / size));
}

export function useCursorTilt(enabled: boolean) {
  const rotateX = useSpring(REST.rotateX, SPRING);
  const rotateY = useSpring(REST.rotateY, SPRING);
  const rotateZ = useSpring(REST.rotateZ, SPRING);
  const scale = useSpring(REST.scale, SPRING);
  const glare = useSpring(0, SPRING);
  const glareX = useSpring(GLARE_CENTER, SPRING);
  const glareY = useSpring(GLARE_CENTER, SPRING);

  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, color-mix(in srgb, var(--cc-text) 16%, transparent), transparent 55%)`;

  function rest() {
    rotateX.set(REST.rotateX);
    rotateY.set(REST.rotateY);
    rotateZ.set(REST.rotateZ);
    scale.set(REST.scale);
    glare.set(0);
  }

  function flatten() {
    rotateX.set(0);
    rotateY.set(0);
    rotateZ.set(0);
    scale.set(ACTIVE_SCALE);
  }

  function onPointerMove(event: PointerEvent<HTMLElement>) {
    if (!enabled || event.pointerType === "touch") return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ratio(event.clientX, rect.left, rect.width);
    const y = ratio(event.clientY, rect.top, rect.height);

    rotateY.set((x - 0.5) * 2 * MAX_ROTATE_Y);
    rotateX.set((0.5 - y) * 2 * MAX_ROTATE_X);
    rotateZ.set(0);
    scale.set(ACTIVE_SCALE);
    glareX.set(x * 100);
    glareY.set(y * 100);
    glare.set(1);
  }

  function onPointerLeave() {
    if (!enabled) return;
    rest();
  }

  function onFocus() {
    if (!enabled) return;
    flatten();
  }

  function onBlur(event: FocusEvent<HTMLElement>) {
    if (!enabled) return;
    if (event.currentTarget.contains(event.relatedTarget)) return;
    rest();
  }

  return {
    tiltStyle: enabled
      ? { rotateX, rotateY, rotateZ, scale, transformPerspective: PERSPECTIVE }
      : undefined,
    glareStyle: enabled ? { opacity: glare, background: glareBackground } : undefined,
    handlers: { onPointerMove, onPointerLeave, onFocus, onBlur },
  };
}
