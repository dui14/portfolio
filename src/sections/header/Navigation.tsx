import { navRoutes, routeHref } from "../../data/routes.ts";
import { AppLink } from "../../components/ui/AppLink.tsx";
import { useLanguage } from "../../context/useLanguage.ts";
import { useActiveSection } from "../../features/navigation/useActiveSection.ts";
import { useRoute } from "../../features/navigation/useRoute.ts";

type NavigationProps = {
  variant?: "bar" | "sheet";
  onNavigate?: () => void;
};

export function Navigation({ variant = "bar", onNavigate }: NavigationProps) {
  const { t } = useLanguage();
  const route = useRoute();
  const activeSection = useActiveSection();
  const isSheet = variant === "sheet";
  const onBlogPages = route.name === "blog" || route.name === "post";

  return (
    <nav aria-label={t.nav.label}>
      <ul
        className={
          isSheet
            ? "flex flex-col"
            : "flex items-center gap-x-[var(--space-4)] xl:gap-x-[var(--space-6)]"
        }
      >
        {navRoutes.map((item) => {
          const isPage = item.page !== undefined;
          const isActive = isPage ? onBlogPages : activeSection === item.id;
          const label = t.nav[item.id as keyof typeof t.nav] ?? item.label;

          return (
            <li key={item.id}>
              <AppLink
                href={routeHref(item)}
                aria-current={isActive ? (isPage ? "page" : "location") : undefined}
                onNavigate={onNavigate}
                className={
                  isSheet
                    ? `flex min-h-14 w-full items-center text-left font-display text-h1 font-bold leading-tight transition-colors duration-[var(--dur-fast)] ${
                        isActive
                          ? "text-[var(--accent-text)]"
                          : "text-[var(--text)]"
                      }`
                    : `group relative inline-flex min-h-9 items-center whitespace-nowrap rounded-[var(--radius-sm)] text-sm font-medium transition-colors duration-[var(--dur-fast)] hover:text-[var(--text)] ${
                        isActive ? "text-[var(--text)]" : "text-[var(--muted)]"
                      }`
                }
              >
                {label}
                {!isSheet && (
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 bottom-0 h-0.5 origin-left rounded-full transition-transform duration-[var(--dur-fast)] ${
                      isActive
                        ? "scale-x-100 bg-[var(--accent)]"
                        : "scale-x-0 bg-[var(--text)] group-hover:scale-x-100"
                    }`}
                  />
                )}
              </AppLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
