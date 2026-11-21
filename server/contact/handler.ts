import {
  CONTACT_LIMITS,
  validateContactMessage,
} from "../../src/domain/contact.ts";

export type ContactRequest = {
  method: string;
  headers: Record<string, string | undefined>;
  bodyText: string;
  ip: string;
};

export type ContactResponse = {
  status: number;
  headers: Record<string, string>;
  body: string;
};

export type ContactEnv = Record<string, string | undefined>;

export type ContactHandlerOptions = {
  fetch?: typeof fetch;
  now?: () => number;
  allowLocalhost?: boolean;
};

const SETTINGS = {
  maxBodyBytes: 8 * 1024,
  emailMax: 254,
  rateLimitMax: 5,
  rateWindowMs: 10 * 60 * 1000,
  rateMaxEntries: 5000,
  rateSweepEvery: 256,
  resendTimeoutMs: 8000,
  resendUrl: "https://api.resend.com/emails",
  defaultOrigins: ["https://duii.dev", "https://www.duii.dev"],
  localHosts: ["localhost", "127.0.0.1", "[::1]"],
  subjectPrefix: "Portfolio contact from",
} as const;

const CONTROL_CHARS = /[\p{Cc}\p{Zl}\p{Zp}]+/gu;

type ErrorCode = "validation" | "rate_limit" | "server";

function jsonResponse(
  status: number,
  payload: { ok: true } | { ok: false; error: ErrorCode },
  extraHeaders: Record<string, string> = {}
): ContactResponse {
  return {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
    body: JSON.stringify(payload),
  };
}

function fail(
  status: number,
  error: ErrorCode,
  extraHeaders: Record<string, string> = {}
): ContactResponse {
  return jsonResponse(status, { ok: false, error }, extraHeaders);
}

function readHeader(
  headers: Record<string, string | undefined>,
  name: string
): string {
  return headers[name] ?? "";
}

export function resolveClientIp(
  headers: Record<string, string | undefined>,
  socketAddress: string,
  trustCloudflare: boolean
): string {
  const forwarded = readHeader(headers, "x-forwarded-for")
    .split(",")[0]
    .trim();
  const cloudflare = readHeader(headers, "cf-connecting-ip").trim();
  const real = readHeader(headers, "x-real-ip").trim();
  const ordered = trustCloudflare
    ? [cloudflare, forwarded, real]
    : [forwarded, cloudflare, real];

  return ordered.find((value) => value.length > 0) ?? socketAddress;
}

function isAllowedOrigin(
  origin: string,
  env: ContactEnv,
  allowLocalhost: boolean
): boolean {
  const configured = (env.CONTACT_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim().replace(/\/+$/, ""))
    .filter((value) => value.length > 0);
  const allowed: readonly string[] =
    configured.length > 0 ? configured : SETTINGS.defaultOrigins;

  if (allowed.includes(origin)) return true;
  if (!allowLocalhost) return false;

  try {
    const { hostname } = new URL(origin);
    return SETTINGS.localHosts.some(
      (host) => host === hostname || host === `[${hostname}]`
    );
  } catch {
    return false;
  }
}

function createRateLimiter(now: () => number) {
  const hits = new Map<string, number[]>();

  function prune(timestamps: number[], current: number): number[] {
    return timestamps.filter((time) => current - time < SETTINGS.rateWindowMs);
  }

  function sweep(current: number) {
    for (const [key, timestamps] of hits) {
      const fresh = prune(timestamps, current);
      if (fresh.length === 0) hits.delete(key);
      else hits.set(key, fresh);
    }

    while (hits.size > SETTINGS.rateMaxEntries) {
      const oldest = hits.keys().next().value;
      if (oldest === undefined) break;
      hits.delete(oldest);
    }
  }

  return function allow(ip: string): boolean {
    const current = now();

    if (hits.size >= SETTINGS.rateMaxEntries) sweep(current);

    const fresh = prune(hits.get(ip) ?? [], current);

    if (fresh.length >= SETTINGS.rateLimitMax) {
      hits.set(ip, fresh);
      return false;
    }

    fresh.push(current);
    hits.set(ip, fresh);

    if (hits.size % SETTINGS.rateSweepEvery === 0) sweep(current);

    return true;
  };
}

function isJsonContentType(value: string): boolean {
  return /^application\/json\s*(;|$)/i.test(value.trim());
}

function asText(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

export function createContactHandler(options: ContactHandlerOptions = {}) {
  const doFetch = options.fetch ?? fetch;
  const now = options.now ?? Date.now;
  const allowLocalhost = options.allowLocalhost ?? false;
  const allow = createRateLimiter(now);

  async function process(
    request: ContactRequest,
    env: ContactEnv
  ): Promise<ContactResponse> {
    if (request.method.toUpperCase() !== "POST") {
      return fail(405, "validation", { Allow: "POST" });
    }

    const origin = readHeader(request.headers, "origin");

    if (origin && !isAllowedOrigin(origin, env, allowLocalhost)) {
      return fail(403, "validation");
    }

    if (!isJsonContentType(readHeader(request.headers, "content-type"))) {
      return fail(415, "validation");
    }

    if (!allow(request.ip)) {
      return fail(429, "rate_limit");
    }

    if (Buffer.byteLength(request.bodyText, "utf8") > SETTINGS.maxBodyBytes) {
      return fail(413, "validation");
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(request.bodyText);
    } catch {
      return fail(400, "validation");
    }

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return fail(400, "validation");
    }

    const record = parsed as Record<string, unknown>;
    const honeypot = record.website;

    if (
      honeypot !== undefined &&
      honeypot !== null &&
      !(typeof honeypot === "string" && honeypot.length === 0)
    ) {
      return jsonResponse(200, { ok: true });
    }

    const name = asText(record.name);
    const email = asText(record.email);
    const message = asText(record.message);

    if (name === null || email === null || message === null) {
      return fail(400, "validation");
    }

    const clean = {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    };

    if (
      clean.name.length < CONTACT_LIMITS.nameMin ||
      clean.email.length > SETTINGS.emailMax ||
      Object.keys(validateContactMessage(clean)).length > 0
    ) {
      return fail(400, "validation");
    }

    const apiKey = env.RESEND_API_KEY;
    const to = env.CONTACT_TO_EMAIL;
    const from = env.CONTACT_FROM_EMAIL;

    if (!apiKey || !to || !from) {
      return fail(500, "server");
    }

    const subjectName = clean.name.replace(CONTROL_CHARS, " ").trim();
    const payload = {
      from,
      to: [to],
      reply_to: clean.email,
      subject: `${SETTINGS.subjectPrefix} ${subjectName}`,
      text: `Name: ${clean.name}\nEmail: ${clean.email}\n\n${clean.message}`,
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), SETTINGS.resendTimeoutMs);

    try {
      const response = await doFetch(SETTINGS.resendUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        console.warn(`contact resend_status_${response.status}`);
        return fail(502, "server");
      }

      return jsonResponse(200, { ok: true });
    } catch {
      console.warn(
        controller.signal.aborted
          ? "contact resend_timeout"
          : "contact resend_network"
      );
      return fail(502, "server");
    } finally {
      clearTimeout(timer);
    }
  }

  return async function handle(
    request: ContactRequest,
    env: ContactEnv
  ): Promise<ContactResponse> {
    const result = await process(request, env);

    if (result.status !== 200) {
      console.warn(`contact responded ${result.status}`);
    }

    return result;
  };
}

export const handleContact = createContactHandler();
