import { posts } from "./blog.ts";
import { blogMeta } from "./blogMeta.ts";

export type SectionRoute = {
  id: string;
  label: string;
  enabled: boolean;
  inNav: boolean;
  page?: string;
};

const allRoutes: SectionRoute[] = [
  { id: "home", label: "Home", enabled: true, inNav: true },
  { id: "about", label: "About", enabled: true, inNav: true },
  { id: "projects", label: "Projects", enabled: true, inNav: true },
  { id: "journey", label: "Journey", enabled: true, inNav: true },
  {
    id: "blog",
    label: "Blog",
    enabled: posts.length > 0,
    inNav: true,
    page: blogMeta.path,
  },
  { id: "contact", label: "Contact", enabled: true, inNav: false },
];

export const routes: SectionRoute[] = allRoutes.filter((route) => route.enabled);

export const navRoutes: SectionRoute[] = allRoutes.filter(
  (route) => route.inNav && (route.enabled || route.page !== undefined)
);

export function routeHref(route: SectionRoute): string {
  if (route.page) return route.page;

  return route.id === "home" ? "/" : `/#${route.id}`;
}
