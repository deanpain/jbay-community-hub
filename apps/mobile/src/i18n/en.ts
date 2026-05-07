/**
 * English UI copy baseline (Phase 1). Afrikaans / Xhosa: add locales + switch later.
 */

import type { HubTab } from "@jbay/shared";

export interface AppStrings {
  hubTagline: string;
  tabs: Record<HubTab, string>;
  backToListings: string;
  scheduleHeading: string;
  proofHeading: string;
  detailStubNote: string;
  emptyTab: string;
  a11yBackToListings: string;
  a11yOpenListing: string;
  walletChipLabel: string;
  walletPlaceholderTitle: string;
  walletPlaceholderBody: string;
  a11yWalletChip: string;
  listingAdd: string;
  a11yAddListing: string;
  draftBadge: string;
  draftEditTitle: string;
  draftNewTitle: string;
  draftFieldOrganisation: string;
  draftFieldTitle: string;
  draftFieldSummary: string;
  draftFieldCategory: string;
  draftOrgPlaceholder: string;
  draftTitlePlaceholder: string;
  draftSummaryPlaceholder: string;
  draftDefaultOrganisation: string;
  draftCancel: string;
  draftSave: string;
  draftEdit: string;
  draftDelete: string;
  draftDeleteConfirmTitle: string;
  draftDeleteConfirmMessage: string;
  draftDeleteConfirmOk: string;
  draftDeleteConfirmCancel: string;
}

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
  walletChipLabel: "Wallet",
  walletPlaceholderTitle: "Wallet connect — spike in progress",
  walletPlaceholderBody:
    "Lace is not wired yet. Follow docs/runbooks/lace-spike.md on this machine or in the repo, then update ADR 0003.",
  a11yWalletChip: "Wallet connection status — integration pending",
  listingAdd: "Add",
  a11yAddListing: "Create a new local draft listing",
  draftBadge: "Local draft",
  draftEditTitle: "Edit draft listing",
  draftNewTitle: "New draft listing",
  draftFieldOrganisation: "Organisation",
  draftFieldTitle: "Title",
  draftFieldSummary: "Summary",
  draftFieldCategory: "Category",
  draftOrgPlaceholder: "e.g. Joshua Project",
  draftTitlePlaceholder: "Short offer title",
  draftSummaryPlaceholder: "What residents should know",
  draftDefaultOrganisation: "Community draft",
  draftCancel: "Cancel",
  draftSave: "Save",
  draftEdit: "Edit draft",
  draftDelete: "Delete draft",
  draftDeleteConfirmTitle: "Delete this draft?",
  draftDeleteConfirmMessage: "This removes the listing from this device only.",
  draftDeleteConfirmOk: "Delete",
  draftDeleteConfirmCancel: "Cancel",
} as const;
