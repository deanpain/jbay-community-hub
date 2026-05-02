# Compliance notes (POPIA-first posture)

South Africa’s POPIA applies when processing personal information — even transient identity payloads destined for Altron/DHA.

## Principles embedded in architecture

- **Minimisation**: collect only what verification requires; discard plaintext after VC issuance where policy allows.
- **Purpose limitation**: process identity strictly for residency verification + audit obligations.
- **Security safeguards**: encrypt queues, restrict KMS keys, monitor worker access.
- **Subprocessors**: maintain current list (Altron, DHA, cloud hosting, analytics). Link DPAs here when executed.

## Operational tasks

- Maintain Records of Processing Activities (ROPA) externally; summarize scopes in this folder when legal counsel approves.
- Document retention windows for ciphertext queues vs VC artifacts.

> Not legal advice — engage qualified counsel before production launch.
