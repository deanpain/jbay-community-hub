# Infrastructure

[Terraform](https://terraform.io) / [OpenTofu](https://opentofu.org) manifests for the J-Bay Community Hub.

## Layout

```
infra/
├── main.tf          # Provider config, compute service, domain stubs
├── variables.tf     # All input variables (with descriptions and defaults)
├── outputs.tf       # Exported values
├── README.md        # This file
├── dev/             # Dev environment variable overrides
├── staging/         # Staging environment variable overrides
└── prod/            # Production environment variable overrides
```

## Prerequisites

- [OpenTofu](https://opentofu.org/docs/intro/install/) ≥ 1.6 (or Terraform ≥ 1.6)
- A [Render](https://render.com) account (or swap the provider in `main.tf` for Railway, Fly.io, etc.)
- Your Altron/DHA/Identus API keys (set via Render dashboard or secret store)

## Usage

```bash
# 1. Select environment
tofu workspace new dev      # first time only
tofu workspace select dev   # switch to dev

# 2. Plan
tofu plan -var-file="$(tofu workspace show)/terraform.tfvars"

# 3. Apply
tofu apply -var-file="$(tofu workspace show)/terraform.tfvars"
```

> **Note:** Secrets (`dha_api_key_secret`, `altron_api_key_secret`, etc.) are marked `sensitive` and should be injected via environment variables or Render's dashboard — never committed to the repo.

## Environments

| Environment | Plan        | Log Level | Sandbox | Purpose                 |
|-------------|-------------|-----------|---------|-------------------------|
| `dev`       | starter     | debug     | on      | Rapid iteration         |
| `staging`   | starter     | info      | on      | Integration testing     |
| `prod`      | professional| warn      | off     | Production / pilot      |

## References

- Identity worker deployment: [`docs/runbooks/identity-worker-cloud-hosting.md`](../docs/runbooks/identity-worker-cloud-hosting.md)
- Domain/DNS setup: [`docs/runbooks/domain-dns-ssl.md`](../docs/runbooks/domain-dns-ssl.md)
- Container config: `services/identity-worker/Dockerfile`
