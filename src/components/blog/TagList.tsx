type TagListProps = {
  tags: string[];
  className?: string;
};

export function TagList({ tags, className = "" }: TagListProps) {
  if (tags.length === 0) return null;

  return (
    <ul className={`flex flex-wrap gap-[var(--space-2)] ${className}`}>
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-[var(--radius-full)] bg-[var(--accent-soft)] px-[var(--space-3)] py-[var(--space-1)] text-xs font-medium text-[var(--accent-text)]"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}
