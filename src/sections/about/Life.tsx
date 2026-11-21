import { AnimatePresence, motion } from "motion/react";
import { Shuffle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { FallbackImage } from "../../components/ui/FallbackImage.tsx";
import { useLanguage } from "../../context/useLanguage.ts";
import { useLifeShuffle } from "../../features/about/useLifeShuffle.ts";
import { lifePhotos } from "../../data/life.ts";
import type { LifeAspect, LifePhoto } from "../../data/life.ts";
import { useHoverNone } from "../../hooks/useHoverNone.ts";
import { useReducedMotion } from "../../hooks/useReducedMotion.ts";
import { durations, easeOut } from "../../lib/motion.ts";
import { BentoCard } from "./BentoCard.tsx";

const ASPECT_RATIO: Record<LifeAspect, number> = {
  portrait: 9 / 16,
  tall: 3 / 4,
  square: 1,
  landscape: 4 / 3,
  wide: 16 / 9,
};

const IMAGE_SIZES = "(min-width: 1024px) 480px, (min-width: 768px) 50vw, 100vw";
const OVERLAY_HIDE_MS = 3000;
const SCRIM =
  "bg-[color-mix(in_srgb,var(--bg)_78%,transparent)] text-[var(--text)] border border-[var(--border)]";

function describe(photo: LifePhoto) {
  return photo.place ? `${photo.title}, ${photo.place}` : photo.title;
}

export function Life() {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();
  const shuffle = useLifeShuffle(lifePhotos.length);
  const hoverNone = useHoverNone();
  const [hasShuffled, setHasShuffled] = useState(false);
  const [touchVisible, setTouchVisible] = useState(false);
  const hideTimer = useRef<number | null>(null);
  const photo = shuffle.index >= 0 ? lifePhotos[shuffle.index] : null;
  const upcoming = shuffle.nextIndex >= 0 ? lifePhotos[shuffle.nextIndex] : null;

  const clearHideTimer = useCallback(() => {
    if (hideTimer.current !== null) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }, []);

  const showOverlay = useCallback(() => {
    clearHideTimer();
    setTouchVisible(true);
    hideTimer.current = window.setTimeout(() => {
      hideTimer.current = null;
      setTouchVisible(false);
    }, OVERLAY_HIDE_MS);
  }, [clearHideTimer]);

  const toggleOverlay = useCallback(() => {
    if (touchVisible) {
      clearHideTimer();
      setTouchVisible(false);
      return;
    }
    showOverlay();
  }, [touchVisible, clearHideTimer, showOverlay]);

  useEffect(() => clearHideTimer, [clearHideTimer]);

  useEffect(() => {
    if (!upcoming) return;
    const preload = new Image();
    preload.sizes = IMAGE_SIZES;
    preload.srcset = upcoming.srcSet;
    preload.src = upcoming.src;
  }, [upcoming]);

  const cardClass =
    "group relative overflow-hidden bg-[var(--surface-2)] border border-[var(--border)] aspect-[4/5] md:aspect-auto md:min-h-[calc(var(--space-24)*4)] lg:col-span-5";

  if (!photo) {
    return (
      <BentoCard className={cardClass}>
        <div className="absolute inset-0 flex items-center justify-center p-[var(--space-6)] text-center text-[var(--muted)]">
          {t.about.lifeEmpty}
        </div>
      </BentoCard>
    );
  }

  const alt = describe(photo);
  const ratio = ASPECT_RATIO[photo.aspect];
  const announcement = hasShuffled ? alt : "";
  const overlayState = hoverNone
    ? touchVisible
      ? "opacity-100"
      : "opacity-0 pointer-events-none group-has-[:focus-visible]:opacity-100 group-has-[:focus-visible]:pointer-events-auto"
    : "opacity-0 group-hover:opacity-100 group-has-[:focus-visible]:opacity-100";
  const overlayMotion = reducedMotion
    ? ""
    : "transition-opacity duration-[var(--dur-base)] ease-[var(--ease-out)]";

  function handleShuffle() {
    setHasShuffled(true);
    shuffle.next();
    if (hoverNone) showOverlay();
  }

  return (
    <BentoCard className={cardClass} amount={0.1}>
      <span className="sr-only" aria-live="polite">
        {announcement}
      </span>
      <AnimatePresence initial={false}>
        <motion.div
          key={photo.slug}
          initial={reducedMotion ? false : { opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
          transition={{
            duration: reducedMotion ? 0 : durations.slow,
            ease: easeOut,
          }}
          className="absolute inset-0"
        >
          <img
            src={photo.srcSet.split(" ")[0]}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full scale-125 object-cover blur-2xl brightness-[0.55]"
          />
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ containerType: "size" }}
          >
            <div
              className="relative overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)]"
              style={{
                aspectRatio: ratio,
                width: `min(100cqw, calc(100cqh * ${ratio}))`,
              }}
            >
              <FallbackImage
                src={photo.src}
                srcSet={photo.srcSet}
                sizes={IMAGE_SIZES}
                width={photo.width}
                height={photo.height}
                alt={alt}
                fallbackLabel={alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
                fallbackClassName="bg-[var(--surface-2)] p-[var(--space-4)] text-sm"
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {hoverNone && (
        <div
          aria-hidden="true"
          onClick={toggleOverlay}
          className="absolute inset-0"
        />
      )}

      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-[calc(var(--space-24)*1.5)] bg-gradient-to-t from-[color-mix(in_srgb,var(--bg)_70%,transparent)] to-transparent ${overlayState} ${overlayMotion}`}
        aria-hidden="true"
      />

      <div
        className={`absolute left-[var(--space-4)] bottom-[var(--space-4)] max-w-[calc(100%-var(--space-8))] rounded-[var(--radius-md)] px-[var(--space-3)] py-[var(--space-2)] ${SCRIM} ${overlayState} ${overlayMotion}`}
      >
        <p className="text-sm font-semibold leading-tight">{photo.title}</p>
        {photo.place && (
          <p className="text-xs text-[var(--muted)] leading-tight">{photo.place}</p>
        )}
      </div>

      <span
        className={`pointer-events-none absolute left-[var(--space-4)] top-[var(--space-4)] inline-flex h-[var(--space-8)] items-center rounded-[var(--radius-full)] px-[var(--space-3)] font-mono text-xs font-semibold uppercase tracking-widest ${SCRIM}`}
      >
        {t.about.lifeLabel}
      </span>

      <div
        className={`absolute right-[var(--space-4)] top-[var(--space-4)] flex items-center gap-[var(--space-1)] rounded-[var(--radius-full)] p-[var(--space-1)] ${SCRIM} ${overlayState} ${overlayMotion}`}
      >
        <button
          type="button"
          onClick={handleShuffle}
          disabled={shuffle.total < 2}
          aria-label={t.about.shufflePhoto}
          className="group/shuffle inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-full)] text-[var(--accent-text)] transition-all duration-[var(--dur-fast)] hover:bg-[var(--accent-soft)] focus-visible:outline-[var(--text)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Shuffle
            className="h-5 w-5 transition-transform duration-[var(--dur-base)] group-hover/shuffle:rotate-12"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </button>
      </div>
    </BentoCard>
  );
}
