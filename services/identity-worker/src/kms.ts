import { randomUUID } from "node:crypto";

import type { EncryptionResult, KMSConfig } from "./index.js";

export interface KMSClient {
  encrypt(plaintext: Uint8Array, keyVersion: string): Promise<Uint8Array>;
  decrypt(ciphertext: Uint8Array, keyVersion: string): Promise<Uint8Array>;
  wrapKey(dek: Uint8Array, keyVersion: string): Promise<Uint8Array>;
  unwrapKey(wrappedDek: Uint8Array, keyVersion: string): Promise<Uint8Array>;
  getCurrentKeyVersion(): string;
}

export interface EncryptionService {
  encrypt(plaintext: string): Promise<EncryptionResult>;
  decrypt(encryptedPayload: string, wrappedDek: string, keyVersion: string): Promise<string>;
}

export function createKMSClient(config: KMSConfig): KMSClient {
  const kmsClientImpl = config.region ? createAWSKMSClient(config) : createStubKMSClient(config);

  return {
    async encrypt(plaintext: Uint8Array, keyVersion: string): Promise<Uint8Array> {
      return kmsClientImpl.encrypt(plaintext, keyVersion);
    },
    async decrypt(ciphertext: Uint8Array, keyVersion: string): Promise<Uint8Array> {
      return kmsClientImpl.decrypt(ciphertext, keyVersion);
    },
    async wrapKey(dek: Uint8Array, keyVersion: string): Promise<Uint8Array> {
      return kmsClientImpl.wrapKey(dek, keyVersion);
    },
    async unwrapKey(wrappedDek: Uint8Array, keyVersion: string): Promise<Uint8Array> {
      return kmsClientImpl.unwrapKey(wrappedDek, keyVersion);
    },
    getCurrentKeyVersion(): string {
      return config.keyVersion;
    },
  };
}

function createAWSKMSClient(config: KMSConfig): KMSClient {
  return {
    async encrypt(_plaintext: Uint8Array, _keyVersion: string): Promise<Uint8Array> {
      throw new Error("AWS KMS encrypt not implemented - requires @aws-sdk/client-kms");
    },
    async decrypt(_ciphertext: Uint8Array, _keyVersion: string): Promise<Uint8Array> {
      throw new Error("AWS KMS decrypt not implemented - requires @aws-sdk/client-kms");
    },
    async wrapKey(_dek: Uint8Array, _keyVersion: string): Promise<Uint8Array> {
      throw new Error("AWS KMS wrapKey not implemented - requires @aws-sdk/client-kms");
    },
    async unwrapKey(_wrappedDek: Uint8Array, _keyVersion: string): Promise<Uint8Array> {
      throw new Error("AWS KMS unwrapKey not implemented - requires @aws-sdk/client-kms");
    },
    getCurrentKeyVersion(): string {
      return config.keyVersion;
    },
  };
}

function createStubKMSClient(config: KMSConfig): KMSClient {
  const stubKey = Buffer.from("stub-key-32-bytes-for-testing!").slice(0, 32);

  return {
    async encrypt(plaintext: Uint8Array, _keyVersion: string): Promise<Uint8Array> {
      const iv = randomUUID().replaceAll("-", "").slice(0, 16);
      const encrypted = Buffer.alloc(plaintext.length);
      for (let i = 0; i < plaintext.length; i++) {
        encrypted[i] = plaintext[i] ^ stubKey[i % stubKey.length];
      }
      return Buffer.concat([Buffer.from(iv, "utf8"), encrypted]);
    },
    async decrypt(ciphertext: Uint8Array, _keyVersion: string): Promise<Uint8Array> {
      const encrypted = ciphertext.slice(16);
      const decrypted = Buffer.alloc(encrypted.length);
      for (let i = 0; i < encrypted.length; i++) {
        decrypted[i] = encrypted[i] ^ stubKey[i % stubKey.length];
      }
      return decrypted;
    },
    async wrapKey(dek: Uint8Array, _keyVersion: string): Promise<Uint8Array> {
      const wrapped = Buffer.alloc(dek.length);
      for (let i = 0; i < dek.length; i++) {
        wrapped[i] = dek[i] ^ stubKey[i % stubKey.length];
      }
      return wrapped;
    },
    async unwrapKey(wrappedDek: Uint8Array, _keyVersion: string): Promise<Uint8Array> {
      const unwrapped = Buffer.alloc(wrappedDek.length);
      for (let i = 0; i < wrappedDek.length; i++) {
        unwrapped[i] = wrappedDek[i] ^ stubKey[i % stubKey.length];
      }
      return unwrapped;
    },
    getCurrentKeyVersion(): string {
      return config.keyVersion;
    },
  };
}

export function createEncryptionService(kmsClient: KMSClient): EncryptionService {
  return {
    async encrypt(plaintext: string): Promise<EncryptionResult> {
      const plaintextBytes = new TextEncoder().encode(plaintext);
      const dek = new Uint8Array(32);
      crypto.getRandomValues(dek);

      const wrappedDek = await kmsClient.wrapKey(dek, kmsClient.getCurrentKeyVersion());
      const ciphertext = Buffer.alloc(plaintextBytes.length);
      for (let i = 0; i < plaintextBytes.length; i++) {
        ciphertext[i] = plaintextBytes[i] ^ dek[i % dek.length];
      }

      return {
        ciphertext: ciphertext.toString("base64"),
        wrappedDek: Buffer.from(wrappedDek).toString("base64"),
        keyVersion: kmsClient.getCurrentKeyVersion(),
      };
    },
    async decrypt(
      encryptedPayload: string,
      wrappedDek: string,
      keyVersion: string,
    ): Promise<string> {
      const ciphertext = Uint8Array.from(Buffer.from(encryptedPayload, "base64"));
      const wrappedDekBytes = Uint8Array.from(Buffer.from(wrappedDek, "base64"));

      const dek = await kmsClient.unwrapKey(wrappedDekBytes, keyVersion);
      const plaintextBytes = Buffer.alloc(ciphertext.length);
      for (let i = 0; i < ciphertext.length; i++) {
        plaintextBytes[i] = ciphertext[i] ^ dek[i % dek.length];
      }

      return new TextDecoder().decode(plaintextBytes);
    },
  };
}

export interface KeyRotationResult {
  newKeyVersion: string;
  rewrappedCount: number;
}

export async function rotateKey(
  _kmsClient: KMSClient,
  _existingVersion: string,
): Promise<KeyRotationResult> {
  const newVersion = `v${Date.now()}`;
  return {
    newKeyVersion: newVersion,
    rewrappedCount: 0,
  };
}

export class KMSUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "KMSUnavailableError";
  }
}

export class DecryptFailureError extends Error {
  constructor(
    message: string,
    public readonly correlationId: string,
    public readonly keyVersion: string,
    public readonly auditEventId?: string,
  ) {
    super(message);
    this.name = "DecryptFailureError";
  }
}
