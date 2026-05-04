import { randomUUID } from "node:crypto";

import { describe, expect, it } from "vitest";

import { createInMemoryProcessor } from "./index.js";

describe("createInMemoryProcessor", () => {
  it("enqueues and flushes ciphertext bundles without inspecting payload", async () => {
    const p = createInMemoryProcessor();
    const correlationId = randomUUID();
    await p.enqueue({
      correlationId,
      createdAt: new Date().toISOString(),
      ciphertext: "a".repeat(64),
    });
    const { submitted } = await p.flushPendingBatch();
    expect(submitted).toBe(1);
    const again = await p.flushPendingBatch();
    expect(again.submitted).toBe(0);
  });
});
