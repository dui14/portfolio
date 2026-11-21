import { AppLink } from "../../components/ui/AppLink.tsx";
import { Container } from "../../components/ui/Container.tsx";
import { useLanguage } from "../../context/useLanguage.ts";
import { blogMeta } from "../../data/blogMeta.ts";
import { formatPageTitle } from "../../domain/blog.ts";
import { usePageMeta } from "../../features/blog/usePageMeta.ts";
import { usePathname } from "../../features/navigation/useRoute.ts";

const linkClass =
  "inline-flex min-h-11 items-center rounded-[var(--radius-sm)] text-sm font-medium text-[var(--accent-text)] underline underline-offset-4";

export function NotFoundPage() {
  const { t } = useLanguage();
  const pathname = usePathname();

  usePageMeta({
    title: formatPageTitle(t.blog.notFoundTitle),
    description: t.blog.notFoundText,
    path: pathname,
    robots: "noindex",
  });

  return (
    <Container className="pb-[var(--space-24)] pt-[var(--space-24)]">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-h1 font-bold leading-[1.1] tracking-[-0.02em]">
          {t.blog.notFoundTitle}
        </h1>
        <p className="mt-[var(--space-4)] text-lg text-[var(--muted)]">
          {t.blog.notFoundText}
        </p>
        <div className="mt-[var(--space-8)] flex flex-wrap gap-x-[var(--space-6)]">
          <AppLink href="/" className={linkClass}>
            {t.blog.goHome}
          </AppLink>
          <AppLink href={blogMeta.path} className={linkClass}>
            {t.blog.backToBlog}
          </AppLink>
        </div>
      </div>
    </Container>
  );
}
