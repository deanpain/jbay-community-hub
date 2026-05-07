# Code Security Review Checklist — INK-69-b

## Pre-Review: Operational Reminders (SECURITY.md)

- [ ] **Never log National ID numbers** — grep for `NationalID`, `idNumber`, `nric`, `ssa`
- [ ] **Never log full DHA payloads** — grep for `dha.*payload`, `DHA.*response`
- [ ] **Never log raw biometrics** — grep for `biometric`, `fingerprint`, `face.*data`
- [ ] **Rotate API keys** — verify no hardcoded keys in source

---

## Mobile App (`apps/mobile`)

### Wallet & Credentials
- [ ] Check `src/wallet.ts` — how are wallet credentials stored?
- [ ] Verify no sensitive data in AsyncStorage without encryption
- [ ] Review `expo-secure-store` usage if present

### Data Handling
- [ ] Search for `console.log`, `Alert.alert` with potential PII
- [ ] Verify listing drafts don't contain sensitive user data
- [ ] Check that partner/listing data doesn't expose personal info

### Dependencies
- [ ] Review `package.json` for known vulnerable packages
- [ ] Check Expo SDK version for known issues

---

## API Service (`services/api`)

### Input Validation
- [ ] Check `src/server.ts` — any raw user input without Zod validation?
- [ ] Review endpoint parameters for injection vectors

### Auth/Rate Limiting
- [ ] Verify no exposed secrets in environment variable usage
- [ ] Check if rate limiting is implemented or documented

### Headers & Config
- [ ] Verify secure headers (CORS, CSP if applicable)
- [ ] Check for information disclosure in error responses

---

## Identity Worker (`services/identity-worker`)

### Encryption & Keys
- [ ] Verify `.env.example` documents all required secrets
- [ ] Check that no ciphertext is logged
- [ ] Review KMS/HSM assumptions documented in runbooks

### PII Handling
- [ ] Search for any reference to National ID, DHA payloads in logs
- [ ] Verify `verified_resident.compact.ts` doesn't expose raw data

### Batch Processing
- [ ] Review `processor.ts` — any race conditions?
- [ ] Check error handling doesn't leak sensitive context

---

## CI/CD (`.github/workflows/`)

- [ ] Verify no secrets in workflow logs
- [ ] Check `pnpm-lock.yaml` is committed (dependency integrity)
- [ ] Review if any build steps could be compromised

---

## Review Output Template

| Component | Finding | Severity | Remediation |
|-----------|---------|----------|-------------|
| mobile/wallet | Example: AsyncStorage used for token | Medium | Switch to expo-secure-store |
| api/input | Example: no validation on `/listings` | High | Add Zod schema |
| worker/logging | Example: console.log(dhaPayload) | Critical | Remove or mask |

---

## Sign-Off

- [ ] Reviewer: ___
- [ ] Date: ___
- [ ] Findings addressed: ___