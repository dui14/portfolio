type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-[var(--surface-2)] rounded-[var(--radius-md)] ${className}`}
      aria-hidden="true"
    />
  );
}
