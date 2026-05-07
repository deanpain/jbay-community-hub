# Community Onboarding Coordinator Playbook

Runbook: `community-onboarding-coordinator.md`
Paperclip: INK-71
Phase: P3.6

## Overview

This playbook guides community onboarding coordinators through partner organization setup, verified resident onboarding flow, and escalation paths. It assumes the J-Bay Community Hub mobile app is deployed and the identity-worker is operational (Phase 2 complete).

## Coordinator Role

The coordinator is the primary liaison between J-Bay Community Hub and partner organizations (schools, recreation centers, faith groups, youth programs). Responsibilities:

- Onboard new partner organizations to the platform
- Verify organization representative credentials
- Escalate issues that block resident verification or listing visibility
- Maintain partner contact directory

## Pre requisites

Before starting onboarding, confirm:

- [ ] Partner organization has a designated representative with DHA-issued identity credential
- [ ] Representative can access a Lace wallet (browser extension or mobile)
- [ ] Organization has at least one verified resident member
- [ ] Partner taxonomy entry exists or coordinator will create one

## Onboarding Checklist

### Step 1: Partner Registration

1. **Collect representative details**
   - Full legal name (as on DHA credential)
   - Mobile number for 2FA
   - Email address
   - Organization name and type (per `docs/partners/listing-taxonomy.md`)
   - Wallet address (from Lace)

2. **Create partner taxonomy entry**
   - Path: `apps/mobile/src/data/partners.json` (if seed entry not present)
   - Fields: partnerId, organizationName, organizationType, verifiedRepAddress, status

3. **Log registration event**
   - Record: representative wallet address, timestamp, coordinator ID
   - Store for audit: `services/api/src/models/partnerregistration.ts`

### Step 2: Identity Verification

1. Representative initiates verification in mobile app
2. App requests DHA credential via Identus integration
3. Identity-worker processes batch (configured in Phase 2)
4. Coordinator verifies credential status via dashboard query

> **Offline pathway:** If representative cannot complete digital verification, coordinator collects physical DHA letter + photo ID, logs manually in `docs/runbooks/offline-verification-log.md`, and flags for subsequent batch verification.

### Step 3: First Listing Creation

1. Representative logs into mobile app
2. Creates first listing (draft mode is subsidized)
3. Publishes listing — subsidy applied automatically per ADR 0004 rules
4. Coordinator reviews in moderation queue (if enabled)

### Step 4: Partner Activation

1. Coordinator marks partner as "active" in partner registry
2. Partner receives confirmation via mobile notification
3. Coordinator adds partner to contact directory (`docs/partners/contact-directory.md`)

## Escalation Paths

| Issue | First Contact | Escalation |
|-------|-------------|------------|
| DHA credential not issuing | Coordinator → identity-worker logs | INK-63 owner (Identus/VDR) |
| Wallet connection failing | Coordinator → Lace support docs | Platform engineering |
| Listing not visible | Coordinator → moderation queue | INK-66 owner (treasury) |
| DUST subsidy not applying | Coordinator → treasury policy logs | INK-66 owner |
| Partner representative replaced | Coordinator → identity re-verification | Governance (INK-68) |
| Offline verification blocked | Coordinator → compliance | INK-65 owner (POPIA/DPIA) |

## Offline Pathways

For residents without reliable digital access:

1. **Paper-based listing submission**
   - Coordinator collects listing details on paper form
   - Coordinator enters as "draft" in app on behalf of resident
   - Resident approves final content via SMS code

2. **Group verification sessions**
   - Coordinator schedules batch verification at partner location
   - Mobile device with app shared in-person
   - Identity-worker processes same-day batch

3. **Escalation for persistent offline**
   - Log in `docs/runbooks/offline-verification-log.md`
   - Flag for monthly offline batch review
   - Coordinator notifies partner rep via phone

## Audit and Compliance

- All onboarding events logged with timestamp and coordinator wallet address
- Partner registration log: `services/api/src/models/partnerregistration.ts`
- Monthly导出: `pnpm export-partner-registrations` (runbook to be added)
- POPIA compliance: no National ID stored in plaintext; only verification hash

## Related Documentation

- `docs/adr/0004-dust-subsidy-and-governance-model.md` — subsidy rules
- `docs/partners/listing-taxonomy.md` — organization types
- `docs/runbooks/identity-batch-windows-dry-run.md` — batch verification
- `docs/runbooks/offline-verification-log.md` — offline tracking

---

**Status:** Ready for pilot partner onboarding (INK-78 workshop)
**Next review:** After first 3 partners onboarded