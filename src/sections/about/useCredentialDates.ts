import { useMemo } from "react";

import { useLanguage } from "../../context/useLanguage.ts";
import type { Credential } from "../../domain/credential.ts";
import { createMonthYearFormatter } from "../../lib/dates.ts";
import { describeDates } from "./credentialText.ts";

export function useCredentialDates() {
  const { language, t } = useLanguage();
  const formatDate = useMemo(() => createMonthYearFormatter(language), [language]);

  return useMemo(
    () => ({
      issued: (credential: Credential) =>
        t.about.issuedOn.replace("{date}", formatDate(credential.issuedAt)),
      describe: (credential: Credential) =>
        describeDates(credential, t.about, formatDate),
    }),
    [formatDate, t.about],
  );
}
