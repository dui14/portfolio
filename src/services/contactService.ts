import { siteConfig } from "../config/site.ts";
import type {
  ContactError,
  ContactMessage,
  ContactResult,
} from "../domain/contact.ts";

const REQUEST_TIMEOUT_MS = 10000;

function mapStatus(status: number): ContactResult {
  if (status === 200) return { ok: true };

  const validation = [400, 403, 405, 413, 415];
  let error: ContactError = "network";

  if (validation.includes(status)) error = "validation";
  else if (status === 429) error = "rate_limit";
  else if (status >= 500) error = "server";

  return { ok: false, error };
}

export async function submitContactMessage(
  message: ContactMessage,
  honeypot = ""
): Promise<ContactResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(siteConfig.contactEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ ...message, website: honeypot }),
      signal: controller.signal,
    });

    const payload: unknown = await response.json().catch(() => null);

    if (payload === null || typeof payload !== "object") {
      return { ok: false, error: "network" };
    }

    return mapStatus(response.status);
  } catch {
    return { ok: false, error: "network" };
  } finally {
    clearTimeout(timer);
  }
}
