import { describe, it, expect } from "vitest";
import {
  verifyResidentProof,
  createVerificationRequest,
  isVerifiedResident,
} from "./verified_resident.compact.js";

function makeValidProof(vcId: string): string {
  return btoa(
    JSON.stringify({
      vcType: "ResidentCredential",
      issuer: "did:identus:abc123",
      subject: vcId,
      verificationDate: Date.now(),
      signature: "mock-signature",
    }),
  );
}

function makeInvalidProof(): string {
  return btoa(
    JSON.stringify({
      vcType: "InvalidType",
      issuer: "did:other:abc123",
      subject: "invalid",
      verificationDate: Date.now(),
      signature: "mock-signature",
    }),
  );
}

describe("verified_resident.compact", () => {
  describe("verifyResidentProof", () => {
    it("accepts valid resident credential proof", () => {
      const proof = makeValidProof("vc-123");
      const request = createVerificationRequest(proof, "pubkey-abc", 0n, "vc-123");
      const result = verifyResidentProof(request);

      expect(result.isValid).toBe(true);
      expect(result.residentStatus).toBe("verified");
      expect(result.rotationNonce).toBe(1n);
    });

    it("rejects proof with invalid VC type", () => {
      const proof = makeInvalidProof();
      const request = createVerificationRequest(proof, "pubkey-abc", 0n, "vc-123");
      const result = verifyResidentProof(request);

      expect(result.isValid).toBe(false);
      expect(result.residentStatus).toBe("unverified");
    });

    it("rejects proof with invalid issuer prefix", () => {
      const invalidProof = btoa(
        JSON.stringify({
          vcType: "ResidentCredential",
          issuer: "did:other:abc123",
          subject: "vc-123",
          verificationDate: Date.now(),
          signature: "mock",
        }),
      );
      const request = createVerificationRequest(invalidProof, "pubkey-abc", 0n, "vc-123");
      const result = verifyResidentProof(request);

      expect(result.isValid).toBe(false);
    });

    it("handles malformed proof gracefully", () => {
      const request = createVerificationRequest("not-valid-base64!", "pubkey-abc", 0n, "vc-123");
      const result = verifyResidentProof(request);

      expect(result.isValid).toBe(false);
      expect(result.residentStatus).toBe("unverified");
    });
  });

  describe("isVerifiedResident", () => {
    it("returns true for valid verified resident", () => {
      const proof = makeValidProof("vc-456");
      const request = createVerificationRequest(proof, "pubkey-xyz", 5n, "vc-456");
      const result = verifyResidentProof(request);

      expect(isVerifiedResident(result)).toBe(true);
    });

    it("returns false for invalid proof", () => {
      const proof = makeInvalidProof();
      const request = createVerificationRequest(proof, "pubkey-xyz", 5n, "vc-456");
      const result = verifyResidentProof(request);

      expect(isVerifiedResident(result)).toBe(false);
    });
  });

  describe("verification request creation", () => {
    it("creates correctly structured request", () => {
      const request = createVerificationRequest("proof-data", "pubkey", 10n, "vc-789");

      expect(request.proof).toBe("proof-data");
      expect(request.holderPublicKey).toBe("pubkey");
      expect(request.nonce).toBe(10n);
      expect(request.vcId).toBe("vc-789");
    });
  });
});