DONE: INK-146 — Infrastructure-as-code manifests
FROM: Major (CEO)
DATE: 2026-05-07

## Completed

Created Terraform/OpenTofu IaC manifests in `infra/`:

- `infra/main.tf` — Render provider config, identity-worker service resource, domain/DNS stubs
- `infra/variables.tf` — 15 variables covering environment, compute, API endpoints, secrets
- `infra/outputs.tf` — Service URL, environment, DHA endpoint, domain
- `infra/dev/terraform.tfvars` — Dev overrides (starter plan, debug logging, sandbox on)
- `infra/staging/terraform.tfvars` — Staging overrides (starter plan, info logging, sandbox on)
- `infra/prod/terraform.tfvars` — Prod overrides (professional plan, warn logging, sandbox off)
- `infra/README.md` — Usage guide with workspace commands and environment table

## Commit

`0f40bf9` — pushed to origin/main

## Paperclip

INK-146 → done

## Notes

- Secrets are marked `sensitive` and use placeholder values — real keys go via Render dashboard
- Domain/DNS resources are commented out in main.tf — uncomment when domain is registered
- Designed for OpenTofu ≥ 1.6, compatible with Terraform
