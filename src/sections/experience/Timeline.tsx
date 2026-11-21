import { motion } from "motion/react";

import { useLanguage } from "../../context/useLanguage.ts";
import { experience } from "../../data/experience.ts";
import { useReducedMotion } from "../../hooks/useReducedMotion.ts";
import { useTimelineProgress } from "../../hooks/useTimelineProgress.ts";
import { TimelineNode } from "./TimelineNode.tsx";

const RAIL_POSITION = "left-[var(--space-2)] lg:left-1/2";
const GLOW = "shadow-[var(--shadow-glow)]";

export function Timeline() {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();
  const { containerRef, progress, top, dotOpacity, passedCount } =
    useTimelineProgress();

  if (experience.length === 0) {
    return (
      <div className="text-center py-[var(--space-16)] text-[var(--muted)]">
        <p className="text-lg">{t.experience.empty}</p>
      </div>
    );
  }

  const settled = reducedMotion ? experience.length : passedCount;

  return (
    <div ref={containerRef} className="relative">
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute top-0 bottom-0 w-0.5 -translate-x-1/2 bg-[var(--border)] ${RAIL_POSITION}`}
      />
      <motion.div
        aria-hidden="true"
        style={{ scaleY: reducedMotion ? 1 : progress, originY: 0 }}
        className={`pointer-events-none absolute top-0 bottom-0 w-0.5 -translate-x-1/2 bg-[var(--accent)] ${RAIL_POSITION}`}
      />
      {!reducedMotion && (
        <motion.div
          aria-hidden="true"
          style={{ top, opacity: dotOpacity }}
          className={`pointer-events-none absolute z-20 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)] ${GLOW} ${RAIL_POSITION}`}
        />
      )}

      <ol className="relative space-y-[var(--space-16)] pl-[var(--space-8)] lg:pl-0">
        {experience.map((item, index) => (
          <li key={item.id}>
            <TimelineNode
              item={item}
              index={index}
              passed={index < settled}
              active={!reducedMotion && index === settled - 1}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}
