/**
 * English UI copy baseline (Phase 1). Afrikaans / Xhosa: add locales + switch later.
 */

import type { HubTab } from "@jbay/shared";

export const en = {
  hubTagline: "Education · Recreation · Entertainment",
  tabs: {
    education: "Education",
    recreation: "Recreation",
    entertainment: "Entertainment",
  } satisfies Record<HubTab, string>,
  backToListings: "← Listings",
  scheduleHeading: "Schedule",
  proofHeading: "Proof & credentials",
  detailStubNote:
    "Shielded on-chain payloads and Lace connect land with Compact bindings — this screen is mock MLS against shared types.",
  emptyTab:
    "No listings in this tab yet — add seed data or enable the tab in municipality config.",
  a11yBackToListings: "Back to listings",
  a11yOpenListing: "Opens listing details",
} as const;
