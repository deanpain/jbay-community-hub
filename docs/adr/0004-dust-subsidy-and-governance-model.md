# ADR 0004: DUST subsidy and confidential community governance model

Status: Accepted for Phase 3 implementation baseline
Date: 2026-05-05
Paperclip: INK-66, INK-67, INK-68

## Context

J-Bay Community Hub must let verified residents use the MLS without being exposed to wallet fuel complexity. The pilot also needs a governance path for treasury-backed subsidy decisions without linking individual residents to ballot choices.

The Phase 3 roadmap requires:

- communal NIGHT treasury / position rules;
- DUST regeneration and resident subsidy product rules;
- confidential voting with auditable outcomes;
- treasury disbursement hooks.

## Decision

The pilot uses a community treasury model:

1. Treasury reserve holds communal NIGHT and generated/allocated DUST.
2. Verified residents receive subsidized MLS actions while the treasury remains above a safety reserve.
3. Public audit records expose proposal IDs, tallies, quorum status, policy version, and disbursement events.
4. Ballot receipts are unlinkable to resident identity in public output.
5. Emergency fallback disables subsidy for non-essential actions before core browsing/identity-gated access is affected.

## Product rules for DUST subsidy

| MLS action | Subsidized for verified residents | Notes |
| --- | --- | --- |
| Browse listing | Yes | Always subsidized while treasury is above reserve. |
| View listing detail | Yes | Must feel fee-less in mobile UX. |
| Create local draft | Yes | Local-only action; no chain cost until publish. |
| Publish verified listing | Yes, capped | Subject to daily per-resident and per-partner caps. |
| Join / RSVP / register interest | Yes | Subject to anti-spam throttles. |
| Admin moderation action | Yes | Admin role only; logged for audit. |
| Bulk partner import | Conditional | Requires coordinator approval if projected DUST exceeds daily cap. |
| Treasury disbursement | No silent subsidy | Must be proposal-governed or emergency-key governed. |

## Safety reserve and fallback

The implementation must expose these policy values as configuration, not hidden literals:

- `MIN_TREASURY_DUST_RESERVE`: below this, non-essential subsidy pauses.
- `DAILY_RESIDENT_DUST_CAP`: per verified resident cap for write actions.
- `DAILY_PARTNER_DUST_CAP`: per partner cap for import/publish flows.
- `EMERGENCY_SUBSIDY_PAUSE`: operator flag for abuse or treasury incident.

Fallback order when treasury is low:

1. pause bulk partner imports;
2. pause publish subsidy for new listings;
3. keep browsing/detail actions fee-less as long as technically possible;
4. show plain-language mobile state: “Community fuel is temporarily limited; try again later.”

## Governance model

Proposal fields:

- `proposalId`
- `title`
- `summary`
- `requestedDustBudget`
- `requestedNightPolicyChange`
- `quorumRequired`
- `votingStartsAt`
- `votingEndsAt`
- `executionHook`

Ballot privacy:

- public contract state must not expose resident DID, wallet address, or partner affiliation next to a vote choice;
- public results expose only aggregate tallies and proof/audit metadata;
- individual receipt may prove a ballot was accepted without revealing choice publicly.

Approval defaults:

- quorum: 20% of active verified residents for normal proposals;
- pass threshold: simple majority of accepted ballots;
- treasury disbursement proposals require an explicit budget field and execution hook;
- emergency pause can be triggered by operator multisig but must be reviewed by governance afterward.

## Mobile UX requirement

Listing detail screens must explicitly tell residents that normal MLS actions are DUST subsidized. The current baseline is implemented in `apps/mobile/App.tsx` using `strings.dustSubsidyHeading` and `strings.dustSubsidyBody`.

## Contract/interface requirement

`contracts/compact/treasury_governance.compact.stub` defines the Phase 3 interface surface until the pinned Midnight Compact toolchain replaces the stub with valid Compact code.

## Consequences

Positive:

- Residents get a practical fee-less experience.
- Treasury policy is auditable and configurable.
- Governance can progress before full Midnight production bindings are pinned.

Trade-offs:

- The current implementation is a policy/interface baseline, not a production treasury contract.
- Real DUST/NIGHT accounting still needs Compact toolchain validation and audit remediation.
- External vendor/security review remains required before mainnet or real treasury value.

## Verification

- Mobile detail view renders DUST subsidy copy.
- Treasury/governance stub exposes subsidy, proposal, ballot, tally, and disbursement concepts.
- Paperclip INK-67 and INK-68 reference this ADR as their acceptance evidence.
