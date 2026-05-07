# Apple Developer Account Setup Guide

**Purpose:** Unblocks INK-167 (P-MVP.5) → INK-164 (EAS Build + TestFlight) → INK-166 (Pilot Ship)

## Step 1: Enroll in Apple Developer Program

1. Go to https://developer.apple.com/programs/enroll/
2. Sign in with your Apple ID (or create one)
3. Choose **Individual** or **Organization**:
   - Individual ($99/year) — faster, use your personal Apple ID
   - Organization ($99/year) — needs D-U-N-S number, takes longer
4. Complete billing and legal agreement
5. Wait for enrollment confirmation (usually instant for Individual)

## Step 2: Generate Signing Certificates

After enrollment is active:

1. Go to https://developer.apple.com/account/resources/certificates/list
2. Click **+** → **Apple Development** → **Continue**
3. Follow the CSR (Certificate Signing Request) workflow:
   - Open **Keychain Access** on Mac
   - Keychain Access → Certificate Assistant → Request a Certificate From a Certificate Authority
   - Save CSR to disk
4. Upload the CSR on the Apple Developer site
5. Download the `.cer` file
6. Double-click to install in Keychain

## Step 3: Create App Identifier

1. Go to **Certificates, Identifiers & Profiles** → **Identifiers**
2. Click **+** → **App IDs** → **Continue**
3. Set:
   - Bundle ID: `com.inkpixel.jbaycommunityhub`
   - Capabilities: Push Notifications (if needed), Associated Domains (if needed)
4. Register

## Step 4: Register Test Devices (for Development Builds)

1. Go to **Devices** → **+**
2. Add UDID of each test iPhone/iPad
   - On device: Settings → General → About → UDID (tap to copy)
   - Or use Xcode: Window → Devices and Simulators

## Step 5: Create Provisioning Profile

1. Go to **Profiles** → **+**
2. Select **iOS App Development**
3. Select App ID from Step 3
4. Select your Development Certificate
5. Select test devices
6. Name it and generate → download `.mobileprovision`
7. Double-click to install

## Step 6: Configure EAS Build

Once certs and profiles are in place:

```bash
# In the project directory
eas build:configure

# Run development build
eas build --platform ios --profile development

# Submit to TestFlight (first time needs Apple account setup)
eas submit --platform ios
```

## Estimated Timeline

| Step | Time | Who |
|------|------|-----|
| Enroll in Developer Program | 10 min (instant) | Dean |
| Generate certs | 15 min | Dean |
| Create App ID | 5 min | Dean |
| Register test devices | 5 min each | Dean |
| Create provisioning profile | 5 min | Dean |
| EAS Build configuration | 15 min | Agent |
| First build + TestFlight upload | 30 min | Agent |

**Total Dean time:** ~40-60 min

## What Agent Needs From Dean

- Apple Developer account credentials (or access)
- Downloaded `.cer` certificate file
- `.mobileprovision` profile file
- Device UDID(s) for testing
- Once provided, agent will run EAS build and submit to TestFlight
