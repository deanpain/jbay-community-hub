import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Listing } from "@jbay/shared";

const STORAGE_KEY = "jbay_hub_listing_drafts_v1";

function isDraftListing(x: unknown): x is Listing {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  const cat = o.category;
  const catOk =
    cat === "education" || cat === "recreation" || cat === "entertainment";
  if (!catOk) return false;
  if (typeof o.id !== "string" || !o.id.startsWith("draft_")) return false;
  if (o.source !== "draft") return false;
  if (typeof o.title !== "string" || typeof o.summary !== "string") return false;
  const p = o.partner;
  if (!p || typeof p !== "object") return false;
  const pr = p as Record<string, unknown>;
  if (typeof pr.id !== "string" || typeof pr.displayName !== "string") return false;
  return true;
}

export async function loadDraftListings(): Promise<Listing[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isDraftListing) as Listing[];
  } catch {
    return [];
  }
}

export async function saveDraftListings(listings: readonly Listing[]): Promise<void> {
  const only = listings.filter((l) => l.source === "draft");
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(only));
}
