export interface AltronBatchItem {
  correlationId: string;
  ciphertext: string;
  createdAt: string;
}

export interface AltronBatchRequest {
  items: AltronBatchItem[];
  batchId?: string;
}

export interface AltronBatchResponse {
  batchId: string;
  results: Array<{
    correlationId: string;
    outcome: "accepted" | "rejected" | "retry";
    reason?: string;
  }>;
  submittedAt: string;
}

export interface AltronCredentials {
  apiUrl: string;
  apiKey: string;
}

export function getAltronCredentials(): AltronCredentials {
  return {
    apiUrl: process.env.ALTRON_API_URL ?? "",
    apiKey: process.env.ALTRON_API_KEY ?? "",
  };
}

export function isSandboxMode(creds: AltronCredentials): boolean {
  return !creds.apiKey;
}

export async function submitBatch(
  creds: AltronCredentials,
  items: AltronBatchItem[],
): Promise<AltronBatchResponse> {
  if (isSandboxMode(creds)) {
    return sandboxBatchResponse(items);
  }

  const response = await fetch(`${creds.apiUrl}/batch/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${creds.apiKey}`,
    },
    body: JSON.stringify({
      items: items.map((item) => ({
        correlationId: item.correlationId,
        payload: item.ciphertext,
        timestamp: item.createdAt,
      })),
    }),
  });

  if (!response.ok) {
    throw new Error(`Altron API error: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as {
    batchId: string;
    results: Array<{ correlationId: string; status: string; reason?: string }>;
  };

  return {
    batchId: data.batchId,
    results: data.results.map((r) => ({
      correlationId: r.correlationId,
      outcome: r.status as "accepted" | "rejected" | "retry",
      reason: r.reason,
    })),
    submittedAt: new Date().toISOString(),
  };
}

function sandboxBatchResponse(items: AltronBatchItem[]): AltronBatchResponse {
  return {
    batchId: `sandbox-${Date.now()}`,
    results: items.map((item) => {
      const mod = item.correlationId.charCodeAt(0) % 10;
      if (mod < 7) return { correlationId: item.correlationId, outcome: "accepted" as const };
      if (mod < 9) return { correlationId: item.correlationId, outcome: "retry" as const };
      return { correlationId: item.correlationId, outcome: "rejected" as const };
    }),
    submittedAt: new Date().toISOString(),
  };
}