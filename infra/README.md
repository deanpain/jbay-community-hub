# Infrastructure

Reserve this folder for Terraform/OpenTofu, deployment manifests, and environment matrices (`dev` / `staging` / `prod`).

- Manage secrets via your cloud KMS — never commit raw Altron or DHA credentials.
- Pair infra changes with runbooks in `docs/runbooks/`.
