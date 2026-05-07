export const DHA_PRICING = {
  R1_BATCH: {
    pricePerVerification: 0.15,
    currency: "ZAR",
    tierName: "DHA R1 Batch",
    description: "Off-peak batch verification via Altron",
  },
  R10_LIVE: {
    pricePerVerification: 2.50,
    currency: "ZAR",
    tierName: "DHA R10 Live",
    description: "Real-time per-user verification",
  },
} as const;

export const ADA_EXCHANGE_RATE_ZAR = 18.5;

export interface CostMetrics {
  totalVerifications: number;
  batchVerifications: number;
  liveVerifications: number;
  totalZAR: number;
  totalADA: number;
  batchSavingsZAR: number;
  batchSavingsPercent: number;
  periodStart: string;
  periodEnd: string;
}

export function calculateBatchCost(verifications: number): number {
  return verifications * DHA_PRICING.R1_BATCH.pricePerVerification;
}

export function calculateLiveCost(verifications: number): number {
  return verifications * DHA_PRICING.R10_LIVE.pricePerVerification;
}

export function calculateSavings(batchVerifications: number): {
  zar: number;
  ada: number;
  percent: number;
} {
  if (batchVerifications === 0) {
    return { zar: 0, ada: 0, percent: 0 };
  }
  const batchCost = calculateBatchCost(batchVerifications);
  const liveCost = calculateLiveCost(batchVerifications);
  const savingsZAR = liveCost - batchCost;
  const savingsPercent = (savingsZAR / liveCost) * 100;
  const savingsADA = savingsZAR / ADA_EXCHANGE_RATE_ZAR;

  return { zar: savingsZAR, ada: savingsADA, percent: savingsPercent };
}

export function computeCostMetrics(
  batchVerifications: number,
  liveVerifications: number,
  periodStart: string,
  periodEnd: string,
): CostMetrics {
  const totalVerifications = batchVerifications + liveVerifications;
  const batchCostZAR = calculateBatchCost(batchVerifications);
  const liveCostZAR = calculateLiveCost(liveVerifications);
  const totalZAR = batchCostZAR + liveCostZAR;
  const totalADA = totalZAR / ADA_EXCHANGE_RATE_ZAR;
  const savings = calculateSavings(batchVerifications);

  return {
    totalVerifications,
    batchVerifications,
    liveVerifications,
    totalZAR: Math.round(totalZAR * 100) / 100,
    totalADA: Math.round(totalADA * 1000) / 1000,
    batchSavingsZAR: Math.round(savings.zar * 100) / 100,
    batchSavingsPercent: Math.round(savings.percent * 10) / 10,
    periodStart,
    periodEnd,
  };
}

export function formatCostReport(metrics: CostMetrics): string {
  return `
=== DHA Verification Cost Report ===
Period: ${metrics.periodStart} to ${metrics.periodEnd}
-------------------------------------
Verifications: ${metrics.totalVerifications}
  Batch (R1): ${metrics.batchVerifications}
  Live (R10): ${metrics.liveVerifications}

Costs:
  Total: ${metrics.totalZAR} ZAR (${metrics.totalADA} ADA)
  Batch savings: ${metrics.batchSavingsZAR} ZAR (${metrics.batchSavingsPercent}% vs live)
`;
}

export const COST_ALERT_THRESHOLD_ZAR = 5000;

export function shouldAlert(metrics: CostMetrics): boolean {
  return metrics.totalZAR > COST_ALERT_THRESHOLD_ZAR;
}