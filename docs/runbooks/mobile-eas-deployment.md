# Mobile deployment (Expo EAS → TestFlight / Play Store Internal)

This runbook sets up Expo Application Services (EAS) for the Expo app in `apps/mobile`.

## One-time setup

1. Install EAS CLI:
   ```bash
   npm i -g eas-cli
   ```
2. Login and initialize EAS in `apps/mobile`:
   ```bash
   cd apps/mobile
   eas login
   eas build:configure
   ```
3. Ensure identifiers are set:
   - iOS: `expo.ios.bundleIdentifier` in `apps/mobile/app.json`
   - Android: `expo.android.package` in `apps/mobile/app.json`

## Build profiles

Configured in `apps/mobile/eas.json`:

- `development`: dev client (internal)
- `preview`: internal distribution (ad-hoc / internal)
- `production`: app store builds (auto-increment enabled)

## Secrets / env

Prefer EAS-managed secrets for mobile build-time config:

```bash
cd apps/mobile
eas secret:create --name EXPO_PUBLIC_API_BASE_URL --value "https://api.example.com"
```

The app reads this into `extra.apiBaseUrl` via `apps/mobile/app.json`.

## iOS (TestFlight)

```bash
cd apps/mobile
eas build --platform ios --profile production
eas submit --platform ios --profile production
```

## Android (Play Store internal testing)

```bash
cd apps/mobile
eas build --platform android --profile production
eas submit --platform android --profile production
```

## CI (optional)

If you want automated EAS builds via GitHub Actions, add an Expo token as a repo secret:

- `EXPO_TOKEN`: created from https://expo.dev/accounts/<account>/settings/access-tokens

