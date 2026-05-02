/**
 * Shared domain types for the Community Hub template (pilot-agnostic).
 */
import { z } from "zod";

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

// --- Jeffreys Bay pilot seed (single file: Metro cannot resolve sibling `.js` re-exports from workspace packages)

const listingSeedSchema = z.object({
  id: z.string().min(1),
  category: z.enum(["education", "recreation", "entertainment"]),
  title: z.string().min(1),
  summary: z.string().min(1),
  partner: z.object({
    id: z.string().min(1),
    displayName: z.string().min(1),
  }),
  schedule: z.string().optional(),
  proofRequirements: z.string().optional(),
});

const pilotJeffreysBayListingSeed = [
  {
    id: "lst-edu-aet-jp",
    category: "education" as const,
    title: "Adult Education & Training (AET) modules",
    summary:
      "Foundational literacy and numeracy pathways aligned with local employability needs.",
    partner: { id: "joshua-project", displayName: "Joshua Project" },
    schedule: "Cohort intake quarterly — steward coordinates placement.",
    proofRequirements: "Verified resident credential or steward referral for onboarding.",
  },
  {
    id: "lst-edu-life-jp",
    category: "education" as const,
    title: "Life skills & readiness curriculum",
    summary: "Practical readiness tied to Work 4aLiving-style pathways and local mentors.",
    partner: { id: "joshua-project", displayName: "Joshua Project" },
    schedule: "Rolling workshops — see steward calendar.",
    proofRequirements: "Privacy-preserving skills attestations where programmes require them.",
  },
  {
    id: "lst-edu-ent-victory",
    category: "education" as const,
    title: "Entrepreneurship & leadership lab",
    summary: "Gap Year–adjacent entrepreneurship and leadership intensives (Victory collaborations).",
    partner: { id: "victory-gap-year", displayName: "Victory Gap Year" },
    schedule: "Term blocks — limited seats.",
    proofRequirements: "Programme-specific prerequisites issued privately to verified residents.",
  },
  {
    id: "lst-rec-surf-wp",
    category: "recreation" as const,
    title: "Surf mentorship & leadership sessions",
    summary: "Wave Point and Christian Surfers–aligned surf leadership with safeguarding norms.",
    partner: { id: "wave-point", displayName: "Wave Point Foundation" },
    schedule: "Seasonal — morning slots and holiday intensives.",
    proofRequirements: "Water safety attestation where required; steward waiver flow.",
  },
  {
    id: "lst-rec-csalt",
    category: "recreation" as const,
    title: "Graduate pilot cohort — recreation pathway",
    summary: "CSALT graduate cohort contacts and consent-first onboarding to recreation offers.",
    partner: { id: "christian-surfers-sa", displayName: "Christian Surfers SA" },
    schedule: "Pilot cohort only — coordinator assigns slots.",
    proofRequirements: "Consent + verified resident gate before roster release.",
  },
  {
    id: "lst-rec-garden-wp",
    category: "recreation" as const,
    title: "Community gardens volunteering",
    summary: "Agricultural and gardens volunteering referencing Wave Point Gardens programmes.",
    partner: { id: "wave-point", displayName: "Wave Point Foundation" },
    schedule: "Weekly volunteer blocks.",
    proofRequirements: "Standard steward check-in; optional resident credential for subsidies.",
  },
  {
    id: "lst-ent-youth-victory",
    category: "entertainment" as const,
    title: "Youth cultural events & ticketing coordination",
    summary: "Frontline youth events with privacy-preserving attendance proofs when required.",
    partner: { id: "victory-frontline", displayName: "Victory Frontline Youth" },
    schedule: "Event calendar published per season.",
    proofRequirements: "Age-tier attestations held privately; treasury subsidies follow governance.",
  },
  {
    id: "lst-edu-faith-network",
    category: "education" as const,
    title: "Faith network education & comms channel",
    summary:
      "Shared education and communications listings across Jeffreys Bay Bible Church, Methodist, Catholic, Adventist, and peer congregations.",
    partner: { id: "faith-network-jbay", displayName: "Jeffreys Bay faith network" },
    schedule: "Parish bulletin sync — no universal cadence.",
    proofRequirements: "Optional: steward vouch; no bespoke schema until programmes demand it.",
  },
] as const;

/** Validated pilot rows — see `docs/partners/listing-taxonomy.md`. */
export const pilotJeffreysBayListings: Listing[] = z
  .array(listingSeedSchema)
  .parse(pilotJeffreysBayListingSeed);
