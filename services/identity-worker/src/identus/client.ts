import { z } from "zod";

export const holderDIDSchema = z.object({
  method: z.literal("midnight"),
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
});

export type HolderDID = z.infer<typeof holderDIDSchema>;

export const credentialClaimsSchema = z.object({
  residentStatus: z.literal("verified"),
  verificationDate: z.string().datetime(),
  dhaReference: z.string().uuid(),
});

export type CredentialClaims = z.infer<typeof credentialClaimsSchema>;

export const vcResultSchema = z.object({
  vcId: z.string().uuid(),
  status: z.enum(["issued", "pending", "failed"]),
  issuedAt: z.string().datetime(),
});

export type VCResult = z.infer<typeof vcResultSchema>;

export const vcStatusSchema = z.object({
  vcId: z.string().uuid(),
  status: z.enum(["active", "revoked", "expired"]),
  holderDID: z.string(),
});

export type VCStatus = z.infer<typeof vcStatusSchema>;

export interface IdentusClient {
  createHolderDID(): Promise<HolderDID>;
  issueCredential(holderDID: HolderDID, claims: CredentialClaims): Promise<VCResult>;
  checkStatus(vcId: string): Promise<VCStatus>;
}

export function createIdentusClient(_apiUrl: string, _apiKey: string): IdentusClient {
  return {
    async createHolderDID(): Promise<HolderDID> {
      throw new Error("Identus client not wired: set IDENTUS_API_URL + IDENTUS_API_KEY");
    },
    async issueCredential(_holderDID: HolderDID, _claims: CredentialClaims): Promise<VCResult> {
      throw new Error("Identus client not wired: set IDENTUS_API_URL + IDENTUS_API_KEY");
    },
    async checkStatus(_vcId: string): Promise<VCStatus> {
      throw new Error("Identus client not wired: set IDENTUS_API_URL + IDENTUS_API_KEY");
    },
  };
}

export function createStubIdentusClient(): IdentusClient {
  let counter = 0;
  return {
    async createHolderDID(): Promise<HolderDID> {
      counter += 1;
      return {
        method: "midnight",
        id: `00000000-0000-0000-0000-${String(counter).padStart(12, "0")}`,
        createdAt: new Date().toISOString(),
      };
    },
    async issueCredential(_holderDID: HolderDID, claims: CredentialClaims): Promise<VCResult> {
      counter += 1;
      return {
        vcId: `11111111-1111-1111-1111-${String(counter).padStart(12, "0")}`,
        status: "issued",
        issuedAt: claims.verificationDate,
      };
    },
    async checkStatus(vcId: string): Promise<VCStatus> {
      return {
        vcId,
        status: "active",
        holderDID: "stub-holder",
      };
    },
  };
}