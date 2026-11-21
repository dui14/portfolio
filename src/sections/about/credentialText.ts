import type { Credential } from "../../domain/credential.ts";

type CredentialLabels = {
  issuedOn: string;
  expiresOn: string;
};

export function describeDates(
  credential: Credential,
  labels: CredentialLabels,
  formatDate: (iso: string) => string,
): string {
  const parts = [labels.issuedOn.replace("{date}", formatDate(credential.issuedAt))];

  if (credential.expiresAt) {
    parts.push(labels.expiresOn.replace("{date}", formatDate(credential.expiresAt)));
  }

  return parts.join(" · ");
}
