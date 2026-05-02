/**
 * Read-only pilot listings — mirrors partner-informed shapes in
 * `docs/partners/listing-taxonomy.md`. Replace or template per deployment.
 */
import type { Listing } from "@jbay/shared";
import { z } from "zod";

const partnerSchema = z.object({
  id: z.string().min(1),
  displayName: z.string().min(1),
});

const listingSchema = z.object({
  id: z.string().min(1),
  category: z.enum(["education", "recreation", "entertainment"]),
  title: z.string().min(1),
  summary: z.string().min(1),
  partner: partnerSchema,
  schedule: z.string().optional(),
  proofRequirements: z.string().optional(),
});

const rawListings = [
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

export const pilotJeffreysBayListings: Listing[] = z.array(listingSchema).parse(rawListings);
