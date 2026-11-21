import { useLanguage } from "../../context/useLanguage.ts";
import { formatPostDate } from "../../features/blog/formatPostDate.ts";
import type { BlogPostMeta } from "../../domain/blog.ts";

type PostMetaProps = {
  post: Pick<BlogPostMeta, "date" | "readingMinutes">;
  className?: string;
};

export function PostMeta({ post, className = "" }: PostMetaProps) {
  const { language, t } = useLanguage();

  return (
    <p
      className={`flex flex-wrap items-center gap-x-[var(--space-2)] text-sm text-[var(--muted)] ${className}`}
    >
      <time dateTime={post.date}>{formatPostDate(post.date, language)}</time>
      <span aria-hidden="true">·</span>
      <span>
        {t.blog.minRead.replace("{minutes}", String(post.readingMinutes))}
      </span>
    </p>
  );
}
