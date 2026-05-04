import { describe, expect, it } from "vitest";

import { listingsForCategory, pilotJeffreysBayListings } from "./index.js";

describe("listingsForCategory", () => {
  it("filters pilot seed by tab", () => {
    const edu = listingsForCategory(pilotJeffreysBayListings, "education");
    expect(edu.length).toBeGreaterThan(0);
    expect(edu.every((l) => l.category === "education")).toBe(true);
  });

  it("returns empty when no listings match", () => {
    const none = listingsForCategory([], "entertainment");
    expect(none).toEqual([]);
  });
});
