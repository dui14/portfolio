import type { IncomingMessage, ServerResponse } from "node:http";

import type {
  ContactEnv,
  ContactRequest,
  ContactResponse,
} from "./contact/handler.ts";
import { resolveClientIp } from "./contact/handler.ts";

type ContactHandle = (
  request: ContactRequest,
  env: ContactEnv
) => Promise<ContactResponse>;

const MAX_READ_BYTES = 16 * 1024;
const UNKNOWN_IP = "unknown";
const JSON_HEADERS = { "Content-Type": "application/json" };

const PAYLOAD_TOO_LARGE = JSON.stringify({ ok: false, error: "validation" });
const SERVER_ERROR = JSON.stringify({ ok: false, error: "server" });

function flattenHeaders(
  raw: IncomingMessage["headers"]
): Record<string, string | undefined> {
  const headers: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(raw)) {
    headers[key.toLowerCase()] = Array.isArray(value) ? value[0] : value;
  }
  return headers;
}

function readBody(request: IncomingMessage): Promise<string | null> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    let size = 0;
    let settled = false;

    function finish(value: string | null) {
      if (settled) return;
      settled = true;
      resolve(value);
    }

    request.on("data", (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_READ_BYTES) {
        request.pause();
        finish(null);
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => finish(Buffer.concat(chunks).toString("utf8")));
    request.on("error", () => finish(""));
  });
}

function respond(
  response: ServerResponse,
  status: number,
  headers: Record<string, string>,
  body: string
) {
  if (response.headersSent) return;
  response.writeHead(status, headers);
  response.end(body);
}

export async function handleNodeRequest(
  request: IncomingMessage,
  response: ServerResponse,
  handle: ContactHandle,
  env: ContactEnv,
  trustCloudflare: boolean
): Promise<void> {
  try {
    const headers = flattenHeaders(request.headers);
    const method = request.method ?? "GET";
    let bodyText = "";

    if (method.toUpperCase() === "POST") {
      const body = await readBody(request);

      if (body === null) {
        response.once("finish", () => request.destroy());
        respond(
          response,
          413,
          { ...JSON_HEADERS, Connection: "close" },
          PAYLOAD_TOO_LARGE
        );
        return;
      }

      bodyText = body;
    }

    const result = await handle(
      {
        method,
        headers,
        bodyText,
        ip: resolveClientIp(
          headers,
          request.socket.remoteAddress ?? UNKNOWN_IP,
          trustCloudflare
        ),
      },
      env
    );

    respond(response, result.status, result.headers, result.body);
  } catch {
    console.warn("contact responded 500");
    respond(response, 500, JSON_HEADERS, SERVER_ERROR);
  }
}
