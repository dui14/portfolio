import { useState } from "react";

import { FallbackImage } from "../../components/ui/FallbackImage.tsx";
import { useLanguage } from "../../context/useLanguage.ts";
import type { Credential, CredentialGroup } from "../../domain/credential.ts";
import { externalLinkProps } from "../../lib/links.ts";
import { useCredentialDates } from "./useCredentialDates.ts";

type BadgeGridProps = {
  groups: CredentialGroup[];
};

export function BadgeGrid({ groups }: BadgeGridProps) {
  const { t } = useLanguage();
  const dates = useCredentialDates();
  const [active, setActive] = useState<Credential | null>(null);

  return (
    <div className="flex flex-col gap-[var(--space-4)]">
      {groups.map((group) => (
        <div key={group.category} className="flex flex-col gap-[var(--space-2)]">
          <h4 className="text-xs font-bold uppercase tracking-[0.04em] text-[var(--muted)]">
            {t.about.credentialCategories[group.category]} · {group.items.length}
          </h4>
          <ul className="flex flex-wrap gap-[var(--space-3)]">
            {group.items.map((badge) => (
              <li key={badge.id}>
                <a
                  href={badge.url}
                  {...externalLinkProps(badge.url)}
                  aria-label={`${badge.title}, ${badge.issuer}, ${dates.issued(badge)}, ${t.about.opensNewTab}`}
                  onPointerEnter={() => setActive(badge)}
                  onPointerLeave={() => setActive(null)}
                  onFocus={() => setActive(badge)}
                  onBlur={() => setActive(null)}
                  className="block h-16 w-16 rounded-[var(--radius-md)] transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] hover:-translate-y-0.5 focus-visible:-translate-y-0.5 active:scale-95"
                >
                  <FallbackImage
                    src={badge.image?.src ?? ""}
                    srcSet={badge.image?.srcSet}
                    sizes="64px"
                    alt=""
                    fallbackLabel={badge.title}
                    width={badge.image?.width}
                    height={badge.image?.height}
                    className="h-16 w-16 object-contain"
                    fallbackClassName="h-16 w-16 overflow-hidden rounded-[var(--radius-md)] bg-[var(--surface-2)] p-[var(--space-1)] text-xs leading-tight break-words"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <p
        aria-hidden="true"
        className="flex min-h-10 flex-col text-xs text-[var(--muted)]"
      >
        {active && (
          <>
            <span className="font-semibold text-[var(--text)]">{active.title}</span>
            <span>
              {active.issuer} · {dates.describe(active)}
            </span>
          </>
        )}
      </p>
    </div>
  );
}
