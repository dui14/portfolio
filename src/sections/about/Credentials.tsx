import { useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { useLanguage } from "../../context/useLanguage.ts";
import { badgeGroups, certificationGroups } from "../../data/credentials.ts";
import type { CredentialGroup } from "../../domain/credential.ts";
import { BadgeGrid } from "./BadgeGrid.tsx";
import { BentoCard } from "./BentoCard.tsx";
import { CertificationRows } from "./CertificationRows.tsx";

type TabId = "certifications" | "badges";

const TAB_ORDER: TabId[] = ["certifications", "badges"];

const GROUPS: Record<TabId, CredentialGroup[]> = {
  certifications: certificationGroups,
  badges: badgeGroups,
};

function countItems(groups: CredentialGroup[]) {
  return groups.reduce((sum, group) => sum + group.items.length, 0);
}

export function Credentials() {
  const { t } = useLanguage();
  const baseId = useId();
  const [tab, setTab] = useState<TabId>("certifications");
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({
    certifications: null,
    badges: null,
  });

  const labels: Record<TabId, string> = {
    certifications: t.about.tabCertifications,
    badges: t.about.tabBadges,
  };
  const emptyLabels: Record<TabId, string> = {
    certifications: t.about.certificationsEmpty,
    badges: t.about.badgesEmpty,
  };

  function selectTab(next: TabId) {
    setTab(next);
    tabRefs.current[next]?.focus();
  }

  function targetIndex(key: string, current: number) {
    const last = TAB_ORDER.length - 1;
    if (key === "ArrowRight") return current === last ? 0 : current + 1;
    if (key === "ArrowLeft") return current === 0 ? last : current - 1;
    if (key === "Home") return 0;
    if (key === "End") return last;
    return null;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const next = targetIndex(event.key, TAB_ORDER.indexOf(tab));
    if (next === null) return;

    event.preventDefault();
    selectTab(TAB_ORDER[next]);
  }

  return (
    <BentoCard className="bg-[color-mix(in_srgb,var(--accent)_12%,var(--surface))] border border-[var(--border)] p-[var(--space-6)] md:p-[var(--space-8)] flex flex-col gap-[var(--space-5)] lg:col-span-5">
      <div className="flex flex-col gap-[var(--space-1)] text-right">
        <p className="text-xs font-bold uppercase tracking-[0.04em] text-[var(--accent-text)]">
          {t.about.certified}
        </p>
        <h3 className="font-display font-bold text-h1 tracking-[-0.02em] leading-[1.05]">
          {t.about.backpack}
        </h3>
      </div>

      <div
        role="tablist"
        aria-label={t.about.credentialsLabel}
        onKeyDown={handleKeyDown}
        className="inline-flex self-start rounded-[var(--radius-full)] border border-[var(--border)] bg-[var(--surface)] p-[var(--space-1)]"
      >
        {TAB_ORDER.map((id) => {
          const selected = id === tab;

          return (
            <button
              key={id}
              ref={(node) => {
                tabRefs.current[id] = node;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setTab(id)}
              className={`inline-flex min-h-10 items-center gap-[var(--space-2)] rounded-[var(--radius-full)] px-[var(--space-4)] text-sm font-semibold transition-colors duration-[var(--dur-fast)] ${
                selected
                  ? "bg-[var(--accent)] text-[var(--on-accent)]"
                  : "text-[var(--muted)] hover:text-[var(--text)]"
              }`}
            >
              {labels[id]}
              <span className="text-xs tabular-nums opacity-80">
                {countItems(GROUPS[id])}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid min-w-0">
        {TAB_ORDER.map((id) => {
          const groups = GROUPS[id];
          const active = id === tab;

          return (
            <div
              key={id}
              role="tabpanel"
              id={`${baseId}-panel-${id}`}
              aria-labelledby={`${baseId}-tab-${id}`}
              inert={!active}
              className={`col-start-1 row-start-1 min-w-0 ${active ? "" : "invisible"}`}
            >
              {countItems(groups) === 0 ? (
                <p className="py-[var(--space-8)] text-center text-[var(--muted)]">
                  {emptyLabels[id]}
                </p>
              ) : id === "badges" ? (
                <BadgeGrid groups={groups} />
              ) : (
                <CertificationRows groups={groups} />
              )}
            </div>
          );
        })}
      </div>
    </BentoCard>
  );
}
