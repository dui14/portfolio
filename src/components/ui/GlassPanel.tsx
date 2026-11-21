import type { ReactNode } from "react";

type GlassPanelProps = {
  children: ReactNode;
  className?: string;
};

export function GlassPanel({ children, className = "" }: GlassPanelProps) {
  return (
    <div
      className={`rounded-[var(--radius-lg)] bg-[var(--glass)] backdrop-blur-md border border-[var(--border)] ${className}`}
    >
      {children}
    </div>
  );
}
