/**
 * Identity batch worker — enqueue daytime registrations, flush off-peak batches to Altron/DHA.
 * Production: wire credentials, encryption, and VC issuance per ADR-0001 + docs/runbooks/identus-vdr-anchor.md
 */

import { z } from "zod";

import {
  type IdentusClient,
  type CredentialClaims,
} from "./identus/client.js";
import { createAltronProcessor, type AltronProcessorConfig } from "./altron/processor.js";

export type { AltronProcessorConfig };

export { createAltronProcessor };

export const queuedVerificationSchema = z.object({
  correlationId: z.string().uuid(),
  createdAt: z.string().datetime({ offset: true }),
  ciphertext: z.string().min(1),
  keyVersion: z.string(),
  wrappedDek: z.string().min(1),
  outcome: z.enum(["pending", "accepted", "rejected", "retry"]).default("pending"),
});

export type QueuedVerification = z.infer<typeof queuedVerificationSchema>;

export interface EncryptionResult {
  ciphertext: string;
  wrappedDek: string;
  keyVersion: string;
}

export interface KMSConfig {
  keyAlias: string;
  keyVersion: string;
  region?: string;
}

export {
  createKMSClient,
  createEncryptionService,
  rotateKey,
  KMSUnavailableError,
  DecryptFailureError,
  type KMSClient,
  type EncryptionService,
  type KeyRotationResult,
} from "./kms.js";

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

export interface VCIssuanceRecord {
  correlationId: string;
  vcId: string;
  issuedAt: string;
}

export interface IdentityBatchProcessor {
  enqueue(item: QueuedVerification): Promise<void>;
  flushPendingBatch(identusClient?: IdentusClient): Promise<BatchResult>;
  metrics(): BatchMetrics;
  getIssuedVCs(): VCIssuanceRecord[];
}

export interface OffPeakWindow {
  startHour: number;
  endHour: number;
}

export interface SchedulerConfig {
  window: OffPeakWindow;
  dryRunOutcomeFor?: (item: QueuedVerification) => "accepted" | "rejected" | "retry";
}

export interface ScheduledBatchProcessor extends IdentityBatchProcessor {
  tick(now?: Date, identusClient?: IdentusClient): Promise<BatchResult | null>;
}

export function isWithinWindow(now: Date, window: OffPeakWindow): boolean {
  const hour = now.getHours();
  if (window.startHour === window.endHour) return true;
  if (window.startHour < window.endHour) {
    return hour >= window.startHour && hour < window.endHour;
  }
  return hour >= window.startHour || hour < window.endHour;
}

export function createInMemoryProcessor(): IdentityBatchProcessor {
  const queue: QueuedVerification[] = [];
  let flushCount = 0;
  let accepted = 0;
  let rejected = 0;
  let retry = 0;
  let lastSubmitted = 0;
  let lastFlushAt: string | undefined;
  const issuedVCs: VCIssuanceRecord[] = [];

  const pickOutcome = (_item: QueuedVerification): "accepted" | "rejected" | "retry" => "accepted";

  return {
    async enqueue(item: QueuedVerification): Promise<void> {
      queuedVerificationSchema.parse(item);
      queue.push(item);
    },
    async flushPendingBatch(identusClient?: IdentusClient) {
      const n = queue.length;
      let a = 0;
      let r = 0;
      let y = 0;
      for (const item of queue) {
        const outcome = pickOutcome(item);
        if (outcome === "accepted") {
          a += 1;
          if (identusClient) {
            const claims: CredentialClaims = {
              residentStatus: "verified",
              verificationDate: new Date().toISOString(),
              dhaReference: item.correlationId,
            };
            const holderDID = await identusClient.createHolderDID();
            const vcResult = await identusClient.issueCredential(holderDID, claims);
            if (vcResult.status === "issued") {
              issuedVCs.push({
                correlationId: item.correlationId,
                vcId: vcResult.vcId,
                issuedAt: vcResult.issuedAt,
              });
            }
          }
        } else if (outcome === "rejected") {
          r += 1;
        } else {
          y += 1;
        }
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
    getIssuedVCs() {
      return [...issuedVCs];
    },
  };
}

export function createScheduledInMemoryProcessor(
  config: SchedulerConfig,
): ScheduledBatchProcessor & { getIssuedVCs(): VCIssuanceRecord[] } {
  const queue: QueuedVerification[] = [];
  let flushCount = 0;
  let lastSubmitted = 0;
  let accepted = 0;
  let rejected = 0;
  let retry = 0;
  let lastFlushAt: string | undefined;
  const issuedVCs: VCIssuanceRecord[] = [];
  const outcomeFor = config.dryRunOutcomeFor ?? (() => "accepted");

  const flushQueue = async (identusClient?: IdentusClient): Promise<BatchResult> => {
    const n = queue.length;
    let a = 0;
    let r = 0;
    let y = 0;
    for (const item of queue) {
      const outcome = outcomeFor(item);
      if (outcome === "accepted") {
        a += 1;
        if (identusClient) {
          const claims: CredentialClaims = {
            residentStatus: "verified",
            verificationDate: new Date().toISOString(),
            dhaReference: item.correlationId,
          };
          const holderDID = await identusClient.createHolderDID();
          const vcResult = await identusClient.issueCredential(holderDID, claims);
          if (vcResult.status === "issued") {
            issuedVCs.push({
              correlationId: item.correlationId,
              vcId: vcResult.vcId,
              issuedAt: vcResult.issuedAt,
            });
          }
        }
      } else if (outcome === "rejected") {
        r += 1;
      } else {
        y += 1;
      }
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
    async enqueue(item: QueuedVerification): Promise<void> {
      queuedVerificationSchema.parse(item);
      queue.push(item);
    },
    async flushPendingBatch(identusClient?: IdentusClient) {
      return flushQueue(identusClient);
    },
    async tick(now = new Date(), identusClient?: IdentusClient) {
      if (queue.length === 0) return null;
      if (!isWithinWindow(now, config.window)) return null;
      return flushQueue(identusClient);
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
    getIssuedVCs() {
      return [...issuedVCs];
    },
  };
}