import {
  verifyResidentProof,
  createVerificationRequest,
  isVerifiedResident,
  VerificationRequest,
} from '../compact/verified_resident.compact';

describe('VerifiedResident Contract', () => {
  const mockPublicKey = '0x1234567890abcdef';
  const mockVcId = 'vc:identus:resident:12345';

  describe('createVerificationRequest', () => {
    it('should create a valid verification request', () => {
      const proof = btoa(JSON.stringify({
        vcType: 'ResidentCredential',
        issuer: 'did:identus:issuer123',
        subject: 'did:identus:subject123',
        verificationDate: Date.now(),
        signature: 'mockSignature',
      }));

      const nonce = BigInt(100);
      const request = createVerificationRequest(proof, mockPublicKey, nonce, mockVcId);

      expect(request.proof).toBe(proof);
      expect(request.holderPublicKey).toBe(mockPublicKey);
      expect(request.nonce).toBe(nonce);
      expect(request.vcId).toBe(mockVcId);
    });
  });

  describe('verifyResidentProof', () => {
    it('should return valid result for correct proof', () => {
      const validProof = btoa(JSON.stringify({
        vcType: 'ResidentCredential',
        issuer: 'did:identus:valid_issuer',
        subject: 'did:identus:subject123',
        verificationDate: Date.now(),
        signature: 'validSignature',
      }));

      const request: VerificationRequest = {
        proof: validProof,
        holderPublicKey: mockPublicKey,
        nonce: BigInt(1),
        vcId: mockVcId,
      };

      const result = verifyResidentProof(request);

      expect(result.isValid).toBe(true);
      expect(result.residentStatus).toBe('verified');
      expect(result.rotationNonce).toBe(BigInt(2)); // nonce + 1
    });

    it('should return invalid for wrong vcType', () => {
      const invalidProof = btoa(JSON.stringify({
        vcType: 'NotResidentCredential',
        issuer: 'did:identus:valid_issuer',
        subject: 'did:identus:subject123',
        verificationDate: Date.now(),
        signature: 'validSignature',
      }));

      const request: VerificationRequest = {
        proof: invalidProof,
        holderPublicKey: mockPublicKey,
        nonce: BigInt(1),
        vcId: mockVcId,
      };

      const result = verifyResidentProof(request);

      expect(result.isValid).toBe(false);
      expect(result.residentStatus).toBe('unverified');
    });

    it('should return invalid for wrong issuer prefix', () => {
      const invalidProof = btoa(JSON.stringify({
        vcType: 'ResidentCredential',
        issuer: 'did:other:invalid_issuer',
        subject: 'did:identus:subject123',
        verificationDate: Date.now(),
        signature: 'validSignature',
      }));

      const request: VerificationRequest = {
        proof: invalidProof,
        holderPublicKey: mockPublicKey,
        nonce: BigInt(1),
        vcId: mockVcId,
      };

      const result = verifyResidentProof(request);

      expect(result.isValid).toBe(false);
      expect(result.residentStatus).toBe('unverified');
    });

    it('should return invalid for malformed proof', () => {
      const request: VerificationRequest = {
        proof: 'invalid_base64===',
        holderPublicKey: mockPublicKey,
        nonce: BigInt(1),
        vcId: mockVcId,
      };

      const result = verifyResidentProof(request);

      expect(result.isValid).toBe(false);
      expect(result.residentStatus).toBe('unverified');
    });
  });

  describe('isVerifiedResident', () => {
    it('should return true for verified result', () => {
      const result = {
        isValid: true,
        residentStatus: 'verified' as const,
        verificationTimestamp: BigInt(Date.now()),
        rotationNonce: BigInt(2),
      };

      expect(isVerifiedResident(result)).toBe(true);
    });

    it('should return false for unverified result', () => {
      const result = {
        isValid: false,
        residentStatus: 'unverified' as const,
        verificationTimestamp: BigInt(Date.now()),
        rotationNonce: BigInt(1),
      };

      expect(isVerifiedResident(result)).toBe(false);
    });
  });
});
