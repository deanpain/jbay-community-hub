import { randomUUID } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  createAltronProcessor,
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
      keyVersion: "v1",
      wrappedDek: "b".repeat(44),
      outcome: "pending",
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
  it("supports same-hour windows (always open)", () => {
    const window = { startHour: 10, endHour: 10 };
    expect(isWithinWindow(new Date("2026-05-05T10:00:00"), window)).toBe(true);
    expect(isWithinWindow(new Date("2026-05-05T15:00:00"), window)).toBe(true);
  });

  it("supports standard day windows", () => {
    const window = { startHour: 8, endHour: 18 };
    expect(isWithinWindow(new Date("2026-05-05T10:00:00"), window)).toBe(true);
    expect(isWithinWindow(new Date("2026-05-05T20:00:00"), window)).toBe(false);
  });

  it("supports overnight windows", () => {
    const window = { startHour: 22, endHour: 5 };
    expect(isWithinWindow(new Date("2026-05-05T23:00:00"), window)).toBe(true);
    expect(isWithinWindow(new Date("2026-05-05T03:00:00"), window)).toBe(true);
    expect(isWithinWindow(new Date("2026-05-05T12:00:00"), window)).toBe(false);
  });
});

describe("createScheduledInMemoryProcessor", () => {
  it("flushes only during configured off-peak windows", async () => {
    const p = createScheduledInMemoryProcessor({
      window: { startHour: 22, endHour: 5 },
      dryRunOutcomeFor: (item) =>
        item.correlationId.endsWith("a") ? "rejected" : "accepted",
    });
    await p.enqueue({
      correlationId: randomUUID(),
      createdAt: new Date().toISOString(),
      ciphertext: "x".repeat(32),
      keyVersion: "v1",
      wrappedDek: "b".repeat(44),
      outcome: "pending",
    });
    const atNoon = await p.tick(new Date("2026-05-05T12:00:00"));
    expect(atNoon).toBeNull();
    const atNight = await p.tick(new Date("2026-05-05T23:00:00"));
    expect(atNight?.submitted).toBe(1);
    expect(p.metrics().queueDepth).toBe(0);
    expect(p.metrics().flushCount).toBe(1);
  });

  it("returns null when queue is empty", async () => {
    const p = createScheduledInMemoryProcessor({
      window: { startHour: 0, endHour: 23 },
    });
    const result = await p.tick();
    expect(result).toBeNull();
  });
});

describe("createAltronProcessor", () => {
  it("submits batch to Altron stub when no API key set", async () => {
    const p = createAltronProcessor({
      apiUrl: "https://api.altron-sandbox.gov.za/v1",
      apiKey: "",
      batchSizeLimit: 100,
      window: { startHour: 0, endHour: 23 },
    });

    await p.enqueue({
      correlationId: randomUUID(),
      createdAt: new Date().toISOString(),
      ciphertext: "c2VjcmV0",
      keyVersion: "v1",
      wrappedDek: "d".repeat(44),
    });

    const result = await p.flushPendingBatch();
    expect(result.submitted).toBe(1);
    expect(p.metrics().queueDepth).toBe(0);
  });

  it("respects batch size limit when flushing large batches", async () => {
    const p = createAltronProcessor({
      apiUrl: "https://api.altron-sandbox.gov.za/v1",
      apiKey: "",
      batchSizeLimit: 2,
      window: { startHour: 0, endHour: 23 },
    });

    for (let i = 0; i < 5; i++) {
      await p.enqueue({
        correlationId: randomUUID(),
        createdAt: new Date().toISOString(),
        ciphertext: "c2VjcmV0",
        keyVersion: "v1",
        wrappedDek: "d".repeat(44),
      });
    }

    const result = await p.flushPendingBatch();
    expect(result.submitted).toBe(2);
    expect(p.metrics().queueDepth).toBe(3);

    const second = await p.flushPendingBatch();
    expect(second.submitted).toBe(2);
    expect(p.metrics().queueDepth).toBe(1);

    const third = await p.flushPendingBatch();
    expect(third.submitted).toBe(1);
    expect(p.metrics().queueDepth).toBe(0);
  });
});