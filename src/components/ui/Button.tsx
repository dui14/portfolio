import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "ghost" | "outline";
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  className?: string;
};

export function Button({
  children,
  variant = "primary",
  disabled = false,
  onClick,
  type = "button",
  className = "",
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-full)] px-[var(--space-6)] py-[var(--space-3)] font-medium transition-all duration-[var(--dur-fast)] disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary:
      "bg-[var(--accent)] text-[var(--on-accent)] hover:shadow-[var(--shadow-md)] active:scale-95",
    outline:
      "bg-transparent text-[var(--text)] border border-[var(--border)] hover:bg-[var(--surface)] active:scale-95",
    ghost:
      "bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-2)] active:scale-95",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
