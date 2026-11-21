type BadgeProps = {
  name: string;
  image: string;
  className?: string;
};

export function Badge({ name, image, className = "" }: BadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-[var(--space-2)] px-[var(--space-3)] py-[var(--space-1)] rounded-[var(--radius-full)] bg-[var(--accent-soft)] text-[var(--accent)] text-sm font-medium ${className}`}
    >
      {image && (
        <img
          src={image}
          alt={name}
          className="w-4 h-4 object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      )}
      <span>{name}</span>
    </div>
  );
}
