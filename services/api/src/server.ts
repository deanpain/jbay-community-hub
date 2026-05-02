import { randomUUID } from "node:crypto";
import { createServer, type IncomingMessage } from "node:http";

const MAX_ENQUEUE_BYTES = 65_536;

/** Consume body without logging or parsing — opaque hand-off for future identity queue. */
function drainRequestBody(req: IncomingMessage, maxBytes: number): Promise<void> {
  return new Promise((resolve, reject) => {
    let size = 0;
    req.on("data", (chunk: Buffer) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(new Error("payload_too_large"));
      }
    });
    req.on("end", () => resolve());
    req.on("error", reject);
  });
}

export function createApiServer() {
  return createServer((req, res) => {
    if (req.url === "/healthz") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    if (req.url === "/v1/identity/enqueue" && req.method === "POST") {
      drainRequestBody(req, MAX_ENQUEUE_BYTES)
        .then(() => {
          res.writeHead(202, { "content-type": "application/json" });
          res.end(JSON.stringify({ jobId: `job_${randomUUID()}` }));
        })
        .catch((err: unknown) => {
          const tooLarge = err instanceof Error && err.message === "payload_too_large";
          res.writeHead(tooLarge ? 413 : 400, { "content-type": "application/json" });
          res.end(JSON.stringify({ error: tooLarge ? "payload_too_large" : "bad_request" }));
        });
      return;
    }

    res.writeHead(404);
    res.end();
  });
}
