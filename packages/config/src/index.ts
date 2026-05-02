import { z } from "zod";

export { pilotJeffreysBayListings } from "./listings-seed.js";

const municipalitySchema = z.object({
  id: z.string().min(1),
  displayName: z.string().min(1),
  region: z.object({
    country: z.string().length(2),
    municipality: z.string().optional(),
    notes: z.string().optional(),
  }),
  tabs: z.object({
    education: z.object({ enabled: z.boolean() }),
    recreation: z.object({ enabled: z.boolean() }),
    entertainment: z.object({ enabled: z.boolean() }),
  }),
});

export type MunicipalityConfig = z.infer<typeof municipalitySchema>;

export function parseMunicipalityConfig(input: unknown): MunicipalityConfig {
  return municipalitySchema.parse(input);
}

/** Mirrors `deployments/jbay.sample.json` for RN-safe consumption without JSON import attributes. */
const jbayPilotSeed = {
  id: "jbay-pilot",
  displayName: "J-Bay Community Hub",
  region: {
    country: "ZA",
    municipality: "Kouga Local Municipality",
    notes: "Pilot configuration — replace with template variables per deployment.",
  },
  tabs: {
    education: { enabled: true },
    recreation: { enabled: true },
    entertainment: { enabled: true },
  },
} as const;

export const pilotJeffreysBaySample = parseMunicipalityConfig(jbayPilotSeed);
