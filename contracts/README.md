# Midnight Compact contracts

This directory holds **Community Hub** smart-contract sources for the Midnight network.

## Layout

- `compact/` — domain modules (listings, verified-resident gate, treasury/governance). Files use `.compact.stub` until the Midnight toolchain is pinned in CI.
- `templates/` — Notes on adapting Midnight DevRel templates (Bulletin Board) into the private MLS.

## Toolchain

Wire the official Midnight **Compact** compiler, proof tooling, and network endpoints per current Midnight documentation. Replace stub suffixes with real `.compact` modules and swap `contracts/scripts/test-placeholder.mjs` for the canonical test invocation.

## Bulletin Board Pattern

The `listings` module adapts the Midnight Bulletin Board reference template. The mapping from the Bulletin Board template to the Community Hub domain is as follows:
- **Boards** correspond to the three main tabs: Education, Recreation, and Entertainment.
- **Posts** correspond to individual listings, holding fields like `organisation`, `title`, `summary`, `schedule`, and `proof_requirements`.
- **Poster Identity** remains shielded, anchored by a verified-resident ZK credential check.

## Security

Contracts handling treasury logic MUST receive an independent audit before mainnet deployment.
