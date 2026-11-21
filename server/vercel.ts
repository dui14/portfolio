import { handleContact, resolveClientIp } from "./contact/handler.ts";

const UNKNOWN_IP = "unknown";

const SERVER_ERROR_BODY = JSON.stringify({ ok: false, error: "server" });

async function handle(request: Request): Promise<Response> {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });

  const bodyText =
    request.method.toUpperCase() === "POST" ? await request.text() : "";

  const result = await handleContact(
    {
      method: request.method,
      headers,
      bodyText,
      ip: resolveClientIp(headers, UNKNOWN_IP, false),
    },
    process.env
  );

  return new Response(result.body, {
    status: result.status,
    headers: result.headers,
  });
}

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      return await handle(request);
    } catch {
      console.warn("contact responded 500");
      return new Response(SERVER_ERROR_BODY, {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
