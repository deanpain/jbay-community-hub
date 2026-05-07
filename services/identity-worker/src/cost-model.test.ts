import { describe, it, expect } from "vitest";
import {
  calculateBatchCost,
  calculateLiveCost,
  calculateSavings,
  computeCostMetrics,
  formatCostReport,
  shouldAlert,
} from "./cost-model.js";

describe("cost-model", () => {
  describe("calculateBatchCost", () => {
    it("calculates correct batch cost for verifications", () => {
      expect(calculateBatchCost(100)).toBe(15);
      expect(calculateBatchCost(1000)).toBe(150);
      expect(calculateBatchCost(0)).toBe(0);
    });
  });

  describe("calculateLiveCost", () => {
    it("calculates correct live cost for verifications", () => {
      expect(calculateLiveCost(100)).toBe(250);
      expect(calculateLiveCost(1000)).toBe(2500);
      expect(calculateLiveCost(0)).toBe(0);
    });
  });

  describe("calculateSavings", () => {
    it("calculates savings correctly", () => {
      const savings = calculateSavings(100);
      expect(savings.zar).toBe(235);
      expect(savings.percent).toBe(94);
      expect(savings.ada).toBeCloseTo(12.7, 1);
    });

    it("returns zero savings for zero verifications", () => {
      const savings = calculateSavings(0);
      expect(savings.zar).toBe(0);
      expect(savings.percent).toBe(0);
    });
  });

  describe("computeCostMetrics", () => {
    it("computes complete metrics", () => {
      const metrics = computeCostMetrics(500, 50, "2026-05-01", "2026-05-31");

      expect(metrics.totalVerifications).toBe(550);
      expect(metrics.batchVerifications).toBe(500);
      expect(metrics.liveVerifications).toBe(50);
      expect(metrics.totalZAR).toBe(200);
      expect(metrics.batchSavingsZAR).toBe(1175);
      expect(metrics.periodStart).toBe("2026-05-01");
      expect(metrics.periodEnd).toBe("2026-05-31");
    });
  });

  describe("shouldAlert", () => {
    it("returns true when cost exceeds threshold", () => {
      const highCost = computeCostMetrics(50000, 0, "2026-05-01", "2026-05-31");
      expect(shouldAlert(highCost)).toBe(true);
    });

    it("returns false when cost is below threshold", () => {
      const lowCost = computeCostMetrics(100, 0, "2026-05-01", "2026-05-31");
      expect(shouldAlert(lowCost)).toBe(false);
    });
  });

  describe("formatCostReport", () => {
    it("formats metrics as readable report", () => {
      const metrics = computeCostMetrics(100, 10, "2026-05-01", "2026-05-31");
      const report = formatCostReport(metrics);

      expect(report).toContain("DHA Verification Cost Report");
      expect(report).toContain("Verifications: 110");
      expect(report).toContain("Batch (R1): 100");
    });
  });
});