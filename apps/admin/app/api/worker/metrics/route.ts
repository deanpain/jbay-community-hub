import { NextResponse } from 'next/server';

const WORKER_URL = process.env.IDENTITY_WORKER_URL || 'http://localhost:3000';

interface BatchHistoryEntry {
  batchId: string;
  timestamp: string;
  submitted: number;
  accepted: number;
  rejected: number;
  retry: number;
  model: 'R1' | 'R10';
  estimatedCostCents: number;
}

interface WorkerMetrics {
  queueDepth: number;
  flushCount: number;
  lastSubmitted: number;
  accepted: number;
  rejected: number;
  retry: number;
  lastFlushAt?: string;
  batchHistory: BatchHistoryEntry[];
  totalCostCents: number;
}

function generateSimulatedMetrics(): WorkerMetrics {
  const now = new Date();
  const batchHistory: BatchHistoryEntry[] = [];
  
  // Generate 30 days of simulated batch history
  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random number of batches per day (0-3)
    const batchesPerDay = Math.floor(Math.random() * 4);
    for (let j = 0; j < batchesPerDay; j++) {
      const model = Math.random() > 0.3 ? 'R1' : 'R10';
      const submitted = Math.floor(Math.random() * 50) + 10;
      const accepted = Math.floor(submitted * (0.7 + Math.random() * 0.25));
      const rejected = Math.floor((submitted - accepted) * 0.8);
      const retry = submitted - accepted - rejected;
      
      // R1: ~$0.02/verification, R10: ~$0.10/verification (bulk discount)
      const costPerVerification = model === 'R1' ? 2 : 10;
      const estimatedCostCents = submitted * costPerVerification;
      
      batchHistory.push({
        batchId: `batch-${i}-${j}-${Date.now()}`,
        timestamp: date.toISOString(),
        submitted,
        accepted,
        rejected,
        retry,
        model,
        estimatedCostCents,
      });
    }
  }
  
  const totalCostCents = batchHistory.reduce((sum, b) => sum + b.estimatedCostCents, 0);
  const lastBatch = batchHistory[batchHistory.length - 1];
  
  return {
    queueDepth: Math.floor(Math.random() * 10),
    flushCount: batchHistory.length,
    lastSubmitted: lastBatch?.submitted || 0,
    accepted: batchHistory.reduce((sum, b) => sum + b.accepted, 0),
    rejected: batchHistory.reduce((sum, b) => sum + b.rejected, 0),
    retry: batchHistory.reduce((sum, b) => sum + b.retry, 0),
    lastFlushAt: lastBatch?.timestamp,
    batchHistory,
    totalCostCents,
  };
}

export async function GET() {
  try {
    // Try to fetch from real worker first
    try {
      const res = await fetch(`${WORKER_URL}/metrics`, { 
        signal: AbortSignal.timeout(2000) 
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch {
      // Worker not available, fall through to simulated data
    }
    
    // Return simulated metrics for demo purposes
    // In production, this would query Supabase identity_batches table
    const metrics = generateSimulatedMetrics();
    return NextResponse.json(metrics);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch worker metrics', details: String(error) },
      { status: 500 }
    );
  }
}
