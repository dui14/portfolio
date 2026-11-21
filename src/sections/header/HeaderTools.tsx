import { MapPin, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

import { Popover } from "../../components/ui/Popover.tsx";
import { useLanguage } from "../../context/useLanguage.ts";
import { HeaderCta } from "./HeaderCta.tsx";
import { Location } from "./Location.tsx";
import { PreferencesPanel } from "./PreferencesPanel.tsx";
import { SearchButton } from "./SearchButton.tsx";

type PopoverId = "location" | "settings";

export function HeaderTools() {
  const { t } = useLanguage();
  const [openId, setOpenId] = useState<PopoverId | null>(null);

  function bind(id: PopoverId) {
    return {
      open: openId === id,
      onOpenChange: (next: boolean) => setOpenId(next ? id : null),
    };
  }

  return (
    <div className="flex items-center gap-[var(--space-2)]">
      <SearchButton variant="pill" />
      <Popover
        {...bind("location")}
        triggerLabel={t.header.locationLabel}
        icon={
          <MapPin className="size-5" strokeWidth={1.75} aria-hidden="true" />
        }
        panelClassName="w-60"
      >
        <Location />
      </Popover>
      <Popover
        {...bind("settings")}
        triggerLabel={t.header.settingsLabel}
        icon={
          <SlidersHorizontal
            className="size-5"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        }
        panelClassName="w-72 p-[var(--space-4)]"
      >
        <PreferencesPanel />
      </Popover>
      <div className="ml-[var(--space-2)]">
        <HeaderCta />
      </div>
    </div>
  );
}
