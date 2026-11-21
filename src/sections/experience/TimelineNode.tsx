import { motion } from "motion/react";

import type { ExperienceItem } from "../../domain/experience.ts";
import { useLanguage } from "../../context/useLanguage.ts";
import { useScrollReveal } from "../../hooks/useScrollReveal.ts";
import { useReducedMotion } from "../../hooks/useReducedMotion.ts";
import { spring } from "../../lib/motion.ts";
import { ExperienceCard } from "./ExperienceCard.tsx";

type TimelineNodeProps = {
  item: ExperienceItem;
  index: number;
  passed: boolean;
  active: boolean;
};

export function TimelineNode({ item, index, passed, active }: TimelineNodeProps) {
  const { ref, isInView } = useScrollReveal({ amount: 0.3 });
  const reducedMotion = useReducedMotion();
  const { language } = useLanguage();

  const dotTone = passed ? "bg-[var(--accent)]" : "bg-[var(--muted)]";
  const dotScale = passed ? 1.2 : 1;
  const side = item.side || (index % 2 === 0 ? "left" : "right");

  return (
    <div
      ref={ref as never}
      className="relative grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-6)] lg:gap-[var(--space-12)] items-center"
    >
      <div
        className={`lg:block ${side === "left" ? "lg:order-1" : "lg:order-2"}`}
      >
        <ExperienceCard item={item} />
      </div>

      <div
        className={`hidden lg:flex items-center justify-center ${
          side === "left" ? "lg:order-2" : "lg:order-1"
        }`}
      >
        <p className="text-h3 font-bold text-[var(--accent)]">{item.period[language]}</p>
      </div>

      <motion.div
        aria-hidden="true"
        data-timeline-dot=""
        initial={{ scale: 0 }}
        animate={{ scale: isInView ? dotScale : 0 }}
        transition={reducedMotion ? { duration: 0 } : spring}
        className={`hidden lg:block absolute left-1/2 top-1/2 z-10 w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-[var(--bg)] transition-colors duration-[var(--dur-base)] ${dotTone}`}
      >
        <motion.div
          animate={
            isInView && active && !reducedMotion
              ? { scale: [1, 1.5, 1], opacity: [1, 0, 0] }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 rounded-full bg-[var(--accent)]"
        />
      </motion.div>

      <div className="lg:hidden order-first -ml-[var(--space-8)] flex items-center gap-[var(--space-3)]">
        <motion.div
          aria-hidden="true"
          data-timeline-dot=""
          initial={{ scale: 0 }}
          animate={{ scale: isInView ? dotScale : 0 }}
          transition={reducedMotion ? { duration: 0 } : spring}
          className={`relative z-10 w-4 h-4 rounded-full transition-colors duration-[var(--dur-base)] ${dotTone}`}
        />
        <p className="text-lg font-bold text-[var(--accent)]">
          {item.period[language]}
        </p>
      </div>
    </div>
  );
}
