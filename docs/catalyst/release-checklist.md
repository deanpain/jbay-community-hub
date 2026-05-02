# Release checklist (template publication)

Use before tagging an open-source template drop.

## Quality gates

- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm contracts:test` succeed locally and in CI.
- [ ] Mobile smoke-tested on Android **and** iOS hardware or reliable simulators (wallet flows as applicable).
- [ ] Identity worker dry-run in staging with **synthetic** data passes batch replay tests.

## Documentation

- [ ] README quickstart reflects actual env vars / endpoints.
- [ ] `docs/partners/` + `docs/comms/` references aligned with pilot organisations (update when cloning for other towns).
- [ ] Catalyst milestone checklist updated with ✅ items completed.

## Legal / licensing

- [ ] Third-party notices accumulated in `NOTICE`.
- [ ] Compliance memo (`docs/compliance/`) reviewed for POPIA obligations relevant to deployment country.

## Communication

- [ ] Maintain embargo on undisclosed vulnerabilities; publish CVE coordination via SECURITY policy after fixes ship.

## Catalyst close-out (when filing Fund reports)

- [ ] SoM evidence links still valid (GitHub release/tag, demo video if promised).
- [ ] USDM milestone amounts match what was approved (no silent scope drift without amendment).
