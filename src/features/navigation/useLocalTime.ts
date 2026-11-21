import { useEffect, useState } from "react";

import type { LanguageId } from "../../lib/i18n.ts";

export const LOCAL_TIME_ZONE = "Asia/Ho_Chi_Minh";

const MINUTE_MS = 60_000;

const LOCALES: Record<LanguageId, string> = {
  en: "en-US",
  vi: "vi-VN",
  zh: "zh-CN",
  ja: "ja-JP",
};

function formatLocalTime(language: LanguageId, date: Date): string | null {
  try {
    const parts = new Intl.DateTimeFormat(LOCALES[language], {
      timeZone: LOCAL_TIME_ZONE,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZoneName: "short",
    }).formatToParts(date);

    const get = (type: Intl.DateTimeFormatPartTypes) =>
      parts.find((part) => part.type === type)?.value ?? "";

    return `${get("hour")}:${get("minute")} · ${get("timeZoneName")}`;
  } catch {
    return null;
  }
}

export type LocalTime = {
  text: string | null;
  ready: boolean;
};

export function useLocalTime(language: LanguageId): LocalTime {
  const [state, setState] = useState<LocalTime>({ text: null, ready: false });

  useEffect(() => {
    let timer = 0;

    function tick() {
      const now = new Date();
      setState({ text: formatLocalTime(language, now), ready: true });
      timer = window.setTimeout(tick, MINUTE_MS - (now.getTime() % MINUTE_MS));
    }

    tick();

    return () => window.clearTimeout(timer);
  }, [language]);

  return state;
}
