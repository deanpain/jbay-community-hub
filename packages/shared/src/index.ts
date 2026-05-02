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

/** Steward organisation referenced from partner taxonomy (`docs/partners/listing-taxonomy.md`). */
export interface PartnerRef {
  readonly id: string;
  readonly displayName: string;
}

/** MLS row aligned with `contracts/compact/listings.compact.stub` — app layer until Compact binds. */
export interface Listing extends ListingDraft {
  readonly id: string;
  readonly partner: PartnerRef;
  readonly schedule?: string;
  readonly proofRequirements?: string;
}

export function listingsForCategory(
  listings: readonly Listing[],
  category: ListingCategory,
): Listing[] {
  return listings.filter((l) => l.category === category);
}

export function assertNever(x: never): never {
  throw new Error(`Unexpected object: ${String(x)}`);
}
