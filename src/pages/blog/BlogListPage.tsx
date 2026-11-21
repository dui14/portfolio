import { useState } from "react";

import { PostGrid } from "../../components/blog/PostGrid.tsx";
import { AppLink } from "../../components/ui/AppLink.tsx";
import { Container } from "../../components/ui/Container.tsx";
import { useLanguage } from "../../context/useLanguage.ts";
import { blogMeta } from "../../data/blogMeta.ts";
import { formatPageTitle } from "../../domain/blog.ts";
import { getAllTags, getResolvedPosts } from "../../features/blog/postQueries.ts";
import { usePageMeta } from "../../features/blog/usePageMeta.ts";

const MIN_TAGS_FOR_FILTER = 2;

export function BlogListPage() {
  const { language, t } = useLanguage();
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const posts = getResolvedPosts(language);
  const tags = getAllTags(language);
  const showFilter = tags.length >= MIN_TAGS_FOR_FILTER;
  const selectedTag = activeTag && tags.includes(activeTag) ? activeTag : null;
  const visiblePosts = selectedTag
    ? posts.filter((post) => post.tags.includes(selectedTag))
    : posts;

  usePageMeta({
    title: formatPageTitle(blogMeta.title),
    description: blogMeta.description,
    path: blogMeta.path,
  });

  return (
    <Container className="pb-[var(--space-24)] pt-[var(--space-24)]">
      <h1 className="font-display text-h1 font-bold leading-[1.1] tracking-[-0.02em]">
        {t.blog.title}
      </h1>

      {posts.length === 0 ? (
        <div className="py-[var(--space-16)] text-[var(--muted)]">
          <p className="text-lg text-[var(--text)]">
            {t.blog.emptyTitle}
          </p>
          <p className="mt-[var(--space-2)] text-sm">
            {t.blog.emptyHint}
          </p>
          <AppLink
            href="/"
            className="mt-[var(--space-6)] inline-flex min-h-11 items-center rounded-[var(--radius-sm)] text-sm font-medium text-[var(--accent-text)] underline underline-offset-4"
          >
            {t.blog.goHome}
          </AppLink>
        </div>
      ) : (
        <>
          {showFilter && (
            <div
              role="group"
              aria-label={t.blog.filterLabel}
              className="mt-[var(--space-8)] flex flex-wrap gap-[var(--space-2)]"
            >
              {[null, ...tags].map((tag) => {
                const isActive = tag === selectedTag;

                return (
                  <button
                    key={tag ?? "all"}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveTag(tag)}
                    className={`min-h-11 rounded-[var(--radius-full)] border px-[var(--space-4)] text-sm font-medium transition-colors duration-[var(--dur-fast)] active:scale-[0.98] ${
                      isActive
                        ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--on-accent)]"
                        : "border-[var(--border)] bg-transparent text-[var(--text)] hover:bg-[var(--surface-2)]"
                    }`}
                  >
                    {tag ?? t.blog.filterAll}
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-[var(--space-12)]">
            <PostGrid posts={visiblePosts} />
          </div>
        </>
      )}
    </Container>
  );
}
