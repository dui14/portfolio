import { motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

import { useReducedMotion } from "../../hooks/useReducedMotion.ts";
import { useScrollReveal } from "../../hooks/useScrollReveal.ts";
import { revealVariants } from "../../lib/motion.ts";

type BentoCardProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  amount?: number;
};

export function BentoCard({
  children,
  className = "",
  style,
  amount = 0.15,
}: BentoCardProps) {
  const { ref, isInView } = useScrollReveal<HTMLDivElement>({ amount });
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      variants={reducedMotion ? undefined : revealVariants}
      initial={reducedMotion ? false : "hidden"}
      animate={isInView ? "visible" : "hidden"}
      style={style}
      className={`min-w-0 rounded-[var(--radius-xl)] ${className}`}
    >
      {children}
    </motion.div>
  );
}
