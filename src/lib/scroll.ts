import type Lenis from "lenis";

type ScrollOptions = {
  immediate?: boolean;
};

let lenisInstance: Lenis | null = null;

export function registerLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

export function scrollToSection(id: string, options: ScrollOptions = {}) {
  const target = document.getElementById(id);

  if (!target) return;

  const immediate = options.immediate ?? false;

  if (lenisInstance) {
    lenisInstance.resize();
    lenisInstance.scrollTo(target, { offset: -80, immediate });
    return;
  }

  target.scrollIntoView({
    behavior: immediate ? "instant" : "smooth",
    block: "start",
  });
}

export function scrollToPosition(top: number) {
  if (lenisInstance) {
    lenisInstance.scrollTo(top, { immediate: true });
    return;
  }

  window.scrollTo({ top, behavior: "instant" });
}

export function setSmoothScrollLocked(locked: boolean) {
  if (!lenisInstance) return;

  if (locked) {
    lenisInstance.stop();
    return;
  }

  lenisInstance.start();
}

export function waitForCondition(
  check: () => boolean,
  onDone: () => void,
  timeoutMs: number
): () => void {
  const startedAt = performance.now();
  let frame = 0;
  let timer = 0;
  let finished = false;

  function finish() {
    if (finished) return;

    finished = true;
    cancelAnimationFrame(frame);
    window.clearTimeout(timer);
    onDone();
  }

  function tick() {
    if (finished) return;

    if (check() || performance.now() - startedAt >= timeoutMs) {
      finish();
      return;
    }

    frame = requestAnimationFrame(tick);
  }

  timer = window.setTimeout(finish, timeoutMs);
  tick();

  return () => {
    finished = true;
    cancelAnimationFrame(frame);
    window.clearTimeout(timer);
  };
}
