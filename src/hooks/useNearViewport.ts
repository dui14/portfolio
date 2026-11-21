import { useEffect, useRef, useState } from "react";

export function useNearViewport<T extends Element>(rootMargin: string) {
  const ref = useRef<T | null>(null);
  const [isNear, setIsNear] = useState(() => typeof IntersectionObserver === "undefined");

  useEffect(() => {
    const element = ref.current;
    if (isNear || !element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsNear(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, [isNear, rootMargin]);

  return { ref, isNear };
}
