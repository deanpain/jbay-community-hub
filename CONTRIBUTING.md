# Contributing

Thank you for contributing to the J-Bay Community Hub monorepo.

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) 9+

## Workflow

1. Install dependencies: `pnpm install`
2. Run checks locally: `pnpm lint`, `pnpm typecheck`, `pnpm contracts:test`
3. Open a pull request with a clear description of intent and risk (especially for identity, wallet, or treasury changes).

## Scope boundaries

- Do **not** commit secrets, API keys, Altron credentials, or raw DHA responses.
- Prefer **batch / async** identity flows consistent with `docs/adr/` decisions.
- Follow ADRs in `docs/adr/`; propose a new ADR for material architectural changes.

## Code style

- TypeScript: strict mode in shared services; mobile follows Expo / React Native conventions.
- Run `pnpm lint` before pushing.
