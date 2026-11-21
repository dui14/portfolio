import { ArrowLeft } from "lucide-react";

import { PostCover } from "../../components/blog/PostCover.tsx";
import { PostMeta } from "../../components/blog/PostMeta.tsx";
import { TagList } from "../../components/blog/TagList.tsx";
import { AppLink } from "../../components/ui/AppLink.tsx";
import { Button } from "../../components/ui/Button.tsx";
import { Container } from "../../components/ui/Container.tsx";
import { Skeleton } from "../../components/ui/Skeleton.tsx";
import { useLanguage } from "../../context/useLanguage.ts";
import { blogMeta } from "../../data/blogMeta.ts";
import { formatPageTitle } from "../../domain/blog.ts";
import type { BlogPostGroup, BlogPostMeta, ResolvedPost } from "../../domain/blog.ts";
import {
  findGroup,
  getAdjacentPosts,
  postPath,
} from "../../features/blog/postQueries.ts";
import { usePageMeta } from "../../features/blog/usePageMeta.ts";
import { usePostBody } from "../../features/blog/usePostBody.ts";
import { usePostLang } from "../../features/blog/usePostLang.ts";
import { languages } from "../../lib/i18n.ts";
import { NotFoundPage } from "./NotFoundPage.tsx";

type BlogPostPageProps = {
  slug: string;
};

export function BlogPostPage({ slug }: BlogPostPageProps) {
  const group = findGroup(slug);

  if (!group) return <NotFoundPage />;

  return <PostView key={group.slug} group={group} />;
}

type PostViewProps = {
  group: BlogPostGroup;
};

function PostView({ group }: PostViewProps) {
  const { language, t } = useLanguage();
  const { lang, select } = usePostLang(group, language);
  const post = group.versions[lang] as BlogPostMeta;
  const body = usePostBody(group.slug, lang);
  const { newer, older } = getAdjacentPosts(group.slug, language);
  const missingUiLanguage = !group.versions[language];

  usePageMeta({
    title: formatPageTitle(post.title),
    description: post.summary,
    path: postPath(post.slug),
    image: post.cover,
    imageAlt: post.cover ? post.title : undefined,
    imageWidth: post.cover ? blogMeta.cover.width : undefined,
    imageHeight: post.cover ? blogMeta.cover.height : undefined,
    type: "article",
  });

  return (
    <Container className="pb-[var(--space-24)] pt-[var(--space-24)]">
      <article lang={post.lang} className="mx-auto max-w-3xl">
        <header>
          <AppLink
            href={blogMeta.path}
            lang={language}
            className="inline-flex min-h-11 items-center gap-[var(--space-2)] rounded-[var(--radius-sm)] text-sm font-medium text-[var(--muted)] transition-colors duration-[var(--dur-fast)] hover:text-[var(--text)]"
          >
            <ArrowLeft className="size-4" strokeWidth={1.75} aria-hidden="true" />
            {t.blog.backToBlog}
          </AppLink>

          <h1 className="mt-[var(--space-4)] font-display text-h1 font-bold leading-[1.1] tracking-[-0.02em]">
            {post.title}
          </h1>

          <PostMeta post={post} className="mt-[var(--space-4)]" />
          <TagList tags={post.tags} className="mt-[var(--space-4)]" />

          {group.languages.length > 1 && (
            <nav
              lang={language}
              aria-label={t.blog.readIn}
              className="mt-[var(--space-4)] flex flex-wrap items-center gap-x-[var(--space-3)] text-sm"
            >
              <span className="text-[var(--muted)]">{t.blog.readIn}:</span>
              <ul className="flex flex-wrap items-center gap-x-[var(--space-1)]">
                {languages
                  .filter((item) => group.languages.includes(item.id))
                  .map((item) => (
                    <li key={item.id}>
                      <a
                        href={postPath(group.slug, item.id)}
                        lang={item.id}
                        hrefLang={item.id}
                        aria-current={item.id === lang ? "true" : undefined}
                        onClick={(event) => {
                          event.preventDefault();
                          select(item.id);
                        }}
                        className={`inline-flex min-h-11 items-center rounded-[var(--radius-sm)] px-[var(--space-2)] font-medium transition-colors duration-[var(--dur-fast)] ${
                          item.id === lang
                            ? "text-[var(--text)] underline decoration-[var(--accent)] decoration-2 underline-offset-4"
                            : "text-[var(--muted)] hover:text-[var(--text)]"
                        }`}
                      >
                        {item.nativeName}
                      </a>
                    </li>
                  ))}
              </ul>
            </nav>
          )}

          {missingUiLanguage && (
            <p
              lang={language}
              className="mt-[var(--space-2)] text-sm text-[var(--muted)]"
            >
              {t.blog.availableIn.replace(
                "{languages}",
                languages
                  .filter((item) => group.languages.includes(item.id))
                  .map((item) => item.nativeName)
                  .join(", ")
              )}
            </p>
          )}
        </header>

        {post.cover && (
          <PostCover
            src={post.cover}
            alt={post.title}
            tags={post.tags}
            lang={post.lang}
            size="hero"
            eager
            className="mt-[var(--space-8)] rounded-[var(--radius-lg)] border border-[var(--border)]"
          />
        )}

        <div className="mt-[var(--space-10)]">
          {body.status === "loading" && (
            <div
              role="status"
              aria-label={t.blog.loadingPost}
              className="flex max-w-[68ch] flex-col gap-[var(--space-3)]"
            >
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-11/12" />
              <Skeleton className="h-5 w-4/5" />
            </div>
          )}

          {body.status === "error" && (
            <div role="alert" className="flex flex-col items-start gap-[var(--space-4)]">
              <p className="text-[var(--text)]">{t.blog.loadError}</p>
              <Button variant="outline" onClick={body.retry}>
                {t.blog.retry}
              </Button>
            </div>
          )}

          {body.status === "ready" && (
            <div
              className="blog-prose"
              dangerouslySetInnerHTML={{ __html: body.html }}
            />
          )}
        </div>

        {(newer || older) && (
          <nav
            aria-label={t.blog.morePosts}
            className="mt-[var(--space-16)] grid gap-[var(--space-4)] border-t border-[var(--border)] pt-[var(--space-8)] md:grid-cols-2"
          >
            {older ? (
              <AdjacentLink post={older} label={t.blog.older} />
            ) : (
              <span aria-hidden="true" />
            )}
            {newer && <AdjacentLink post={newer} label={t.blog.newer} alignEnd />}
          </nav>
        )}
      </article>
    </Container>
  );
}

type AdjacentLinkProps = {
  post: ResolvedPost;
  label: string;
  alignEnd?: boolean;
};

function AdjacentLink({ post, label, alignEnd = false }: AdjacentLinkProps) {
  return (
    <AppLink
      href={postPath(post.slug)}
      lang={post.lang}
      className={`flex min-h-11 flex-col gap-[var(--space-1)] rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-[var(--space-4)] transition-colors duration-[var(--dur-fast)] hover:bg-[var(--surface-2)] ${
        alignEnd ? "md:items-end md:text-right" : ""
      }`}
    >
      <span className="text-xs font-medium uppercase tracking-[0.04em] text-[var(--muted)]">
        {label}
      </span>
      <span className="font-semibold leading-snug">{post.title}</span>
    </AppLink>
  );
}
