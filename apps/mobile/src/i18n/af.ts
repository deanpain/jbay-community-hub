/**
 * Afrikaans UI copy — ±60% coverage of en.ts keys.
 * For Phase 2 targets: fill remaining gaps per i18n roadmap.
 */

import type { HubTab } from "@jbay/shared";
import type { AppStrings } from "./en";

export const af: AppStrings = {
  hubTagline: "Onderwys · Ontspanning · Vermaak",
  tabs: {
    education: "Onderwys",
    recreation: "Ontspanning",
    entertainment: "Vermaak",
  } satisfies Record<HubTab, string>,
  backToListings: "← Lys",
  scheduleHeading: "Skedule",
  proofHeading: "Bewys & geloofsbriewe",
  detailStubNote:
    "Beskermde kettinglading en Lace-koppeling met Compact-bindings — hierdie skerm is 'n mock MLS teen gedeelde tipes.",
  emptyTab:
    "Nog geen lyste in hierdie oortjie nie — voeg saaddata by of aktiveer die oortjie in munisipaliteitskonfigurasie.",
  a11yBackToListings: "Terug na lyste",
  a11yOpenListing: "Maak lysbesonderhede oop",
  walletChipLabel: "Beursie",
  walletPlaceholderTitle: "Beursie-koppeling — piek in vordering",
  walletPlaceholderBody:
    "Lace is nog nie gekoppel nie. Volg docs/runbooks/lace-spike.md op hierdie masjien of in die repo, werk dan ADR 0003 by.",
  a11yWalletChip: "Beursie-koppelingstatus — integrasie hangende",
  listingAdd: "Voeg by",
  a11yAddListing: "Skep 'n nuwe plaaslike konseplys",
  draftBadge: "Plaaslike konsep",
  draftEditTitle: "Wysig konseplys",
  draftNewTitle: "Nuwe konseplys",
  draftFieldOrganisation: "Organisasie",
  draftFieldTitle: "Titel",
  draftFieldSummary: "Opsomming",
  draftFieldCategory: "Kategorie",
  draftOrgPlaceholder: "bv. Joshua-projek",
  draftTitlePlaceholder: "Kort aanbodtitel",
  draftSummaryPlaceholder: "Wat inwoners moet weet",
  draftDefaultOrganisation: "Gemeenskapskonsep",
  draftCancel: "Kanselleer",
  draftSave: "Stoor",
  draftEdit: "Wysig konsep",
  draftDelete: "Verwyder konsep",
  draftDeleteConfirmTitle: "Verwyder hierdie konsep?",
  draftDeleteConfirmMessage: "Dit verwyder die lyste slegs van hierdie toestel.",
  draftDeleteConfirmOk: "Verwyder",
  draftDeleteConfirmCancel: "Kanselleer",
} as const;
