import type { Variants } from "motion/react";

export const durations = {
  fast: 0.15,
  base: 0.25,
  slow: 0.45,
  reveal: 0.7,
} as const;

export const easeOut = [0.22, 1, 0.36, 1] as const;

export const easeInOut = [0.65, 0, 0.35, 1] as const;

export const spring = {
  type: "spring",
  stiffness: 260,
  damping: 24,
} as const;

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.reveal, ease: easeOut },
  },
};

export const staggerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.slow, ease: easeOut },
  },
};

export const slideInVariants = {
  left: {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: durations.reveal, ease: easeOut },
    },
  },
  right: {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: durations.reveal, ease: easeOut },
    },
  },
} satisfies Record<"left" | "right", Variants>;

export const flipVariants: Variants = {
  front: { rotateY: 0 },
  back: { rotateY: 180 },
};
