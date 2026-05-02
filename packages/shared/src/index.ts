/**
 * Shared domain types for the Community Hub template (pilot-agnostic).
 */

export type HubTab = "education" | "recreation" | "entertainment";

export type ListingCategory = HubTab;

export interface MunicipalityConfigRef {
  readonly id: string;
  readonly displayName: string;
}

export interface ListingDraft {
  readonly category: ListingCategory;
  readonly title: string;
  readonly summary: string;
}

export function assertNever(x: never): never {
  throw new Error(`Unexpected object: ${String(x)}`);
}
