import { useEffect, useState } from "react";

import { routes } from "../../data/routes.ts";
import { useRoute } from "./useRoute.ts";

const OBSERVER_MARGIN = "-45% 0px -50% 0px";

export function useActiveSection() {
  const route = useRoute();
  const isHome = route.name === "home";
  const [activeId, setActiveId] = useState(routes[0]?.id ?? "");

  useEffect(() => {
    if (!isHome || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: OBSERVER_MARGIN }
    );

    routes.forEach((route) => {
      const element = document.getElementById(route.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [isHome]);

  return isHome ? activeId : "";
}
