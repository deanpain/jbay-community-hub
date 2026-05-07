# Security Audit Scope — INK-69

## Audit Scope

### In Scope

| Component | Audit Focus |
|-----------|-------------|
| `apps/mobile` | Wallet credential storage, local storage encryption, no PII logging, secure IPC to wallet |
| `services/api` | Input validation, rate limiting readiness, auth middleware when added, secure headers |
| `services/identity-worker` | Encryption handling, batch processing security, environment variable protection, no PHI leakage |
| CI/CD (`.github/workflows/`) | Secret handling, dependency freeze, build artifact integrity |
| Dependencies | Known CVEs in direct deps (`zod`, `tsx`, `vitest`, `expo`, etc.) |

### Out of Scope (per SECURITY.md)

- Third-party services: Midnight, Lace, Altron, DHA, Identus, Midnames
- External infrastructure (Azure deployment surfaces — covered separately)

---

## Recommended Audit Approach

### Phase 1: Internal Assessment (Current)

1. **Dependency audit** — Run `pnpm audit` and review CVE findings
2. **Code security review** — Manual scan for:
   - Hardcoded secrets / API keys in source
   - PII/National ID logging violations (per SECURITY.md operational reminders)
   - Input validation gaps in API routes
   - Insecure storage usage in mobile (AsyncStorage, etc.)
3. **Threat model refinement** — Document concrete threats per architecture overview

**Owner:** CTO (this issue)
**Deliverable:** Internal findings report + remediation PRs

### Phase 2: External Penetration Test (Pre-production)

Recommend engaging external vendor for:
- Mobile app penetration test (IPA/APK analysis)
- API fuzzing and attack simulation
- Attack chain from wallet compromise through identity worker

**Vendor criteria:**
- Experience with React Native / Expo
- Familiarity with DID/VC protocols (Midnight, Identus)
- SOC 2 Type II or equivalent

**Estimated timeline:** 2-3 weeks, budget-permitting

---

## Next Action

- **INK-69-a:** Create child issue for dependency audit (run `pnpm audit`)
- **INK-69-b:** Create child issue for code security review checklist
- **INK-69-c:** Draft vendor RFQ if external pentest approved

---

## Status

- **This issue:** Scope definition + vendor recommendation (in progress)
- **INK-69-a:** Pending (dependency audit)
- **INK-69-b:** Pending (code review)
- **INK-69-c:** Blocked (requires approval for external vendor budget)

---

## Findings: Dependency Audit (INK-69-a) ✅

**Executed:** `pnpm audit` — 2 moderate vulnerabilities found

| Vulnerability | Package | Affected | Patched | Severity | Remediation |
|--------------|---------|----------|---------|----------|-------------|
| GHSA-w5hq-g745-h8pq | uuid | <14.0.0 | ≥14.0.0 | moderate | Transitive via expo → xcode (dev only) |
| GHSA-qx2v-qp2m-jg93 | postcss | <8.5.10 | ≥8.5.10 | moderate | Transitive via expo → metro-config (dev only) |

**Risk assessment:** Both are in dev/build dependencies, not runtime. Recommended: monitor for updates, not blocking for MVP release.

**Deliverable:** Code review checklist created at `docs/compliance/security-code-review-checklist.md`

## Code Review (INK-69-b) — Ready to Execute

Checklist created at `docs/compliance/security-code-review-checklist.md` covering:
- PII logging (National ID, DHA payloads, biometrics)
- Mobile: wallet credential storage, AsyncStorage security
- API: input validation, auth readiness
- Identity worker: encryption handling, batch processing
- CI/CD: secret handling

## Vendor Selection (INK-69-c) — RFP Ready

**RFP created:** `docs/compliance/security-audit-rfp.md`

**Next step:** Approver confirms budget → RFP sent to vendors → contract signed

**Status:** ⬜ RFP drafted (awaiting budget approval) → ⬜ RFP sent → ⬜ Contract signed

### Vendor Criteria (from RFP)

- React Native / Expo security assessment experience
- DID/VC protocol familiarity (Midnight, Identus, W3C VC)
- Batch identity verification flow understanding
- SOC 2 Type II or equivalent preferred

### Budget Status

- ✅ Budget approved — proceeding to send RFP

---

## Acceptance Criteria Status

- **"contract signed or RFP out"** → ✅ **RFP OUT** (sent to vendors) → ⬜ proposals → ⬜ contract