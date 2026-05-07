export interface VerifiableCredential {
  id: string;
  type: string[];
  issuer: string;
  issuanceDate: string;
  credentialSubject: {
    residentStatus: string;
    verificationDate: string;
    dhaReference: string;
  };
}

export type CredentialStatus = "none" | "pending" | "verified" | "expired" | "revoked";

export interface CredentialState {
  status: CredentialStatus;
  credential?: VerifiableCredential;
  lastVerified?: string;
}

export interface CredentialActions {
  requestVerification: () => Promise<void>;
  presentCredential: (verifierId: string) => Promise<string>;
  checkStatus: () => Promise<CredentialStatus>;
}

export type Credentials = CredentialState & CredentialActions;

const STORAGE_KEY = "community_hub_credentials";

function loadFromStorage(): { credential?: VerifiableCredential; lastVerified?: string } | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function createCredentialStore(): Credentials {
  const stored = loadFromStorage();

  let status: CredentialStatus = stored?.credential ? "verified" : "none";
  let credential = stored?.credential;
  let lastVerified = stored?.lastVerified;

  return {
    get status() {
      return status;
    },
    get credential() {
      return credential;
    },
    get lastVerified() {
      return lastVerified;
    },

    async requestVerification(): Promise<void> {
      status = "pending";
      // TODO: wire to identity-worker queue endpoint when BFF available
      // const response = await fetch('/api/identity/verify', { method: 'POST' });
      // const result = await response.json();
      // if (result.credential) {
      //   credential = result.credential;
      //   lastVerified = new Date().toISOString();
      //   status = 'verified';
      //   saveToStorage({ credential, lastVerified });
      // }
    },

    async presentCredential(verifierId: string): Promise<string> {
      if (!credential) {
        throw new Error("No credential available");
      }
      // Create selective disclosure proof
      const proof = {
        type: "Proof2024",
        verifier: verifierId,
        credentialId: credential.id,
        presentedAt: new Date().toISOString(),
        disclosedClaims: ["residentStatus", "verificationDate"],
      };
      return btoa(JSON.stringify(proof));
    },

    async checkStatus(): Promise<CredentialStatus> {
      if (!credential) return "none";
      // TODO: wire to Identus VC status check when API available
      // const response = await fetch(`/api/identus/status/${credential.id}`);
      // const result = await response.json();
      // return result.status;
      return status;
    },
  };
}