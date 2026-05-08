import { NextResponse } from 'next/server';

const WORKER_URL = process.env.IDENTITY_WORKER_URL || 'http://localhost:3000';

export async function GET() {
  try {
    const res = await fetch(`${WORKER_URL}/metrics`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch worker metrics', details: String(error) },
      { status: 500 }
    );
  }
}
