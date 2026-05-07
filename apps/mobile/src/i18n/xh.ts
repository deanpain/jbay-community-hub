/**
 * Xhosa (isiXhosa) UI copy — stub coverage for Phase 1 (10+ keys, >20%).
 * Expand toward full coverage in Phase 2 per i18n roadmap.
 */

import type { HubTab } from "@jbay/shared";
import type { AppStrings } from "./en";

export const xh: AppStrings = {
  hubTagline: "Imfundo · Ukonwaba · Ulonwabo",
  tabs: {
    education: "Imfundo",
    recreation: "Ukonwaba",
    entertainment: "Ulonwabo",
  } satisfies Record<HubTab, string>,
  backToListings: "← Uluhlu",
  scheduleHeading: "IShedyuli",
  proofHeading: "Ubungqina & iziqinisekiso",
  detailStubNote:
    "I-payloads ekhuselweyo kunye noqhagamshelo lweLace oluneCompact bindings — esi sikrini sisikhombisi MLS ngokuchasene neentlobo ekwabelwana ngazo.",
  emptyTab:
    "Akukho luhlu kolu phepha okwangoku — yongeza idatha okanye yenza isithwebu sikwamkele ukusebenza kumiselo kamasipala.",
  a11yBackToListings: "Buyela kuluhlu",
  a11yOpenListing: "Vula iinkcukacha zoluhlu",
  walletChipLabel: "Isipaji",
  walletPlaceholderTitle: "Uqhagamshelo lwesipaji — i-spike iyaqhubeka",
  walletPlaceholderBody:
    "ILace ayikaqhagamshelwa. Landela docs/runbooks/lace-spike.md kulo matshini okanye kwi-repo, emva koko uhlaziye i-ADR 0003.",
  a11yWalletChip: "Isimo soqhagamshelo lwesipaji — indibaniso isalindile",
  listingAdd: "Yongeza",
  a11yAddListing: "Yenza idrafti entsha yoluhlu lwasekhaya",
  draftBadge: "Idrafti yasekhaya",
  draftEditTitle: "Hlela idrafti yoluhlu",
  draftNewTitle: "Idrafti entsha yoluhlu",
  draftFieldOrganisation: "Umbutho",
  draftFieldTitle: "Isihloko",
  draftFieldSummary: "Isishwankathelo",
  draftFieldCategory: "Udidi",
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
} satisfies Omit<AppStrings, never>;
