/**
 * Startup script for identity-worker — keeps process alive and flushes batches during off-peak windows.
 */

import { createAltronProcessor, getAltronCredentials, isSandboxMode } from "./altron/processor.js";
import { queuedVerificationSchema } from "./index.js";
import * as http from "http";

const TICK_INTERVAL_MS = 60_000; // Check every minute

// Off-peak window: 22:00 to 06:00 (typical for South Africa timezone)
const config = {
  window: { startHour: 22, endHour: 6 },
  batchSizeLimit: 100,
};

const processor = createAltronProcessor(config);

console.log("[identity-worker] Started. Off-peak window:", config.window);
console.log("[identity-worker] Sandbox mode:", isSandboxMode(getAltronCredentials()));

// Health check HTTP server
const HEALTH_PORT = process.env.PORT || 3000;
const healthServer = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }));
  } else {
    res.writeHead(404);
    res.end();
  }
});
healthServer.listen(HEALTH_PORT, () => {
  console.log(`[identity-worker] Health check listening on port ${HEALTH_PORT}`);
});

// Main loop: tick every TICK_INTERVAL_MS
setInterval(async () => {
  try {
    const result = await processor.tick();
    if (result) {
      console.log("[identity-worker] Flushed batch:", result);
    }
  } catch (err) {
    console.error("[identity-worker] Error during tick:", err);
  }
}, TICK_INTERVAL_MS);

// Keep process alive and log metrics periodically
setInterval(() => {
  const metrics = processor.metrics();
  console.log("[identity-worker] Metrics:", metrics);
}, 300_000); // Every 5 minutes

console.log("[identity-worker] Worker is running. Press Ctrl+C to stop.");
