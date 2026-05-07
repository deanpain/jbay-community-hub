/**
 * Identity batch worker — enqueue daytime registrations, flush off-peak batches to Altron/DHA.
 * Implementation: wire credentials, encryption, and VC issuance per ADR-0001.
 */

import { z } from "zod";

export const queuedVerificationSchema = z.object({
  correlationId: z.string().uuid(),
  createdAt: z.string().datetime({ offset: true }),
  ciphertext: z.string().min(1),
});

export type QueuedVerification = z.infer<typeof queuedVerificationSchema>;
export type VerificationOutcome = "accepted" | "rejected" | "retry";

export interface BatchResult {
  submitted: number;
  accepted: number;
  rejected: number;
  retry: number;
}

export interface BatchMetrics {
  queueDepth: number;
  flushCount: number;
  lastSubmitted: number;
  accepted: number;
  rejected: number;
  retry: number;
  lastFlushAt?: string;
}

export interface IdentityBatchProcessor {
  enqueue(item: QueuedVerification): Promise<void>;
  flushPendingBatch(): Promise<BatchResult>;
  metrics(): BatchMetrics;
}

export interface OffPeakWindow {
  startHour: number;
  endHour: number;
}

export interface SchedulerConfig {
  window: OffPeakWindow;
  dryRunOutcomeFor?: (item: QueuedVerification) => VerificationOutcome;
}

export interface ScheduledBatchProcessor extends IdentityBatchProcessor {
  tick(now?: Date): Promise<BatchResult | null>;
}

export function createInMemoryProcessor(): IdentityBatchProcessor {
  const queue: QueuedVerification[] = [];
  let flushCount = 0;
  let lastSubmitted = 0;
  let accepted = 0;
  let rejected = 0;
  let retry = 0;
  let lastFlushAt: string | undefined;

  const pickOutcome = (_item: QueuedVerification): VerificationOutcome => "accepted";

  return {
    async enqueue(item) {
      queuedVerificationSchema.parse(item);
      queue.push(item);
    },
    async flushPendingBatch() {
      const n = queue.length;
      let a = 0;
      let r = 0;
      let y = 0;
      for (const item of queue) {
        const outcome = pickOutcome(item);
        if (outcome === "accepted") a += 1;
        else if (outcome === "rejected") r += 1;
        else y += 1;
      }
      queue.length = 0;
      flushCount += 1;
      lastSubmitted = n;
      accepted += a;
      rejected += r;
      retry += y;
      lastFlushAt = new Date().toISOString();
      return { submitted: n, accepted: a, rejected: r, retry: y };
    },
    metrics() {
      return {
        queueDepth: queue.length,
        flushCount,
        lastSubmitted,
        accepted,
        rejected,
        retry,
        lastFlushAt,
      };
    },
  };
}

export function isWithinWindow(now: Date, window: OffPeakWindow): boolean {
  const hour = now.getHours();
  if (window.startHour === window.endHour) return true;
  if (window.startHour < window.endHour) {
    return hour >= window.startHour && hour < window.endHour;
  }
  return hour >= window.startHour || hour < window.endHour;
}

export function createScheduledInMemoryProcessor(
  config: SchedulerConfig,
): ScheduledBatchProcessor {
  const queue: QueuedVerification[] = [];
  let flushCount = 0;
  let lastSubmitted = 0;
  let accepted = 0;
  let rejected = 0;
  let retry = 0;
  let lastFlushAt: string | undefined;
  const outcomeFor = config.dryRunOutcomeFor ?? ((_item: QueuedVerification) => "accepted");

  const flushQueue = async (): Promise<BatchResult> => {
    const n = queue.length;
    let a = 0;
    let r = 0;
    let y = 0;
    for (const item of queue) {
      const outcome = outcomeFor(item);
      if (outcome === "accepted") a += 1;
      else if (outcome === "rejected") r += 1;
      else y += 1;
    }
    queue.length = 0;
    flushCount += 1;
    lastSubmitted = n;
    accepted += a;
    rejected += r;
    retry += y;
    lastFlushAt = new Date().toISOString();
    return { submitted: n, accepted: a, rejected: r, retry: y };
  };

  return {
    async enqueue(item) {
      queuedVerificationSchema.parse(item);
      queue.push(item);
    },
    async flushPendingBatch() {
      return flushQueue();
    },
    async tick(now = new Date()) {
      if (queue.length === 0) return null;
      if (!isWithinWindow(now, config.window)) return null;
      return flushQueue();
    },
    metrics() {
      return {
        queueDepth: queue.length,
        flushCount,
        lastSubmitted,
        accepted,
        rejected,
        retry,
        lastFlushAt,
      };
    },
  };
}

export { createAltronProcessor, getAltronCredentials, isSandboxMode } from "./altron/processor.js";
export type { AltronCredentials } from "./altron/client.js";