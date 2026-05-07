import { randomUUID } from "node:crypto";

import {
  createScheduledInMemoryProcessor,
  type QueuedVerification,
} from "./index.js";
import { createStubIdentusClient } from "./identus/client.js";

function makeSynthetic(n: number): QueuedVerification[] {
  return Array.from({ length: n }, () => ({
    correlationId: randomUUID(),
    createdAt: new Date().toISOString(),
    ciphertext: randomUUID().replaceAll("-", ""),
    keyVersion: "v1",
    wrappedDek: randomUUID().replaceAll("-", ""),
    outcome: "pending" as const,
  }));
}

async function main(): Promise<void> {
  const identusClient = createStubIdentusClient();
  const processor = createScheduledInMemoryProcessor({
    window: { startHour: 22, endHour: 5 },
    dryRunOutcomeFor: (item) => {
      const mod = item.correlationId.charCodeAt(0) % 10;
      if (mod < 7) return "accepted";
      if (mod < 9) return "retry";
      return "rejected";
    },
  });

  for (const item of makeSynthetic(24)) {
    await processor.enqueue(item);
  }

  await processor.tick(new Date("2026-05-05T12:00:00Z"), identusClient);
  const res = await processor.tick(new Date("2026-05-05T23:00:00Z"), identusClient);

  const vcs = processor.getIssuedVCs();
  process.stdout.write(
    JSON.stringify(
      {
        dryRun: true,
        submitted: res?.submitted ?? 0,
        accepted: res?.accepted ?? 0,
        rejected: res?.rejected ?? 0,
        retry: res?.retry ?? 0,
        vcIssued: vcs.length,
        vcIds: vcs.map((v) => v.vcId),
        metrics: processor.metrics(),
      },
      null,
      2,
    ) + "\n",
  );
}

void main();
