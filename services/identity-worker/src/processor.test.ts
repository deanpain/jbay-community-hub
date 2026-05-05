import { randomUUID } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  createInMemoryProcessor,
  createScheduledInMemoryProcessor,
  isWithinWindow,
} from "./index.js";

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
    expect(p.metrics().flushCount).toBe(2);
    expect(p.metrics().accepted).toBe(1);
  });
});

describe("isWithinWindow", () => {
  it("supports overnight windows", () => {
    expect(isWithinWindow(new Date("2026-05-05T23:15:00"), { startHour: 22, endHour: 5 })).toBe(
      true,
    );
    expect(isWithinWindow(new Date("2026-05-05T04:30:00"), { startHour: 22, endHour: 5 })).toBe(
      true,
    );
    expect(isWithinWindow(new Date("2026-05-05T12:00:00"), { startHour: 22, endHour: 5 })).toBe(
      false,
    );
  });
});

describe("createScheduledInMemoryProcessor", () => {
  it("flushes only during configured off-peak windows", async () => {
    const p = createScheduledInMemoryProcessor({
      window: { startHour: 22, endHour: 5 },
      dryRunOutcomeFor: (item) => (item.correlationId.endsWith("a") ? "rejected" : "accepted"),
    });
    await p.enqueue({
      correlationId: randomUUID(),
      createdAt: new Date().toISOString(),
      ciphertext: "x".repeat(32),
    });
    const atNoon = await p.tick(new Date("2026-05-05T12:00:00"));
    expect(atNoon).toBeNull();
    const atNight = await p.tick(new Date("2026-05-05T23:00:00"));
    expect(atNight?.submitted).toBe(1);
    expect(p.metrics().queueDepth).toBe(0);
    expect(p.metrics().flushCount).toBe(1);
  });
});
