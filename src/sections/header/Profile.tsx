import { useState } from "react";

import { AppLink } from "../../components/ui/AppLink.tsx";
import { useLanguage } from "../../context/useLanguage.ts";
import { profileImages } from "../../data/profileImages.ts";
import { getInitials } from "../../lib/initials.ts";

type ProfileProps = {
  onNavigate?: () => void;
};

export function Profile({ onNavigate }: ProfileProps) {
  const { t } = useLanguage();
  const [avatarFailed, setAvatarFailed] = useState(false);

  return (
    <AppLink
      href="/"
      onNavigate={onNavigate}
      className="flex min-h-11 items-center gap-[var(--space-3)] rounded-[var(--radius-sm)] text-left"
    >
      <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--accent-soft)] text-xs font-semibold text-[var(--accent-text)]">
        {avatarFailed ? (
          <span aria-hidden="true">{getInitials(t.header.name)}</span>
        ) : (
          <img
            src={profileImages.avatar.src}
            alt=""
            width={profileImages.avatar.width}
            height={profileImages.avatar.height}
            loading="eager"
            decoding="async"
            className="size-full object-cover"
            onError={() => setAvatarFailed(true)}
          />
        )}
      </span>
      <span className="whitespace-nowrap text-sm font-medium uppercase tracking-[0.02em] text-[var(--text)]">
        {t.header.name}
      </span>
    </AppLink>
  );
}
