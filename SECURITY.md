# Security policy

## Reporting a vulnerability

Please **do not** open public issues for security findings.

Email or contact the maintainers through the repository’s designated security reporting channel (enable GitHub **Private vulnerability reporting** on the canonical repo when published). Include steps to reproduce, impacted components (`mobile`, `identity-worker`, `contracts`), and any suspected data exposure (especially identity or treasury flows).

## Scope

In scope: this repository’s application code, CI configuration, and documented deployment surfaces.

Out of scope: third-party services (Midnight, Lace, Altron, DHA, Identus, Midnames) — report those issues through their respective channels, though coordinated disclosure with maintainers is welcome.

## Safe harbor

We support good-faith research and will not pursue legal action against researchers who follow coordinated disclosure and avoid privacy violations or service disruption.

## Operational reminders

- Never log National ID numbers, full DHA payloads, or raw biometrics.
- Rotate API keys and batch processor credentials according to `docs/runbooks/`.
