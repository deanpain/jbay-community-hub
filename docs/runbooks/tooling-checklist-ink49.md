# Tooling Checklist — INK-49

> Workstream: GitNexus, Midnight Compact CI  
> Issue: INK-49  
> Status: In Progress  
> Owner: CEO (0a6cd8c2-7046-4b94-bb37-6055693035c0)

---

## 1. GitNexus — Keep `npx gitnexus analyze` green

**Current State:** GitNexus indexed (73591 symbols, 125379 relationships per AGENTS.md)

**Checklist:**
- [ ] Run `npx gitnexus analyze` after each major merge
- [ ] Verify exit code 0 and no stale index warnings
- [ ] If index is stale, run `npx gitnexus analyze` before committing
- [ ] Document GitNexus as required step in PR template (`.github/pull_request_template.md`)

**Evidence:** GitNexus MCP tools available in session — index status checkable via `gitnexus_list_repos`

---

## 2. Midnight Compact Test Runner

**Current State:** `contracts/scripts/test-placeholder.mjs` exits 0 (keeps CI green)

**Checklist:**
- [ ] Monitor Midnight Compact CLI release (https://github.com/NightAPI/midnight-compact)
- [ ] When toolchain is pinned (version stable), swap placeholder:
  - Replace `test-placeholder.mjs` with real test runner
  - Update `contracts/package.json` scripts.test
  - Verify `pnpm test` runs Compact tests
- [ ] Update CI workflow (`.github/workflows/`) to invoke Compact test runner
- [ ] Document Compact test setup in `contracts/README.md`

**Blocked on:** Midnight Compact toolchain stabilization

---

## 3. Bulletin Board Template Divergence Tracking

**ADR:** `docs/adr/0002-bulletin-board-lineage.md`  
**Current State:** ADR accepted (scaffold phase 2026-05-02)

**Checklist:**
- [x] ADR 0002 filed — decision to track Bulletin Board as scaffold
- [ ] Maintain `contracts/templates/README.md` with upstream provenance:
  - Upstream repo: Midnight DevRel Bulletin Board reference
  - Last sync date
  - Divergence log (governance hooks, treasury subsidies added)
- [ ] Update `NOTICE` file with Midnight Bulletin Board licensing
- [ ] Periodic reconciliation (quarterly):
  - Check Midnight DevRel template for updates
  - Document divergence in ADR 0002 appendix
  - File issues for any marketplace-specific mechanics split

**Evidence:** `contracts/templates/README.md` exists (775 bytes) — needs provenance header added.

---

## Next Steps

1. **Now:** Add provenance header to `contracts/templates/README.md`
2. **CI:** Add GitNexus analyze to PR template
3. **When unblocked:** Swap test placeholder for real Compact runner

---

*Last updated: 2026-05-07 by CEO*
