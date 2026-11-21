import { motion } from "motion/react";

import { AppLink } from "../ui/AppLink.tsx";
import { useReducedMotion } from "../../hooks/useReducedMotion.ts";
import { useScrollReveal } from "../../hooks/useScrollReveal.ts";
import { revealVariants } from "../../lib/motion.ts";
import { postPath } from "../../features/blog/postQueries.ts";
import type { ResolvedPost } from "../../domain/blog.ts";
import { LanguageChips } from "./LanguageChips.tsx";
import { PostCover } from "./PostCover.tsx";
import { PostMeta } from "./PostMeta.tsx";
import { TagList } from "./TagList.tsx";

type PostCardProps = {
  post: ResolvedPost;
};

export function PostCard({ post }: PostCardProps) {
  const { ref, isInView } = useScrollReveal();
  const reducedMotion = useReducedMotion();

  return (
    <motion.li
      ref={ref as never}
      variants={reducedMotion ? undefined : revealVariants}
      initial={reducedMotion ? false : "hidden"}
      animate={isInView || reducedMotion ? "visible" : "hidden"}
      className="list-none"
    >
      <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-md)] transition-[transform,box-shadow] duration-[var(--dur-base)] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-[var(--focus-ring)] motion-safe:hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)]">
        <PostCover
          src={post.cover}
          alt=""
          tags={post.tags}
          lang={post.lang}
        />

        <div className="flex flex-1 flex-col gap-[var(--space-3)] p-[var(--space-6)]">
          <PostMeta post={post} />

          <h3 className="text-h3 font-bold leading-snug">
            <AppLink
              href={postPath(post.slug)}
              lang={post.lang}
              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
            >
              {post.title}
            </AppLink>
          </h3>

          <p
            lang={post.lang}
            className="line-clamp-3 text-sm text-[var(--muted)]"
          >
            {post.summary}
          </p>

          <div className="mt-auto flex flex-wrap items-end justify-between gap-[var(--space-3)] pt-[var(--space-2)]">
            <TagList tags={post.tags} />
            <LanguageChips available={post.languages} current={post.lang} />
          </div>
        </div>
      </article>
    </motion.li>
  );
}
