import { PostGrid } from "../../components/blog/PostGrid.tsx";
import { AppLink } from "../../components/ui/AppLink.tsx";
import { Container } from "../../components/ui/Container.tsx";
import { Section } from "../../components/ui/Section.tsx";
import { useLanguage } from "../../context/useLanguage.ts";
import { blogMeta } from "../../data/blogMeta.ts";
import { getLatestPosts } from "../../features/blog/postQueries.ts";

export function Blog() {
  const { language, t } = useLanguage();
  const latest = getLatestPosts(language);

  if (latest.length === 0) return null;

  return (
    <Section id="blog">
      <Container>
        <h2 className="mb-[var(--space-12)] text-center text-h1 font-bold">
          {t.blog.title}
        </h2>

        <PostGrid posts={latest} />

        <div className="mt-[var(--space-10)] flex justify-center">
          <AppLink
            href={blogMeta.path}
            className="group inline-flex min-h-11 items-center gap-[var(--space-2)] rounded-[var(--radius-sm)] px-[var(--space-2)] text-sm font-medium text-[var(--accent-text)] underline-offset-4 hover:underline"
          >
            {t.blog.allPosts}
            <span
              aria-hidden="true"
              className="transition-transform duration-[var(--dur-fast)] group-hover:translate-x-0.5"
            >
              →
            </span>
          </AppLink>
        </div>
      </Container>
    </Section>
  );
}
