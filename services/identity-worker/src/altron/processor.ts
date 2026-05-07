import { randomUUID } from "node:crypto";

import {
  createAltronClient,
  createStubAltronClient,
  type AltronClient,
  type BatchVerificationRequest,
} from "./client.js";

export interface AltronProcessorConfig {
  apiUrl: string;
  apiKey: string;
  batchSizeLimit: number;
  window: { startHour: number; endHour: number };
}

export interface QueuedItem {
  correlationId: string;
  createdAt: string;
  ciphertext: string;
  keyVersion: string;
  wrappedDek: string;
}

export interface AltronProcessor {
  enqueue(item: QueuedItem): Promise<void>;
  flushPendingBatch(): Promise<{ submitted: number; accepted: number; rejected: number; retry: number }>;
  tick(now?: Date): Promise<{ submitted: number; accepted: number; rejected: number; retry: number } | null>;
  metrics(): {
    queueDepth: number;
    flushCount: number;
    lastSubmitted: number;
    accepted: number;
    rejected: number;
    retry: number;
    lastFlushAt?: string;
  };
}

function isWithinWindow(now: Date, window: { startHour: number; endHour: number }): boolean {
  const hour = now.getHours();
  if (window.startHour === window.endHour) return true;
  if (window.startHour < window.endHour) {
    return hour >= window.startHour && hour < window.endHour;
  }
  return hour >= window.startHour || hour < window.endHour;
}

export function createAltronProcessor(config: AltronProcessorConfig): AltronProcessor {
  const client: AltronClient = config.apiKey
    ? createAltronClient(config.apiUrl, config.apiKey)
    : createStubAltronClient();

  const queue: QueuedItem[] = [];
  let flushCount = 0;
  let lastSubmitted = 0;
  let accepted = 0;
  let rejected = 0;
  let retry = 0;
  let lastFlushAt: string | undefined;

  const flush = async (): Promise<{ submitted: number; accepted: number; rejected: number; retry: number }> => {
    const batchItems = queue.splice(0, config.batchSizeLimit).map((item) => ({
      correlationId: item.correlationId,
      encryptedPayload: item.ciphertext,
      keyVersion: item.keyVersion,
    }));

    if (batchItems.length === 0) {
      return { submitted: 0, accepted: 0, rejected: 0, retry: 0 };
    }

    const request: BatchVerificationRequest = {
      items: batchItems,
      batchId: randomUUID(),
      submittedAt: new Date().toISOString(),
    };

    const response = await client.submitBatch(request);

    let a = 0;
    let r = 0;
    let y = 0;
    for (const result of response.results) {
      if (result.status === "accepted") a += 1;
      else if (result.status === "rejected") r += 1;
      else y += 1;
    }

    flushCount += 1;
    lastSubmitted = batchItems.length;
    accepted += a;
    rejected += r;
    retry += y;
    lastFlushAt = response.processedAt;

    return { submitted: batchItems.length, accepted: a, rejected: r, retry: y };
  };

  return {
    async enqueue(item) {
      queue.push(item);
    },
    async flushPendingBatch() {
      return flush();
    },
    async tick(now = new Date()) {
      if (queue.length === 0) return null;
      if (!isWithinWindow(now, config.window)) return null;
      return flush();
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