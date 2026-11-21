import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

export function Section({ id, children, className = "" }: SectionProps) {
  return (
    <section
      id={id}
      className={`py-[var(--space-16)] md:py-[var(--space-24)] scroll-mt-20 ${className}`}
    >
      {children}
    </section>
  );
}
