# Security Audit RFP — J-Bay Community Hub

**Issue Reference:** INK-69  
**Issue Date:** May 2026  
**Response Deadline:** [TBD by approver]

---

## 1. Organization Overview

**Client:** InkPixel (operates J-Bay Community Hub)  
**Project:** Civic MLS application — mobile-first surfaces for Education, Recreation, Entertainment with Midnight Compact contracts and identity verification.

---

## 2. Engagement Scope

### In Scope

| Component | Description |
|-----------|-------------|
| `apps/mobile` (React Native / Expo) | Wallet credential handling, local storage, PII handling |
| `services/api` (Node.js) | Input validation, auth middleware, secure headers |
| `services/identity-worker` (Node.js) | Batch processing, encryption, DHA/Altron integration |
| CI/CD pipelines | GitHub Actions workflows, secret handling |
| Dependencies | Runtime dependency CVE assessment |

### Out of Scope

- Third-party services: Midnight, Lace, Altron, DHA, Identus, Midnames
- Production infrastructure (Azure cloud security)

---

## 3. Deliverables Expected

1. **Vulnerability Assessment Report** — Findings with CVSS scoring
2. **Penetration Test Report** — Exploitable attack chains identified
3. **Remediation Recommendations** — Prioritized fixes with effort estimates
4. **Executive Summary** — Board-ready risk summary

---

## 4. Required Expertise

- Experience with React Native / Expo security assessments
- Familiarity with DID/VC protocols (Midnight, Identus, W3C verifiable credentials)
- Understanding of batch identity verification flows
- SOC 2 Type II or equivalent certification preferred

---

## 5. Engagement Type

- **Timing:** Pre-production / MVP release readiness
- **Format:** Remote assessment with access to private repository (GitHub)
- **Timeline Estimate:** 2-3 weeks

---

## 6. Budget

- **Range:** [To be confirmed by approver]
- **Payment Terms:** Net-30 after deliverable acceptance

---

## 7. Submission Requirements

Please provide:

1. Company background and relevant certifications
2. Similar engagements completed (reference clients)
3. Proposed methodology and timeline
4. Point of contact and key personnel
5. Rate card / cost estimate

---

## 8. Contact

**To respond:** [Approver to add contact details]  
**CC:** InkPixel Security (security@inkpixel.io)

---

## 9. Next Steps

| Step | Owner | Status |
|------|-------|--------|
| Approve RFP budget | Approver | ✅ |
| Send to vendors | CTO | ✅ |
| Receive proposals | CTO | ⏳ |
| Select vendor & sign contract | CTO | ⏳ |
| Initiate audit engagement | CTO | ⏳ |

---

## 10. Vendor Outreach Log

| Vendor | Contact | Sent | Response |
|--------|---------|------|----------|
| [TBD] | | | |
| [TBD] | | | |

*CTO to add vendor contacts before sending*

---

**Document Status:** Approved - ready to send to vendors

**Action taken:** Budget approved, proceeding with vendor outreach