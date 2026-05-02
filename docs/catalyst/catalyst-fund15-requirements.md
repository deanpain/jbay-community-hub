# Catalyst Fund 15 — Midnight Compact DApps: funding alignment

This note aligns **internal engineering tracking** (Paperclip issues, 12-week phases) with **Project Catalyst** expectations for the **Midnight: Compact DApps** category. Always verify **current** Fund rules on [Project Catalyst](https://projectcatalyst.io/) and Cardano Foundation announcements before submission — parameters change per fund.

## Funding currency (USDM)

Midnight Compact category funding is denominated in **USDM** (Cardano-native stablecoin), **not ADA**.

- Any legacy budget framed as **90,000 ADA** must be **converted to a USDM total** using an explicit, cited FX/source at proposal time (e.g. ADA/USD snapshot date documented in the proposal).
- All milestone **amounts** in the Statement of Milestones must be stated in **USDM** (and respect the percentage caps below).

Keep a dated appendix in the proposal: conversion formula, source URL, date/time of rate.

## Mandatory technical deliverables (category fit)

Proposals should **explicitly commit** to delivering:

| Deliverable | Repo alignment |
|-------------|----------------|
| **Compact smart contract(s)** | `contracts/` (replace stubs with compiled modules when toolchain is pinned) |
| **User interface** | `apps/mobile` |
| **Lace wallet integration** | Spike → production path per ADR |
| **Public GitHub repository** | https://github.com/deanpain/jbay-community-hub |
| **Comprehensive README** | Root [`README.md`](../../README.md) + Catalyst/submission docs |
| **Test suite** | CI + `pnpm test` / contract tests; scope documented |

## Open-source license (day one)

Commitment must be explicit: **Apache-2.0** or **MIT** from first public push. This repository uses **Apache-2.0** (`LICENSE`, `NOTICE`).

## Identity & governance stack (reviewer-friendly framing)

Successful Catalyst narratives often cite:

- **DIDs / VCs** via **Hyperledger Identus** (formerly **Atala PRISM**) — align our wording: VC issuance and registry anchoring via **Identus** matches this ecosystem pattern.
- **DAO-style governance** — many Cardano L1 examples reference **Clarity**-style tooling for votes and treasury execution. **Our delivery target is Midnight Compact** (category requirement): implement **quorum, proposals, and treasury execution** in Compact with outcomes reviewers can verify on Midnight test tooling — cite **Compact/Midnight**, not a separate L1 Clarity integration, unless you genuinely add one.

## Proposal scoring (community reviewers)

Reviewers typically score **1–5** on:

1. **Impact** — Plain-language outcomes for Jeffreys Bay (youth unemployment, civic inclusion, local skill marketplace). Minimize unexplained jargon (ZK → “privacy-preserving proofs,” etc.).
2. **Feasibility / capability** — Team proof: GitHub history, past repos, roles. Link active profiles and prior deliveries.
3. **Value for money** — Stress **reusable open-source template**: any municipality can fork, swap config + identity adapter, deploy — treasury funds a **public good**, not only one town.

## Prerequisites before submitting

| Prerequisite | Action |
|--------------|--------|
| **Cardano wallet** | Supported browser-capable wallet with **≥ 5 ADA** for on-chain registration fee (identity registration flow). |
| **Catalyst Keychain** | Create profile; obtain **Proposer** role to access drafting/submission workspace. |
| **Team credentials** | Prepare links: GitHub profiles, samples, prior Catalyst or OSS work. |
| **Prior Catalyst grants** | All **milestone reporting** for previous funded projects must be **complete** — incomplete reporting **disqualifies** new proposals. |
| **Proof of Life** | If funded, project lead must attend **recorded video verification** (camera on) before disbursement — plan for Kurt / lead availability. |

## Plain-language pitch tips

- Lead with **human outcomes** (surfers, youth NGOs, local MLS), then technology.
- One paragraph on **Jeffreys Bay pilot**, one on **global reusability**.
- Attach **evidence types** reviewers trust: GitHub tags, short demo videos, audit or scope PDFs.

## Relationship to internal roadmap

- **Paperclip / INK tasks** = granular execution ([`paperclip-roadmap.md`](paperclip-roadmap.md)).
- **Catalyst program operations (human steps)** = **[INK-88](http://127.0.0.1:3100/INK/issues/INK-88)** and children **INK-89–INK-95** (wallet, Keychain, compliance, USDM/SoM, team links, post-submit doc link). Items titled **[Human]** require the proposer — agents cannot complete them.
- **Statement of Milestones** = **exactly 3** monthly buckets with **20% / 30% / 50%** USDM split — see [`statement-of-milestones-template.md`](statement-of-milestones-template.md).

Do not confuse the two: Catalyst reviewers judge **SoM + evidence**, not INK subtask count.
