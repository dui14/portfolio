import { motion, useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";

import { useLanguage } from "../../context/useLanguage.ts";
import { metrics } from "../../data/metrics.ts";
import type { Metric } from "../../domain/metric.ts";
import { useReducedMotion } from "../../hooks/useReducedMotion.ts";
import { staggerVariants, staggerItemVariants } from "../../lib/motion.ts";

function useCountUp(target: number, active: boolean, duration: number = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;

    const startTime = Date.now();
    let frame = 0;

    function update() {
      const progress = Math.min((Date.now() - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(progress >= 1 ? target : Math.floor(target * easeOut));
      if (progress < 1) frame = requestAnimationFrame(update);
    }

    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return count;
}

export function Metrics() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      variants={reducedMotion ? undefined : staggerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="mt-[var(--space-8)] grid grid-cols-3 gap-[var(--space-4)] border-t border-[var(--border)] pt-[var(--space-6)] sm:gap-[var(--space-6)]"
    >
      {metrics.map((metric) => (
        <MetricItem key={metric.id} metric={metric} start={isInView} />
      ))}
    </motion.div>
  );
}

function MetricItem({
  metric,
  start,
}: {
  metric: Metric;
  start: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const { t } = useLanguage();
  const animated = useCountUp(metric.value, start && !reducedMotion);
  const count = reducedMotion ? metric.value : animated;
  const finalText = `${metric.value}${metric.suffix ?? ""}`;
  const label = t.hero.metrics[metric.id];

  return (
    <motion.div
      variants={reducedMotion ? undefined : staggerItemVariants}
      className="min-w-0 text-left"
    >
      <p className="whitespace-nowrap text-h2 font-semibold tabular-nums tracking-tight text-[var(--text)] sm:text-h1">
        <span aria-hidden="true">
          {count}
          {metric.suffix}
        </span>
        <span className="sr-only">{finalText}</span>
      </p>
      <p className="mt-[var(--space-1)] text-xs text-[var(--muted)] sm:text-sm">
        {label}
      </p>
    </motion.div>
  );
}
