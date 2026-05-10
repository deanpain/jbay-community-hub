# SurfSpot Execution-Ready Plan
*Based on MVP Feature Set (INK-37) and research findings*
*Issue: INK-31 | Date: 2026-05-08*

## Executive Summary
Deliver MVP SurfSpot discovery engine with 6 core features (F1-F6) across 4 phases, targeting Cape St Francis test coastline. Estimated 12-week timeline, 3 dependent streams.

## Phases & Milestones
### Phase 1: Foundation (Weeks 1-3)
**Goal**: Complete seed dataset and CI gates
- **Milestone 1.1**: F1 (Spot Database) complete - 20+ spots across 3 regions (Week 2)
  - Tasks: Complete data model, seed 20 spots (Cape St Francis, J-Bay, 1 other region), validate coordinates
  - Owner: CEO (Data Team)
  - Dependencies: D2 (Seed spot data) - partial available in engine-room
- **Milestone 1.2**: F6 (Test & CI Gate) partial - unit tests for F1 (Week 3)
  - Tasks: Write unit tests for spot data model, set up CI regression gate
  - Owner: CTO - Codex Partner (Engineering)
  - Dependencies: D1 (Open-Meteo API) - available

### Phase 2: Core Engine (Weeks 4-6)
**Goal**: Build swell/wind correlation engine
- **Milestone 2.1**: F2 (Swell/Wind Correlation Engine) complete (Week 5)
  - Tasks: Implement scoring algorithm, integrate Open-Meteo marine data, output SurfScore
  - Owner: CTO - Codex Partner (Engineering)
  - Dependencies: D1 (Open-Meteo API), Phase 1 complete
- **Milestone 2.2**: F6 tests extended for F2 (Week 6)
  - Tasks: Unit/integration tests for correlation engine, deterministic score verification
  - Owner: CTO - Codex Partner (Engineering)

### Phase 3: Pipeline & UI (Weeks 7-9)
**Goal**: Build discovery pipeline and analyst review interface
- **Milestone 3.1**: F3 (Spot Discovery Pipeline) complete (Week 8)
  - Tasks: Implement coastline scanning, candidate ranking, run on Cape St Francis test area
  - Owner: CEO (Data Team) + CTO - Codex Partner (Engineering)
  - Dependencies: F2 complete, D3 (Test coastline coordinates) - available
- **Milestone 3.2**: F4 (Analyst Review Interface) complete (Week 9)
  - Tasks: Build minimal UI for candidate listing, scoring breakdown, approval/rejection workflow
  - Owner: CTO - Codex Partner (Engineering)
  - Dependencies: F3 complete, D4 (Dev room UI framework) - Wave Vault dev-console exists

### Phase 4: Export & Hardening (Weeks 10-12)
**Goal**: Finalize export, full CI, and MVP ship
- **Milestone 4.1**: F5 (Dossier Export) complete (Week 10)
  - Tasks: Implement PDF/JSON export for approved candidates, include score rationale and notes
  - Owner: CTO - Codex Partner (Engineering)
  - Dependencies: F3, F4 complete
- **Milestone 4.2**: Full F6 CI gate (Week 11)
  - Tasks: End-to-end pipeline test, regression gate for all features, deterministic output verification
  - Owner: CTO - Codex Partner (Engineering)
- **Milestone 4.3**: MVP Ship (Week 12)
  - Tasks: Run pipeline on Cape St Francis, export dossier, analyst sign-off
  - Owner: CEO (Product) + CTO - Codex Partner (Engineering)
  - Success Criteria: Analyst can run pipeline, see ranked list, approve/reject, export dossier, verify deterministic results

## Risks & Mitigation
| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Open-Meteo API rate limits | High | Medium | Cache marine data, use free tier limits, fallback to archived data |
| Seed spot data insufficient (<20 spots) | Medium | Low | Scrape public surf databases, use Google Earth Pro for validation |
| Correlation engine scoring inaccurate | High | Medium | Human-in-the-loop review (F4), adjust weights iteratively |
| UI framework integration issues | Medium | Low | Use existing Wave Vault dev-console as base, minimal custom code |
| Test coastline coordinates invalid | Low | Low | Use verified Cape St Francis bounds (-34.22 to -34.15, 24.80 to 24.88) |

## Owners
- **Product/Data**: CEO (Major) - INK-31 assignee
- **Engineering**: CTO - Codex Partner (opencode_local)
- **Analyst Review**: Dean Payne (Human)

## Dependencies
| ID | Dependency | Status | Owner |
|----|-----------|--------|-------|
| D1 | Open-Meteo Marine API | Available (free tier) | N/A |
| D2 | Seed spot data (20+ spots, 3 regions) | Partial (engine-room has some) | CEO |
| D3 | Test coastline coordinates (Cape St Francis) | Available (verified bounds) | N/A |
| D4 | Dev room UI framework | Available (Wave Vault dev-console) | CTO |
| D5 | Google Earth Pro access (for validation) | Available (user preference) | Dean |

## Success Criteria
1. Pipeline runs on Cape St Francis test coastline end-to-end
2. Ranked candidate list with swell/wind/season score breakdowns
3. Analyst can approve/reject candidates with notes via F4 UI
4. Approved candidates exportable as PDF/JSON dossier
5. All scoring results deterministic (same inputs = same outputs)
6. CI regression gate passes for all features

## Out of Scope (MVP)
- Satellite imagery analysis (second-stage tool)
- Real-time surf forecasting (discovery only)
- Consumer mobile app (enterprise first)
- Community hub features (covered by J-Bay Catalyst project INK-43)
- Bathymetry modeling (future research)
- ML model training (rule-based sufficient for MVP)

## Verification
```bash
# After clone / in workspace:
pnpm -r lint --if-present 2>/dev/null || npm run lint 2>/dev/null || true
pnpm -r test --if-present 2>/dev/null || npm test 2>/dev/null || true
```

## Evidence Links
- MVP Feature Set: `/docs/mvp-feature-set.md` (INK-37)
- Project Repository: https://github.com/deanpain/jbay-community-hub
- Workspace: `/Users/mac/Documents/InkPixel/AI Projects/projects/jbay_community`
