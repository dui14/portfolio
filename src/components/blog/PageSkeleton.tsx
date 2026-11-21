import { Container } from "../ui/Container.tsx";
import { Skeleton } from "../ui/Skeleton.tsx";
import { useLanguage } from "../../context/useLanguage.ts";
import { blogMeta } from "../../data/blogMeta.ts";

export function PageSkeleton() {
  const { t } = useLanguage();
  const { width, height } = blogMeta.cover;

  return (
    <Container className="pb-[var(--space-24)] pt-[var(--space-24)]">
      <div role="status" aria-label={t.blog.loadingPost} className="mx-auto max-w-3xl">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-[var(--space-4)] h-12 w-full" />
        <Skeleton className="mt-[var(--space-3)] h-12 w-2/3" />
        <div
          className="mt-[var(--space-8)] w-full"
          style={{ aspectRatio: `${width} / ${height}` }}
        >
          <Skeleton className="size-full" />
        </div>
      </div>
    </Container>
  );
}
