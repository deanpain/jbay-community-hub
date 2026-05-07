# Workshop Notes: Joshua Project (Education Partner)
## J-Bay Community Hub Collaboration

**Date:** 2026-05-07
**Partner:** Joshua Project
**Focus:** Education, AET, and Life Skills

---

### Context
Joshua Project is a primary education and youth development partner in Jeffreys Bay. Their involvement in the Community Hub focuses on digitizing the discovery and enrollment process for their Adult Education & Training (AET) modules and life skills programmes. The goal is to provide a clear pathway for community members to transition from basic education into work-readiness and entrepreneurship.

### Proposed Listing Categories
Based on the existing taxonomy, the following categories are proposed for Joshua Project listings:

1. **Adult Education & Training (AET):**
   - **Rationale:** Direct alignment with core Joshua Project offerings. These listings require specific tracking of progress through NQF-aligned modules.
2. **Life Skills & Work Readiness:**
   - **Rationale:** Bridging the gap between formal education and employment. Often follows the "Work 4aLiving" methodology.
3. **Youth Leadership Labs:**
   - **Rationale:** Collaborative sessions (often with Victory Gap Year) focusing on personal development and community leadership.

### Moderation Notes
- **Verification:** Joshua Project staff act as the primary moderators for their listings.
- **Proof Requirements:** Enrollment in AET modules typically requires a prior assessment. Listings must clearly state that "Proof of Assessment" is a prerequisite.
- **Privacy:** Attendance and performance data for AET modules must be handled via the Hub's privacy-preserving proof system rather than public comments.

### Exemplar Listing
Below is a JSON representation of a standard Education listing for an AET module.

```json
{
  "organisation": "Joshua Project",
  "title": "AET Communication Level 1",
  "summary": "Foundational English communication skills module focused on reading, writing, and speaking for daily life and workplace contexts.",
  "category": "education",
  "tags": ["AET", "Literacy", "Foundation"],
  "schedule": "Mondays and Wednesdays, 09:00 - 12:00",
  "location": "Joshua Project Center, J-Bay",
  "proof_requirements": [
    "Initial Literacy Assessment",
    "J-Bay Resident Status"
  ],
  "meta": {
    "module_code": "COM1-AET",
    "nqf_level": 1,
    "capacity": 15
  }
}
```
