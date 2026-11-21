import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";

import { FallbackImage } from "../../components/ui/FallbackImage.tsx";
import { ImageLightbox } from "../../components/ui/ImageLightbox.tsx";
import { useLanguage } from "../../context/useLanguage.ts";
import type { Credential, CredentialGroup } from "../../domain/credential.ts";
import { externalLinkProps } from "../../lib/links.ts";

import { useCredentialDates } from "./useCredentialDates.ts";

type CertificationRowsProps = {
  groups: CredentialGroup[];
};

const FRAME =
  "block aspect-[4/3] w-44 shrink-0 snap-start overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] transition-all duration-[var(--dur-base)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-[var(--accent)] active:scale-[0.98]";

export function CertificationRows({ groups }: CertificationRowsProps) {
  const { t } = useLanguage();
  const dates = useCredentialDates();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const viewable = useMemo(
    () =>
      groups.flatMap((group) => group.items).filter((item) => item.image !== undefined),
    [groups],
  );

  const current = openIndex === null ? undefined : viewable[openIndex];
  const total = viewable.length;

  function step(direction: 1 | -1) {
    if (openIndex === null) return;
    setOpenIndex((openIndex + direction + total) % total);
  }

  function label(item: Credential, extra?: string) {
    const parts = [item.title, item.issuer, dates.issued(item)];
    if (extra) parts.push(extra);
    return parts.join(", ");
  }

  return (
    <div className="flex flex-col gap-[var(--space-4)]">
      {groups.map((group) => (
        <div key={group.category} className="flex min-w-0 flex-col gap-[var(--space-2)]">
          <h4 className="text-xs font-bold uppercase tracking-[0.04em] text-[var(--muted)]">
            {t.about.credentialCategories[group.category]} · {group.items.length}
          </h4>
          <ul className="flex snap-x snap-mandatory gap-[var(--space-3)] overflow-x-auto pb-[var(--space-2)] [scrollbar-width:thin]">
            {group.items.map((item) => {
              const viewIndex = viewable.findIndex((entry) => entry.id === item.id);

              return (
                <li key={item.id} className="shrink-0 snap-start">
                  {item.image ? (
                    <button
                      type="button"
                      aria-haspopup="dialog"
                      aria-label={label(item)}
                      onClick={() => setOpenIndex(viewIndex)}
                      className={`${FRAME} cursor-zoom-in`}
                    >
                      <FallbackImage
                        src={item.image.src}
                        srcSet={item.image.srcSet}
                        sizes="176px"
                        alt=""
                        fallbackLabel={item.title}
                        width={item.image.width}
                        height={item.image.height}
                        className="h-full w-full object-contain"
                        fallbackClassName="p-[var(--space-3)] text-xs"
                      />
                    </button>
                  ) : (
                    <a
                      href={item.url}
                      {...externalLinkProps(item.url)}
                      aria-label={label(item, t.about.opensNewTab)}
                      className={`${FRAME} flex flex-col justify-between p-[var(--space-3)]`}
                    >
                      <span className="text-xs font-semibold uppercase tracking-[0.04em] text-[var(--accent-text)]">
                        {item.issuer}
                      </span>
                      <span className="line-clamp-3 text-sm font-semibold leading-snug">
                        {item.title}
                      </span>
                      <span className="flex items-center justify-between gap-[var(--space-2)] text-xs text-[var(--muted)]">
                        {dates.issued(item)}
                        <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                      </span>
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <ImageLightbox
        open={current !== undefined}
        onClose={() => setOpenIndex(null)}
        closeLabel={t.about.certificateClose}
        title={current?.title}
        image={current?.image}
        imageKey={current?.id}
        alt={current ? `${current.title}, ${current.issuer}` : ""}
        fallbackLabel={current?.title ?? ""}
        counter={
          current && total > 1 && openIndex !== null
            ? t.about.certificateCounter
                .replace("{current}", String(openIndex + 1))
                .replace("{total}", String(total))
            : undefined
        }
        navigation={
          total > 1
            ? {
                previousLabel: t.about.certificatePrevious,
                nextLabel: t.about.certificateNext,
                onStep: step,
              }
            : undefined
        }
        footer={
          current && (
            <div className="flex flex-wrap items-center justify-between gap-[var(--space-3)]">
              <p className="flex flex-col text-sm">
                <span className="font-semibold">{current.issuer}</span>
                <span className="text-[var(--muted)]">{dates.describe(current)}</span>
              </p>
              <a
                href={current.url}
                {...externalLinkProps(current.url)}
                className="inline-flex min-h-11 items-center gap-[var(--space-1)] rounded-[var(--radius-full)] bg-[var(--accent)] px-[var(--space-4)] text-sm font-semibold text-[var(--on-accent)] transition-transform duration-[var(--dur-fast)] hover:-translate-y-0.5 active:scale-95"
              >
                {t.about.verifyCredential}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          )
        }
      />
    </div>
  );
}
