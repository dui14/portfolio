import { MapPin } from "lucide-react";

import { useLanguage } from "../../context/useLanguage.ts";
import { developer } from "../../data/skills.ts";
import { socials } from "../../data/socials.ts";
import { socialIcons } from "../../lib/icons.tsx";
import { externalLinkProps } from "../../lib/links.ts";
import { BentoCard } from "./BentoCard.tsx";

const CHIP_GROUND =
  "bg-[color-mix(in_srgb,var(--on-accent)_14%,transparent)] border-[color-mix(in_srgb,var(--on-accent)_22%,transparent)]";
const SOCIAL_STYLE =
  "border-[color-mix(in_srgb,var(--on-accent)_55%,transparent)] hover:bg-[color-mix(in_srgb,var(--on-accent)_16%,transparent)] hover:border-[var(--on-accent)]";

export function IntroCard() {
  const { t } = useLanguage();
  const nameParts = developer.name.split(" ");

  return (
    <BentoCard className="bg-[var(--accent)] text-[var(--on-accent)] p-[var(--space-6)] md:p-[var(--space-8)] lg:p-[var(--space-10)] flex flex-col gap-[var(--space-6)] lg:col-span-7">
      <p className="font-display font-bold text-display tracking-[-0.035em] leading-[0.95]">
        {nameParts.map((part) => (
          <span key={part} className="block">
            {part}
          </span>
        ))}
      </p>

      <p
        className="flex flex-wrap items-center gap-x-[var(--space-3)] gap-y-[var(--space-1)] text-sm font-medium"
      >
        <span className="basis-full sm:basis-auto">{t.header.role}</span>
        <span aria-hidden="true" className="hidden sm:inline">·</span>
        <span className="inline-flex items-center gap-[var(--space-1)]">
          <MapPin className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
          {t.header.location}
        </span>
      </p>

      <ul className="flex flex-wrap gap-[var(--space-2)]">
        {t.about.tags.map((tag) => (
          <li
            key={tag}
            className={`rounded-[var(--radius-full)] border px-[var(--space-3)] py-[var(--space-1)] text-xs font-semibold ${CHIP_GROUND}`}
          >
            {tag}
          </li>
        ))}
      </ul>

      <p className="text-base">{t.about.introText}</p>

      <div className="flex flex-wrap gap-[var(--space-3)] mt-auto">
        {socials.map((social) => {
          const Icon = socialIcons[social.icon];

          return (
            <a
              key={social.id}
              href={social.href}
              aria-label={social.label}
              {...externalLinkProps(social.href)}
              className={`inline-flex w-11 h-11 items-center justify-center rounded-[var(--radius-full)] border transition-all duration-[var(--dur-fast)] hover:-translate-y-0.5 active:scale-95 focus-visible:outline-[var(--on-accent)] ${SOCIAL_STYLE}`}
            >
              {Icon && <Icon className="w-5 h-5" />}
            </a>
          );
        })}
      </div>
    </BentoCard>
  );
}
