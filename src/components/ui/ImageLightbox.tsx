import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { KeyboardEvent, ReactNode } from "react";

import { Dialog } from "./Dialog.tsx";
import { FallbackImage } from "./FallbackImage.tsx";

export type LightboxImage = {
  src: string;
  srcSet?: string;
  width?: number;
  height?: number;
};

export type LightboxNavigation = {
  previousLabel: string;
  nextLabel: string;
  onStep: (direction: 1 | -1) => void;
};

type ImageLightboxProps = {
  open: boolean;
  onClose: () => void;
  closeLabel: string;
  title?: string;
  image?: LightboxImage;
  alt: string;
  fallbackLabel: string;
  imageKey?: string;
  sizes?: string;
  counter?: string;
  navigation?: LightboxNavigation;
  footer?: ReactNode;
  panelClassName?: string;
};

const CONTROL =
  "inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-full)] border border-[var(--border)] text-[var(--text)] transition-colors duration-[var(--dur-fast)] hover:bg-[var(--surface-2)]";

export function ImageLightbox({
  open,
  onClose,
  closeLabel,
  title,
  image,
  alt,
  fallbackLabel,
  imageKey,
  sizes = "(min-width: 768px) 672px, 90vw",
  counter,
  navigation,
  footer,
  panelClassName = "max-w-3xl",
}: ImageLightboxProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!navigation) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigation.onStep(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      navigation.onStep(1);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title={title} panelClassName={panelClassName}>
      <div className="flex flex-col gap-[var(--space-4)]" onKeyDown={handleKeyDown}>
        <div className="flex items-center justify-between gap-[var(--space-3)]">
          <p aria-live="polite" className="text-xs text-[var(--muted)]">
            {counter}
          </p>
          <div className="flex items-center gap-[var(--space-2)]">
            {navigation && (
              <>
                <button
                  type="button"
                  aria-label={navigation.previousLabel}
                  onClick={() => navigation.onStep(-1)}
                  className={CONTROL}
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label={navigation.nextLabel}
                  onClick={() => navigation.onStep(1)}
                  className={CONTROL}
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </>
            )}
            <button
              type="button"
              data-autofocus
              aria-label={closeLabel}
              onClick={onClose}
              className={CONTROL}
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)]">
          <FallbackImage
            key={imageKey ?? image?.src}
            src={image?.src ?? ""}
            srcSet={image?.srcSet}
            sizes={sizes}
            alt={alt}
            fallbackLabel={fallbackLabel}
            width={image?.width}
            height={image?.height}
            loading="eager"
            className="mx-auto h-auto max-h-[60vh] w-auto max-w-full object-contain"
            fallbackClassName="min-h-40 p-[var(--space-6)] text-sm"
          />
        </div>

        {footer}
      </div>
    </Dialog>
  );
}
