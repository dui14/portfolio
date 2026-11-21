import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "motion/react";
import { useId, useRef, useState } from "react";

import { FallbackImage } from "../../components/ui/FallbackImage.tsx";
import { ImageLightbox } from "../../components/ui/ImageLightbox.tsx";
import type { LightboxImage } from "../../components/ui/ImageLightbox.tsx";
import { useLanguage } from "../../context/useLanguage.ts";
import { useReducedMotion } from "../../hooks/useReducedMotion.ts";
import { durations, easeOut } from "../../lib/motion.ts";

export const GALLERY_INITIAL_COUNT = 3;

export type GalleryEntry = {
  key: string;
  image: LightboxImage;
  alt: string;
};

type ProjectGalleryProps = {
  items: GalleryEntry[];
  fallbackLabel: string;
};

const BUTTON_CLASS =
  "inline-flex min-h-11 w-full items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-full)] border border-[var(--border)] bg-[var(--surface)] px-[var(--space-6)] text-sm font-medium text-[var(--text)] transition-[background-color,scale] duration-[var(--dur-fast)] hover:bg-[var(--surface-2)] motion-safe:active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus-ring)] sm:w-auto";

export function ProjectGallery({ items, fallbackLabel }: ProjectGalleryProps) {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const hiddenCount = Math.max(items.length - GALLERY_INITIAL_COUNT, 0);
  const visible = expanded ? items : items.slice(0, GALLERY_INITIAL_COUNT);
  const active = openIndex === null ? undefined : items[openIndex];

  function toggle() {
    const next = !expanded;
    setExpanded(next);
    if (!next) {
      rootRef.current?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  }

  function step(direction: 1 | -1) {
    setOpenIndex((current) =>
      current === null ? current : (current + direction + items.length) % items.length,
    );
  }

  return (
    <div ref={rootRef} className="flex min-w-0 flex-col gap-[var(--space-6)]">
      <ul id={listId} className="grid grid-cols-1 gap-[var(--space-4)] md:grid-cols-2">
        {visible.map((item, index) => {
          const isExtra = index >= GALLERY_INITIAL_COUNT;
          return (
            <motion.li
              key={item.key}
              className="min-w-0 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-2)]"
              initial={isExtra && !reducedMotion ? { opacity: 0, y: 12 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: durations.base, ease: easeOut }}
            >
              <button
                type="button"
                aria-label={item.alt}
                onClick={() => setOpenIndex(index)}
                className="block aspect-[3/2] w-full cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--focus-ring)]"
              >
                <FallbackImage
                  src={item.image.src}
                  srcSet={item.image.srcSet}
                  sizes="(min-width: 768px) 440px, 100vw"
                  alt=""
                  fallbackLabel={fallbackLabel}
                  width={item.image.width}
                  height={item.image.height}
                  loading="lazy"
                  className="block h-full w-full object-cover object-top"
                  fallbackClassName="h-full w-full"
                />
              </button>
            </motion.li>
          );
        })}
      </ul>

      {hiddenCount > 0 && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={toggle}
          className={`${BUTTON_CLASS} self-start`}
        >
          {expanded ? t.projects.showLess : t.projects.showMore.replace("{count}", String(hiddenCount))}
          {expanded ? (
            <ChevronUp className="size-4" strokeWidth={1.75} aria-hidden="true" />
          ) : (
            <ChevronDown className="size-4" strokeWidth={1.75} aria-hidden="true" />
          )}
        </button>
      )}

      <ImageLightbox
        open={active !== undefined}
        onClose={() => setOpenIndex(null)}
        closeLabel={t.projects.galleryClose}
        title={fallbackLabel}
        image={active?.image}
        alt={active?.alt ?? ""}
        fallbackLabel={fallbackLabel}
        imageKey={active?.key}
        counter={openIndex === null ? undefined : `${openIndex + 1} / ${items.length}`}
        navigation={
          items.length > 1
            ? {
                previousLabel: t.projects.galleryPrevious,
                nextLabel: t.projects.galleryNext,
                onStep: step,
              }
            : undefined
        }
        sizes="(min-width: 1024px) 960px, 90vw"
        panelClassName="max-w-5xl"
      />
    </div>
  );
}
