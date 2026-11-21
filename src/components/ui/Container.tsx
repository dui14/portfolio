import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[var(--container)] px-[var(--space-6)] lg:px-[var(--space-8)] ${className}`}
    >
      {children}
    </div>
  );
}
