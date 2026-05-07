/**
 * Mobile DID creation for resident credential handoff.
 *
 * Creates `did:midnight` style DIDs on mobile for VC holder identity.
 * Integrates with wallet (P1.2) before VC issuance flow (P2.6).
 *
 * @see docs/adr/0003-lace-expo-metro-wallet-integration.md
 */

export interface HolderDID {
  id: string;
  verificationMethod: string;
  createdAt: string;
}

export interface DIDCreationOptions {
  keyId?: string;
}

export async function createHolderDID(options?: DIDCreationOptions): Promise<HolderDID> {
  const keyId = options?.keyId ?? "primary-key";
  const id = `did:midnight:${generateIdFragment()}`;

  return {
    id,
    verificationMethod: `${id}#${keyId}`,
    createdAt: new Date().toISOString(),
  };
}

export function isValidHolderDID(did: string): boolean {
  return did.startsWith("did:midnight:");
}

function generateIdFragment(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}