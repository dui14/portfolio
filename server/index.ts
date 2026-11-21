import { createServer } from "node:http";

import { handleContact } from "./contact/handler.ts";
import { handleNodeRequest } from "./nodeAdapter.ts";

const HOST = "127.0.0.1";
const DEFAULT_PORT = 8787;
const ROUTE = "/api/contact";
const REQUEST_TIMEOUT_MS = 10000;
const HEADERS_TIMEOUT_MS = 5000;
const SHUTDOWN_TIMEOUT_MS = 5000;

const server = createServer(async (request, response) => {
  const pathname = (request.url ?? "").split("?")[0];

  if (pathname !== ROUTE) {
    response.writeHead(404, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ ok: false, error: "validation" }));
    return;
  }

  await handleNodeRequest(request, response, handleContact, process.env, true);
});

server.requestTimeout = REQUEST_TIMEOUT_MS;
server.headersTimeout = HEADERS_TIMEOUT_MS;

const port = Number(process.env.PORT) || DEFAULT_PORT;

server.listen(port, HOST, () => {
  console.log(`contact server listening on ${HOST}:${port}`);
});

function shutdown() {
  const timer = setTimeout(() => process.exit(1), SHUTDOWN_TIMEOUT_MS);
  timer.unref();
  server.close(() => process.exit(0));
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
