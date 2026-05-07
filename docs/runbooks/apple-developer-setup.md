# Apple Developer Account Setup — Quick Guide

> **Issue:** INK-167 · P-MVP.5  
> **Purpose:** Gate for P-MVP.2 (EAS Build + TestFlight)  
> **Who:** Dean  
> **Est. time:** 30–60 min  
> **Cost:** $99/year

---

## Step 1 — Enroll in Apple Developer Program

1. Go to [developer.apple.com/programs/enroll](https://developer.apple.com/programs/enroll/)
2. Sign in with your Apple ID (or create one)
3. Choose **Individual** (not Organization) unless you have a D-U-N-S number
4. Pay the **$99/year** fee
5. Wait for enrollment — typically instant for Individual, up to 48h if Apple verifies

> **Save your Apple ID credentials** — the build pipeline (EAS) needs them.

## Step 2 — Generate Signing Certificates

After enrollment is active:

1. Go to [developer.apple.com/account](https://developer.apple.com/account)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Create a **Certificate** → **Apple Development** (for dev builds)
4. Follow the prompts to generate a CSR from Keychain Access and upload it
5. Download the `.cer` file and double-click to install in Keychain
6. Export the private key: Keychain Access → right-click the key → Export → `.p12`

## Step 3 — Register Bundle ID

1. In Certificates, Identifiers & Profiles → **Identifiers**
2. Click **+** → **App IDs** → **Continue**
3. Set Bundle ID: `com.jbaycommunity.hub` (or whatever the app uses — check `app.json` in the monorepo)
4. Enable capabilities: **Push Notifications**, **Associated Domains** (if needed)
5. Register

## Step 4 — Create Distribution Profile

1. Go to **Profiles** → **+**
2. Select **iOS App Development** (for TestFlight)
3. Select the App ID from Step 3
4. Select your Development certificate
5. Select test devices (add device UDIDs — get from devices)
6. Name it and generate → download `.mobileprovision`

## Step 5 — Wire into the Build Pipeline

The monorepo uses **EAS Build** (`apps/mobile/eas.json`). You'll need:

- `EXPO_APPLE_APP_SPECIFIC_PASSWORD` — generated from [appleid.apple.com/account/manage](https://appleid.apple.com/account/manage) (App-Specific Passwords section)
- The `.p12` certificate file and `.mobileprovision` profile — stored securely, paths set in `eas.json`

Share these with the CEO agent after setup so credentials can be wired into CI.

---

**Done when:** `eas build --platform ios --profile development` completes and uploads to TestFlight.
