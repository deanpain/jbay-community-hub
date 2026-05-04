import { randomUUID } from "node:crypto";
import { createServer, type IncomingMessage } from "node:http";

const MAX_ENQUEUE_BYTES = 65_536;
const MAX_JOB_ENTRIES = 1000;

type JobRow = { readonly status: "queued" };

function rememberJob(store: Map<string, JobRow>, jobId: string): void {
  if (store.size >= MAX_JOB_ENTRIES) {
    const oldest = store.keys().next().value;
    if (oldest) store.delete(oldest);
  }
  store.set(jobId, { status: "queued" });
}

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
  const jobs = new Map<string, JobRow>();

  return createServer((req, res) => {
    if (req.url === "/healthz") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    if (req.url === "/v1/identity/enqueue" && req.method === "POST") {
      drainRequestBody(req, MAX_ENQUEUE_BYTES)
        .then(() => {
          const jobId = `job_${randomUUID()}`;
          rememberJob(jobs, jobId);
          res.writeHead(202, { "content-type": "application/json" });
          res.end(JSON.stringify({ jobId }));
        })
        .catch((err: unknown) => {
          const tooLarge = err instanceof Error && err.message === "payload_too_large";
          res.writeHead(tooLarge ? 413 : 400, { "content-type": "application/json" });
          res.end(JSON.stringify({ error: tooLarge ? "payload_too_large" : "bad_request" }));
        });
      return;
    }

    if (req.method === "GET" && req.url) {
      const pathname = req.url.split("?")[0] ?? "";
      const jobMatch = /^\/v1\/identity\/jobs\/([^/]+)$/.exec(pathname);
      if (jobMatch) {
        const jobId = decodeURIComponent(jobMatch[1]);
        const row = jobs.get(jobId);
        if (!row) {
          res.writeHead(404, { "content-type": "application/json" });
          res.end(JSON.stringify({ error: "not_found" }));
          return;
        }
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ jobId, status: row.status }));
        return;
      }
    }

    res.writeHead(404);
    res.end();
  });
}
