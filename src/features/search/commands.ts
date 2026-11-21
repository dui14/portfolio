import { navigate } from "../../lib/router.ts";
import { routes, routeHref } from "../../data/routes.ts";
import { blogMeta } from "../../data/blogMeta.ts";
import type { Translation } from "../../data/translations.ts";
import type { LanguageId } from "../../lib/i18n.ts";
import { getResolvedPosts, postPath } from "../blog/postQueries.ts";

export type CommandGroup = "navigate" | "actions";

export type Command = {
  id: string;
  label: string;
  group: CommandGroup;
  run: () => void;
};

export function buildCommands(t: Translation, language: LanguageId): Command[] {
  const sectionCommands: Command[] = routes
    .filter((route) => route.page === undefined)
    .map((route) => ({
      id: `nav-${route.id}`,
      label: t.nav[route.id as keyof Translation["nav"]] ?? route.label,
      group: "navigate" as CommandGroup,
      run: () => navigate(routeHref(route)),
    }));

  const blogCommands: Command[] = [
    {
      id: "nav-blog",
      label: t.nav.blog,
      group: "navigate",
      run: () => navigate(blogMeta.path),
    },
    ...getResolvedPosts(language).map((post) => ({
      id: `post-${post.slug}`,
      label: `${t.nav.blog}: ${post.title}`,
      group: "navigate" as CommandGroup,
      run: () => navigate(postPath(post.slug)),
    })),
  ];

  return [
    ...sectionCommands,
    ...blogCommands,
    {
      id: "action-top",
      label: t.palette.scrollTop,
      group: "actions",
      run: () => window.scrollTo({ top: 0, behavior: "smooth" }),
    },
  ];
}
