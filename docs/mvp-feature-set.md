# MVP Feature Set — Core Surf Detection Capability

> Issue: INK-37 | Updated: 2026-05-07
> Status: **Proposal** — review and sign off before implementation

## Purpose

Define the exact minimum viable feature set for the SurfSpot discovery product's core surf detection capability. This is the smallest shippable unit that proves the engine works and delivers actionable intelligence.

## Guiding Principles

1. **Ship before perfect** — every feature listed here must be demonstrable end-to-end
2. **Seasonality first** — surf conditions are seasonal; the MVP must encode this correctly
3. **Human-in-the-loop** — AI narrows the search; humans make final judgment
4. **No satellite imagery in MVP** — imagery is a selective second-stage tool (per Wave Vault strategy)

## MVP Features

### F1. Spot Database with Seasonal Metadata
**Status: PARTIALLY BUILT** (surfspot-app engine room)

- [ ] Data model: `spot` record with fields:
  - `name`, `location` (lat/lng)
  - `optimal_season` (e.g. "May-Aug" for Jeffreys Bay)
  - `swell_direction` — seasonal optimal direction (e.g. "S-SW" for J-Bay)
  - `wind_pattern` — seasonal optimal wind (e.g. "offshore: NW, W")
  - `off_season_notes` — what happens outside peak season
  - `confidence` — how well-understood this spot is
- [ ] Seed dataset: minimum **20** surf spots across at least **3 geographic regions**
- [ ] Repository: `surfspot-app/packages/engine-room/src/data/spots/`

### F2. Swell/Wind Correlation Engine
**Status: NOT BUILT** — needs new implementation

- [ ] Core algorithm: given a spot and a date window, score the alignment of:
  - Historical swell direction vs spot's optimal swell direction
  - Historical wind direction vs spot's optimal wind direction
  - Current date vs spot's optimal season
- [ ] Output: `SurfScore { spot_id, date, swell_score, wind_score, seasonal_score, composite_score }`
- [ ] Data source: pull archived marine data from Open-Meteo or similar provider
- [ ] Repository: `surfspot-app/packages/engine-room/src/pipelines/`

### F3. Spot Discovery Pipeline
**Status: NOT BUILT** — needs new implementation

- [ ] Scan a coastline region and identify candidate spots
- [ ] For each candidate, compute seasonal surfability scores (uses F2)
- [ ] Rank candidates by composite score
- [ ] Output: ranked list of `Candidate { spot_id, score, rationale, evidence_links }`
- [ ] Minimum viable: run on **one test coastline** (e.g. Cape St Francis / Jeffreys Bay area)
- [ ] Repository: `surfspot-app/packages/engine-room/src/pipelines/`

### F4. Analyst Review Interface (Development Room)
**Status: NOT BUILT** — minimal internal UI

- [ ] Display ranked candidate list
- [ ] Show score breakdown (swell × wind × season)
- [ ] Allow analyst to: approve, reject, or flag for review
- [ ] Allow analyst to add manual notes
- [ ] Repository: `surfspot-app/apps/development-console/` or existing `discovery-console`

### F5. Dossier Export
**Status: NOT BUILT**

- [ ] Export approved candidates as a PDF or structured JSON dossier
- [ ] Dossier includes: spot info, score rationale, seasonal window, analyst notes
- [ ] Repository: `surfspot-app/packages/shared/`

### F6. Test & CI Gate
**Status: PARTIALLY BUILT** (Wave Vault CI exists)

- [ ] Unit tests for correlation engine (F2)
- [ ] Integration test: pipeline end-to-end on known test coastline
- [ ] Regression gate: scores must be deterministic for same inputs
- [ ] Repository: `surfspot-app/packages/engine-room/tests/`

## Explicitly Out of Scope (MVP)

| Feature | Why excluded |
|---------|-------------|
| Satellite imagery analysis | Second-stage tool; not needed for MVP scoring |
| Real-time surf forecasting | MVP is about discovery, not daily forecasts |
| Consumer mobile app | Enterprise platform; develop room / API first |
| Community hub features | Covered by J-Bay Catalyst project (INK-43) |
| Bathymetry modeling | Future research track |
| ML model training | Rule-based scoring is sufficient for MVP |

## Implementation Order

```
F1 (seeding) → F2 (engine) → F3 (pipeline) → F4 (review UI)
                              ↓
                          F5 (export) ← F3 produces candidates
                              ↓
                          F6 (tests) — gate everything
```

F1 and F6 are partially built — can be completed in parallel with F2.

## Dependencies

| ID | Dependency | Status |
|----|-----------|--------|
| D1 | Open-Meteo or alternative marine data API | Available (free tier) |
| D2 | Seed spot data (F1) | ~20 spots needed; partial data in engine room |
| D3 | Test coastline coordinates | Use Cape St Francis area (~34.15 to ~34.22, 24.80 to 24.88) |
| D4 | Dev room UI framework | Wave Vault dev-console exists |

## Success Criteria

The MVP is complete when an analyst can:
1. Run the pipeline on the Cape St Francis test coastline
2. See a ranked list of surfable spots with score breakdowns
3. Approve or reject each candidate with notes
4. Export the approved set as a dossier
5. Verify results are deterministic (same inputs → same scores)
