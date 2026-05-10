import { NextResponse } from 'next/server';

const WORKER_URL = process.env.IDENTITY_WORKER_URL || 'http://localhost:3000';

export async function POST() {
  try {
    // Try to trigger real worker first
    try {
      const res = await fetch(`${WORKER_URL}/flush`, {
        method: 'POST',
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch {
      // Worker not available, simulate a batch flush
    }
    
    // Simulate a batch flush for demo purposes
    const submitted = Math.floor(Math.random() * 30) + 5;
    const accepted = Math.floor(submitted * 0.85);
    const rejected = Math.floor((submitted - accepted) * 0.6);
    const retry = submitted - accepted - rejected;
    const costPerVerification = Math.random() > 0.3 ? 2 : 10;
    
    return NextResponse.json({
      success: true,
      batch: {
        batchId: `sim-batch-${Date.now()}`,
        submitted,
        accepted,
        rejected,
        retry,
        estimatedCostCents: submitted * costPerVerification,
        timestamp: new Date().toISOString(),
      },
      message: 'Simulated batch flush (worker not connected)',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to trigger batch flush', details: String(error) },
      { status: 500 }
    );
  }
}
