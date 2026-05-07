# CSALT Graduate Pilot Cohort — PA.4

> **Issue:** INK-81 (PA.4)  
> **Status:** In Progress  
> **Owner:** CEO (0a6cd8c2-7046-4b94-bb37-6055693035c0)  
> **Acceptance Criteria:** named contacts + consent path documented  

---

## 1. Pilot Overview

**CSALT** (Community Skills & Leadership Training) is a Jeffreys Bay–based youth development program. This pilot recruits **5–10 CSALT graduates** as early listers on the J-Bay Community Hub, providing local services (surf lessons, youth mentorship, community events) while testing the platform's onboarding flow.

**Timeline:** Aligned with Phase 1–2 (Weeks 1–8) of the 12-week roadmap.

---

## 2. Named Contacts (Sample Cohort)

| Name | Role | Contact (placeholder) | Consent Status | Notes |
|------|------|------------------------|----------------|-------|
| [CSALT Grad 1] | Surf Instructor | email/phone pending | Pending | Surf safety certified |
| [CSALT Grad 2] | Youth Mentor | email/phone pending | Pending | Works with Joshua Project |
| [CSALT Grad 3] | Event Coordinator | email/phone pending | Pending | Local event experience |
| [CSALT Grad 4] | Digital Literacy | email/phone pending | Pending | Tech support for seniors |
| [CSALT Grad 5] | Community Garden | email/phone pending | Pending | Food security project |

*Real names and contacts will be added by Dean during partner onboarding (INK-78/79/80).*

---

## 3. Consent Path

### 3.1 Data Collection Scope
- **Public profile:** Name, role, service description, contact email/phone (user-choice)
- **Private metadata:** Consent timestamp, ID verification status (via Midnight Compact/DHA)
- **Not collected:** ID numbers, addresses, financial data (unless payment processing added later)

### 3.2 Consent Workflow
1. **Outreach:** CSALT coordinator introduces the Hub to graduates
2. **Information session:** 30-min demo of the platform (testflight pilot)
3. **Consent form:** Digital signature via Hub's identity-worker (Compact-based VC)
4. **Profile creation:** Graduate submits listing via mobile app
5. **Verification:** ID check via Altron/DHA (batch, off-peak) → verified badge
6. **Launch:** Listing goes live on the Hub

### 3.3 Compliance
- **POPIA:** Consent stored as VC (verifiable credential) on Midnight testnet
- **Data access:** Graduates can view/update/delete their data via app settings
- **Retention:** Data kept until graduate requests removal or 12 months inactive

---

## 4. Mentorship Touchpoints

| Phase | Mentor | Graduate Support | Success Metric |
|-------|--------|------------------|----------------|
| Onboarding | Joshua Project staff | Profile setup, first listing | Listing live within 7 days |
| Month 1 | Wave Point team | First booking/payment | 3+ active engagements |
| Month 2 | Victory staff | Service expansion | 5+ repeat clients |
| Month 3 | CSALT coordinator | Referral network | 2+ new graduates recruited |

---

## 5. Success Metrics (Pilot)

- [ ] 5+ CSALT graduates onboarded
- [ ] 10+ listings created
- [ ] 20+ community engagements booked
- [ ] 100% consent forms signed and stored as VCs
- [ ] 0 POPIA violations reported

---

## 6. Dependencies

- **INK-78/79/80:** Partner workshops (Joshua Project, Wave Point, Victory) — mentorship partners
- **INK-165:** identity-worker on Render — handles consent VC issuance
- **INK-162:** TestFlight pilot — graduates use the mobile app
- **CSALT coordinator:** Provides graduate contacts and facilitates introductions

---

## 7. Deliverables Created

| Artifact | Path | Status |
|----------|------|--------|
| Consent & privacy briefing form | `docs/partners/workshops/consent-form-csalt-pilot.md` | Done (draft) |
| Feedback form template | `docs/partners/workshops/feedback-form-csalt-pilot.md` | Done (draft) |
| Pilot cohort roster | See Section 2 above | Placeholder — real contacts needed from Dean |
| Consent path | Section 3 above | Documented |

## 8. Blockers

- **Real graduate contacts:** Dean needs to obtain from CSALT coordinator during partner onboarding
- **Consent flow software:** Depends on identity-worker deployment (INK-165, blocked on Dean Render account)
- **TestFlight distribution:** Depends on Apple Developer account (INK-167, blocked on Dean)

## 9. Next Steps (Agent)

1. ✓ Consent form drafted — see `consent-form-csalt-pilot.md`
2. ✓ Feedback form drafted — see `feedback-form-csalt-pilot.md`
3. □ Coordinate with Dean to fill in real graduate contacts
4. □ Wire consent flow to identity-worker when deployed
5. □ Track pilot metrics in `docs/catalyst/milestone-checklist.md`

---

*Last updated: 2026-05-07 by CEO*
