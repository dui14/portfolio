import { motion } from "motion/react";

import { socials } from "../../data/socials.ts";
import { useReducedMotion } from "../../hooks/useReducedMotion.ts";
import { socialIcons } from "../../lib/icons.tsx";
import { externalLinkProps } from "../../lib/links.ts";
import { staggerItemVariants } from "../../lib/motion.ts";

export function SocialLinks() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="flex items-center gap-[var(--space-4)]">
      {socials.map((social) => {
        const Icon = socialIcons[social.icon];

        return (
          <motion.a
            key={social.id}
            href={social.href}
            {...externalLinkProps(social.href)}
            aria-label={social.label}
            variants={reducedMotion ? undefined : staggerItemVariants}
            className="p-[var(--space-2)] rounded-[var(--radius-md)] text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--surface)] transition-all duration-[var(--dur-fast)]"
          >
            {Icon && <Icon className="w-5 h-5" />}
          </motion.a>
        );
      })}
    </div>
  );
}
