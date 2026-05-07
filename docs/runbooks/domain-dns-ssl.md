# Domain, DNS, and SSL configuration

This runbook covers establishing production URLs for the API and identity worker, and wiring those URLs into the mobile app configuration.

## Recommended domain layout

- `api.<domain>` → public API/BFF (when `services/api` is promoted)
- `worker.<domain>` → identity worker operational endpoint (optional; worker can be private-only)

If you don’t want a public worker endpoint, skip `worker.<domain>` and only expose `api.<domain>`.

## DNS

### Render-hosted services (common)

For each public Render service:

1. Add a custom domain in Render (it will show the required record).
2. Create the corresponding DNS record:
   - `CNAME api` → Render-provided hostname (preferred), or
   - `A` record if your provider requires it (follow Render instructions).

## SSL/TLS

- Use Render-managed TLS certificates for Render custom domains (recommended).
- Enforce HTTPS on the service (Render setting) once certificate provisioning is complete.

## Mobile app wiring

The Expo app reads the base API URL from `EXPO_PUBLIC_API_BASE_URL`:

- `apps/mobile/app.json` exposes it as `expo.extra.apiBaseUrl`
- Set it during EAS builds via EAS secrets:
  ```bash
  cd apps/mobile
  eas secret:create --name EXPO_PUBLIC_API_BASE_URL --value "https://api.<domain>"
  ```

For local development, you can also export it in your shell before running `expo start`.

## Checklist

- [ ] Domain registered and managed in your DNS provider
- [ ] `api.<domain>` record created
- [ ] TLS certificate provisioned
- [ ] HTTPS-only enforced
- [ ] `EXPO_PUBLIC_API_BASE_URL` set for EAS builds and verified in a TestFlight / internal build

