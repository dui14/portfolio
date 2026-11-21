import { useInView } from "motion/react";
import type { UseInViewOptions } from "motion/react";
import { useRef } from "react";

type ScrollRevealOptions = {
  once?: boolean;
  amount?: number | "some" | "all";
  margin?: UseInViewOptions["margin"];
};

export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options: ScrollRevealOptions = {},
) {
  const { once = true, amount = 0.3, margin } = options;
  const ref = useRef<T | null>(null);

  const isInView = useInView(ref, {
    once,
    amount,
    margin,
  });

  return { ref, isInView };
}
