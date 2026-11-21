import Lenis from "lenis";
import { useEffect } from "react";

import { registerLenis } from "../lib/scroll.ts";
import { useReducedMotion } from "./useReducedMotion.ts";

export function useSmoothScroll() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    registerLenis(lenis);

    let frame = 0;

    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }

    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      registerLenis(null);
    };
  }, [reducedMotion]);
}
