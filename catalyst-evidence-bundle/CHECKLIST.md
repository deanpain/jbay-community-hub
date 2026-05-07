# Catalyst / Grant Evidence Bundle — Preparation Checklist

## Folder: projects/jbay_community/catalyst-evidence-bundle/

### 1. Screenshots (/screenshots/)
- [ ] Catalyst app dashboard (logged in, showing project)
- [ ] Proposal submission page (metadata, links)
- [ ] Community voting page (if applicable)
- [ ] Wallet connection screen
- [ ] Any relevant Catalyst/Fund round pages

### 2. Transaction Samples (/tx-samples/)
- [ ] Registration tx hash (sanitized)
- [ ] Voting tx hash (sanitized)
- [ ] ADA transfer tx hash (sanitized)
- [ ] Store as .txt files with tx hash, date, amount, purpose (all PII sanitized)

### 3. Repo Tag
- [ ] Tag the relevant repo with a release tag for grant reference
- [ ] Example: `git tag -a v1.0-catalyst-evidence -m "Catalyst grant evidence bundle"`
- [ ] Push: `git push origin v1.0-catalyst-evidence`

### 4. Demo Script
- [ ] Screen recording or script showing key flows
- [ ] Or a README.md documenting how to reproduce
- [ ] Include: wallet setup, proposal view, voting interaction

### 5. Bundle
- [ ] Zip the folder: `zip -r catalyst-evidence-bundle.zip catalyst-evidence-bundle/`
- [ ] Link in Paperclip comment on INK-77

## Notes
- Transaction data MUST be sanitized — no real addresses, amounts only if public
- Screenshots should avoid sensitive UI state (connected wallet addresses, balances)
- Repo tag should reference the exact commit used in the demonstration
