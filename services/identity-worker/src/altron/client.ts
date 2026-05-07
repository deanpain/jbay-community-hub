import { z } from "zod";

export const altronBatchItemSchema = z.object({
  correlationId: z.string().uuid(),
  encryptedPayload: z.string().min(1),
  keyVersion: z.string(),
});

export type AltronBatchItem = z.infer<typeof altronBatchItemSchema>;

export const batchVerificationRequestSchema = z.object({
  items: z.array(altronBatchItemSchema),
  batchId: z.string().uuid(),
  submittedAt: z.string().datetime(),
});

export type BatchVerificationRequest = z.infer<typeof batchVerificationRequestSchema>;

export const altronResultSchema = z.object({
  correlationId: z.string().uuid(),
  status: z.enum(["accepted", "rejected", "retry"]),
  dhaRef: z.string().optional(),
});

export type AltronResult = z.infer<typeof altronResultSchema>;

export const batchVerificationResponseSchema = z.object({
  batchId: z.string().uuid(),
  results: z.array(altronResultSchema),
  processedAt: z.string().datetime(),
});

export type BatchVerificationResponse = z.infer<typeof batchVerificationResponseSchema>;

export interface AltronClient {
  submitBatch(request: BatchVerificationRequest): Promise<BatchVerificationResponse>;
  checkHealth(): Promise<boolean>;
}

export function createAltronClient(apiUrl: string, apiKey: string): AltronClient {
  if (!apiKey || apiKey === "<sandbox-key>") {
    return createStubAltronClient();
  }

  return {
    async submitBatch(request: BatchVerificationRequest): Promise<BatchVerificationResponse> {
      const response = await fetch(`${apiUrl}/batch/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Altron API error: ${response.status}`);
      }

      const data = await response.json();
      return batchVerificationResponseSchema.parse(data);
    },
    async checkHealth(): Promise<boolean> {
      const response = await fetch(`${apiUrl}/health`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      return response.ok;
    },
  };
}

export function createStubAltronClient(): AltronClient {
  return {
    async submitBatch(request: BatchVerificationRequest): Promise<BatchVerificationResponse> {
      const results = request.items.map((item) => {
        const hash = item.correlationId.charCodeAt(0) % 10;
        if (hash < 7) {
          return {
            correlationId: item.correlationId,
            status: "accepted" as const,
            dhaRef: `DHA-${item.correlationId.slice(0, 8)}`,
          };
        } else if (hash < 9) {
          return {
            correlationId: item.correlationId,
            status: "retry" as const,
          };
        }
        return {
          correlationId: item.correlationId,
          status: "rejected" as const,
        };
      });

      return {
        batchId: request.batchId,
        results,
        processedAt: new Date().toISOString(),
      };
    },
    async checkHealth(): Promise<boolean> {
      return true;
    },
  };
}