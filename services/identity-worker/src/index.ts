/**
 * Identity batch worker — enqueue daytime registrations, flush off-peak batches to Altron/DHA.
 * Implementation placeholder: wire credentials, encryption, and VC issuance per ADR-0001.
 */

import { z } from "zod";

export const queuedVerificationSchema = z.object({
  correlationId: z.string().uuid(),
  createdAt: z.string().datetime({ offset: true }),
  /** Encrypted payload — never log decrypted contents */
  ciphertext: z.string().min(1),
});

export type QueuedVerification = z.infer<typeof queuedVerificationSchema>;

export interface IdentityBatchProcessor {
  enqueue(item: QueuedVerification): Promise<void>;
  flushPendingBatch(): Promise<{ submitted: number }>;
}

export function createInMemoryProcessor(): IdentityBatchProcessor {
  const queue: QueuedVerification[] = [];
  return {
    async enqueue(item) {
      queuedVerificationSchema.parse(item);
      queue.push(item);
    },
    async flushPendingBatch() {
      const n = queue.length;
      queue.length = 0;
      return { submitted: n };
    },
  };
}