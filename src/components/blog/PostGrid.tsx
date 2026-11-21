import { useLanguage } from "../../context/useLanguage.ts";
import type { ResolvedPost } from "../../domain/blog.ts";
import { PostCard } from "./PostCard.tsx";

type PostGridProps = {
  posts: ResolvedPost[];
};

export function PostGrid({ posts }: PostGridProps) {
  const { t } = useLanguage();

  return (
    <ul
      aria-label={t.blog.postsLabel}
      className="grid grid-cols-1 gap-[var(--space-8)] md:grid-cols-2 lg:grid-cols-3"
    >
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </ul>
  );
}
