import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";

import { profileImages } from "../../data/profileImages.ts";
import { developer } from "../../data/skills.ts";
import { useReducedMotion } from "../../hooks/useReducedMotion.ts";
import { getInitials } from "../../lib/initials.ts";
import { revealVariants } from "../../lib/motion.ts";
import { Metrics } from "./Metrics.tsx";

const PARALLAX_RANGE = ["-6%", "6%"];

export function HeroRight() {
  const reducedMotion = useReducedMotion();
  const photoRef = useRef<HTMLDivElement>(null);
  const [photoFailed, setPhotoFailed] = useState(false);
  const { scrollYProgress } = useScroll({
    target: photoRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], PARALLAX_RANGE);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={reducedMotion ? undefined : revealVariants}
      className="flex flex-col items-center"
    >
      <div ref={photoRef} className="relative w-full max-w-md aspect-square">
        {photoFailed ? (
          <div className="w-full h-full flex items-center justify-center bg-[var(--accent-soft)] text-[var(--accent)] text-display font-bold">
            {getInitials(developer.name)}
          </div>
        ) : (
          <motion.img
            src={profileImages.hero.src}
            alt={developer.name}
            width={profileImages.hero.width}
            height={profileImages.hero.height}
            fetchPriority="high"
            decoding="async"
            style={reducedMotion ? undefined : { y }}
            className="w-full h-full object-contain"
            onError={() => setPhotoFailed(true)}
          />
        )}
      </div>

      <Metrics />
    </motion.div>
  );
}
