import {
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const SCROLL_OFFSET = ["start 70%", "end 60%"] as const;
const SPRING = { stiffness: 120, damping: 30, restDelta: 0.001 };
const DESKTOP_QUERY = "(min-width: 1024px)";
const DOT_SELECTOR = "[data-timeline-dot]";

export function useTimelineProgress() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fractions = useRef<number[]>([]);
  const [passedCount, setPassedCount] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: [...SCROLL_OFFSET],
  });
  const progress = useSpring(scrollYProgress, SPRING);
  const top = useTransform(progress, (value) => `${value * 100}%`);
  const dotOpacity = useTransform(progress, [0, 0.02, 0.98, 1], [0, 1, 1, 0]);

  const countPassed = useCallback((value: number) => {
    setPassedCount(fractions.current.filter((fraction) => fraction <= value).length);
  }, []);

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const box = container.getBoundingClientRect();
    if (box.height === 0) return;
    const next = Array.from(
      container.querySelectorAll<HTMLElement>(DOT_SELECTOR)
    )
      .filter((dot) => dot.getClientRects().length > 0)
      .map((dot) => {
        const rect = dot.getBoundingClientRect();
        return (rect.top + rect.height / 2 - box.top) / box.height;
      });
    fractions.current = next;
    countPassed(progress.get());
  }, [countPassed, progress]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    const media = window.matchMedia(DESKTOP_QUERY);
    media.addEventListener("change", measure);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", measure);
    };
  }, [measure]);

  useMotionValueEvent(progress, "change", countPassed);

  return { containerRef, progress, top, dotOpacity, passedCount };
}
