# ADR 0002 — Bulletin Board lineage for MLS listings

## Status

Accepted — scaffold phase (2026-05-02)

## Context

Midnight’s Bulletin Board reference demonstrates private posting with commitments and access control — behaviors analogous to shielded MLS listings.

## Decision

1. Treat Bulletin Board as the **starting scaffold** for listing privacy mechanics before layering marketplace-specific rules (categories, scheduling, disputes).
2. Track upstream provenance and licensing notices in `contracts/templates/README.md` and repository `NOTICE`.
3. Encode divergence (governance hooks, treasury subsidies) only after upstream compatibility review.

## Consequences

- Maintainers must periodically reconcile with Midnight DevRel template updates.
- Additional ADRs will split marketplace mechanics once Compact modules graduate from `.stub`.
