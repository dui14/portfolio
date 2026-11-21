import { motion } from "motion/react";

import { Button } from "../../components/ui/Button.tsx";
import { useLanguage } from "../../context/useLanguage.ts";
import { scrollToSection } from "../../lib/scroll.ts";
import { useReducedMotion } from "../../hooks/useReducedMotion.ts";
import { staggerVariants, staggerItemVariants } from "../../lib/motion.ts";
import { SocialLinks } from "./SocialLinks.tsx";

export function HeroLeft() {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();
  const headlines = [
    { id: "coder", text: t.hero.headline.coder, accent: false },
    { id: "builder", text: t.hero.headline.builder, accent: false },
    { id: "researcher", text: t.hero.headline.researcher, accent: true },
  ];

  return (
    <motion.div
      variants={reducedMotion ? undefined : staggerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col justify-center"
    >
      <motion.div
        variants={reducedMotion ? undefined : staggerItemVariants}
        className="mb-[var(--space-6)] flex items-center gap-[var(--space-3)] font-mono text-xs uppercase tracking-[0.04em] text-[var(--muted)] lg:whitespace-nowrap"
      >
        <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
          {!reducedMotion && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-[var(--radius-full)] bg-[var(--accent)] opacity-60" />
          )}
          <span className="relative inline-flex h-2 w-2 rounded-[var(--radius-full)] bg-[var(--accent)]" />
        </span>
        <span className="min-w-0">{t.hero.status}</span>
      </motion.div>

      <motion.div
        variants={reducedMotion ? undefined : staggerItemVariants}
        className="mb-[var(--space-8)]"
      >
        <h1 className="font-display font-bold text-[length:clamp(2.5rem,12vw,4.5rem)] lg:text-[length:clamp(3.5rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.035em] hyphens-auto">
          {headlines.map((line) => (
            <span
              key={line.id}
              className={`block ${line.accent ? "text-[var(--accent)]" : ""}`}
            >
              {line.text}
            </span>
          ))}
        </h1>
      </motion.div>

      <motion.p
        variants={reducedMotion ? undefined : staggerItemVariants}
        className="text-lg text-[var(--muted)] mb-[var(--space-8)] max-w-lg"
      >
        {t.hero.description}
      </motion.p>

      <motion.div
        variants={reducedMotion ? undefined : staggerItemVariants}
        className="flex flex-wrap items-center gap-[var(--space-4)] mb-[var(--space-8)]"
      >
        <Button
          variant="primary"
          onClick={() => scrollToSection("projects")}
        >
          {t.hero.viewProjects}
        </Button>
        <Button
          variant="ghost"
          onClick={() => scrollToSection("contact")}
        >
          {t.hero.contactMe}
        </Button>
      </motion.div>

      <motion.div variants={reducedMotion ? undefined : staggerVariants}>
        <SocialLinks />
      </motion.div>
    </motion.div>
  );
}
