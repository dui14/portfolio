import { ZoomIn } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import type { ExperienceItem } from "../../domain/experience.ts";
import { Badge } from "../../components/ui/Badge.tsx";
import { FallbackImage } from "../../components/ui/FallbackImage.tsx";
import { ImageLightbox } from "../../components/ui/ImageLightbox.tsx";
import { GlassPanel } from "../../components/ui/GlassPanel.tsx";
import { useScrollReveal } from "../../hooks/useScrollReveal.ts";
import { useLanguage } from "../../context/useLanguage.ts";
import { useReducedMotion } from "../../hooks/useReducedMotion.ts";
import { getImage } from "../../data/media.ts";
import { slideInVariants } from "../../lib/motion.ts";

type ExperienceCardProps = {
  item: ExperienceItem;
};

export function ExperienceCard({ item }: ExperienceCardProps) {
  const { ref, isInView } = useScrollReveal({ amount: 0.3 });
  const reducedMotion = useReducedMotion();
  const { language, t } = useLanguage();
  const [open, setOpen] = useState(false);

  const title = item.title[language];
  const side = item.side || "left";
  const caption = `${title}, ${item.period[language]}`;
  const media =item.image ? getImage(item.image) : undefined;

  return (
    <motion.div
      ref={ref as never}
      variants={reducedMotion ? undefined : slideInVariants[side]}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="w-full"
    >
      <GlassPanel className="p-[var(--space-6)]">
        <h3 className="text-h3 font-bold mb-[var(--space-2)]">
          {title}
        </h3>

        <p className="text-sm text-[var(--muted)] mb-[var(--space-4)]">
          {item.description[language]}
        </p>

        {item.image && (
          <div className="rounded-[var(--radius-md)] overflow-hidden mb-[var(--space-4)] bg-[var(--surface-2)] h-40">
            {media ? (
              <button
                type="button"
                aria-haspopup="dialog"
                aria-label={`${t.experience.viewImage}: ${caption}`}
                onClick={() => setOpen(true)}
                className="group relative block h-full w-full cursor-zoom-in overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-inset"
              >
                <FallbackImage
                  src={media.src}
                  srcSet={media.srcSet}
                  sizes="(min-width: 1024px) 480px, 100vw"
                  width={media.width}
                  height={media.height}
                  alt=""
                  fallbackLabel={title}
                  loading="lazy"
                  decoding="async"
                  className={`h-full w-full object-cover ${
                    reducedMotion
                      ? ""
                      : "transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
                  }`}
                />
                <span
                  aria-hidden="true"
                  className={`absolute right-[var(--space-2)] top-[var(--space-2)] inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-full)] bg-[var(--bg)] text-[var(--text)] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 ${
                    reducedMotion ? "" : "transition-opacity duration-[var(--dur-fast)]"
                  }`}
                >
                  <ZoomIn className="h-4 w-4" />
                </span>
              </button>
            ) : (
              <div
                role="img"
                aria-label={title}
                className="flex h-full w-full items-center justify-center text-center text-[var(--muted)]"
              >
                <span>{title}</span>
              </div>
            )}
          </div>
        )}

        {media && (
          <ImageLightbox
            open={open}
            onClose={() => setOpen(false)}
            closeLabel={t.about.certificateClose}
            title={caption}
            image={media}
            alt={caption}
            fallbackLabel={title}
          />
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-[var(--space-2)]">
            {item.tags.map((tag) => (
              <Badge key={tag} name={tag} image="" />
            ))}
          </div>
        )}
      </GlassPanel>
    </motion.div>
  );
}
