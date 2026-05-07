import { randomUUID } from "node:crypto";
import { jest } from "vitest";

import { describe, expect, it } from "vitest";

import {
  getAltronCredentials,
  isSandboxMode,
  type AltronCredentials,
} from "./client.js";

describe("Altron client", () => {
  describe("getAltronCredentials", () => {
    it("reads from environment variables", () => {
      const prev = { url: process.env.ALTRON_API_URL, key: process.env.ALTRON_API_KEY };
      process.env.ALTRON_API_URL = "https://test.altron.com";
      process.env.ALTRON_API_KEY = "test-key-123";
      try {
        const creds = getAltronCredentials();
        expect(creds.apiUrl).toBe("https://test.altron.com");
        expect(creds.apiKey).toBe("test-key-123");
      } finally {
        process.env.ALTRON_API_URL = prev.url ?? "";
        process.env.ALTRON_API_KEY = prev.key ?? "";
      }
    });

    it("returns empty strings when env vars are absent", () => {
      const prev = { url: process.env.ALTRON_API_URL, key: process.env.ALTRON_API_KEY };
      delete process.env.ALTRON_API_URL;
      delete process.env.ALTRON_API_KEY;
      try {
        const creds = getAltronCredentials();
        expect(creds.apiUrl).toBe("");
        expect(creds.apiKey).toBe("");
      } finally {
        process.env.ALTRON_API_URL = prev.url ?? "";
        process.env.ALTRON_API_KEY = prev.key ?? "";
      }
    });
  });

  describe("isSandboxMode", () => {
    it("returns true when apiKey is empty", () => {
      expect(isSandboxMode({ apiUrl: "https://test.com", apiKey: "" })).toBe(true);
    });

    it("returns false when apiKey is present", () => {
      expect(isSandboxMode({ apiUrl: "https://test.com", apiKey: "key-123" })).toBe(false);
    });
  });

  describe("sandboxBatchResponse", () => {
    it("distributes outcomes across accepted/retry/rejected based on correlationId char code", async () => {
      const { submitBatch } = await import("./client.js");

      const items = Array.from({ length: 30 }, () => ({
        correlationId: randomUUID(),
        ciphertext: randomUUID(),
        createdAt: new Date().toISOString(),
      }));

      const response = await submitBatch({ apiUrl: "", apiKey: "" }, items);

      expect(response.batchId).toMatch(/^sandbox-\d+$/);
      expect(response.results).toHaveLength(30);
      const outcomes = response.results.map((r) => r.outcome);
      expect(outcomes).toContain("accepted");
      expect(outcomes.filter((o) => o === "accepted").length + outcomes.filter((o) => o === "retry").length + outcomes.filter((o) => o === "rejected").length).toBe(30);
    });
  });
});