import { randomUUID } from "node:crypto";

import {
  createScheduledInMemoryProcessor,
  type QueuedVerification,
  type BatchResult,
} from "../index.js";
import { getAltronCredentials, isSandboxMode, submitBatch } from "./client.js";

export { getAltronCredentials, isSandboxMode };
export type { AltronCredentials } from "./client.js";

export interface AltronProcessorConfig {
  window: { startHour: number; endHour: number };
  batchSizeLimit?: number;
}

export function createAltronProcessor(config: AltronProcessorConfig) {
  const batchSizeLimit = config.batchSizeLimit ?? 100;

  const processor = createScheduledInMemoryProcessor({
    window: config.window,
    dryRunOutcomeFor: (item: QueuedVerification) => {
      const mod = item.correlationId.charCodeAt(0) % 10;
      if (mod < 7) return "accepted";
      if (mod < 9) return "retry";
      return "rejected";
    },
  });

  return {
    ...processor,
    async flushToAltron(): Promise<BatchResult> {
      const queue = (processor as unknown as { queue: QueuedVerification[] }).queue;
      if (queue.length === 0) {
        return { submitted: 0, accepted: 0, rejected: 0, retry: 0 };
      }

      const creds = getAltronCredentials();
      if (isSandboxMode(creds)) {
        return processor.flushPendingBatch();
      }

      const batch = queue.splice(0, batchSizeLimit);
      const response = await submitBatch(creds, batch);
      return {
        submitted: response.results.length,
        accepted: response.results.filter((r) => r.outcome === "accepted").length,
        rejected: response.results.filter((r) => r.outcome === "rejected").length,
        retry: response.results.filter((r) => r.outcome === "retry").length,
      };
    },
  };
}