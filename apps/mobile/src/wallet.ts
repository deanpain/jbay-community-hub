/**
 * Wallet state management for the Community Hub.
 *
 * This is a ready-state layer — actual Lace/mesh integration wires in after the
 * development build migration (per lace-spike.md). Callers use this interface
 * without knowing the underlying wallet SDK.
 */

export type WalletStatus = "disconnected" | "connecting" | "connected";

export interface WalletState {
  status: WalletStatus;
  address?: string;
  networkId?: number;
}

export interface WalletActions {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export type Wallet = WalletState & WalletActions;

/**
 * Creates a no-op wallet implementation for early development.
 *
 * Replace with real wallet SDK (Mesh/CIP-30) after development build migration.
 *
 * @see docs/runbooks/lace-spike.md
 * @see docs/adr/0003-lace-expo-metro-wallet-integration.md
 */
export function createStubsWallet(): Wallet {
  return {
    status: "disconnected",
    connect: async () => {
      throw new Error("Wallet not wired — development build migration pending");
    },
    disconnect: async () => {
      // no-op for stub
    },
  };
}