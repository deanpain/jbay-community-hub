# J-Bay Community Hub — Infrastructure
#
# Cloud-agnostic Terraform/OpenTofu manifests for the identity-worker service
# and supporting infrastructure. Designed to target Render, Railway, or any
# container platform with minimal changes.
#
# Directory layout:
#   main.tf       — Provider, modules, and shared resources
#   variables.tf  — Common input variables
#   outputs.tf    — Exported values
#   dev/          — Dev environment overrides
#   staging/      — Staging environment overrides
#   prod/         — Production environment overrides
#
# Usage:
#   tofu init
#   tofu workspace new dev    # or: staging, prod
#   tofu plan -var-file="$(tofu workspace show)/terraform.tfvars"
#   tofu apply -var-file="$(tofu workspace show)/terraform.tfvars"
#
# See docs/runbooks/ for deployment runbooks:
#   docs/runbooks/identity-worker-cloud-hosting.md
#   docs/runbooks/domain-dns-ssl.md

terraform {
  required_version = ">= 1.6"

  # Backend — configure per environment or use local for dev.
  # backend "s3" {
  #   bucket = "jbay-terraform-state"
  #   key    = "jbay-community-hub/terraform.tfstate"
  #   region = "af-south-1"
  # }
}

# ─── Provider ───────────────────────────────────────────────────────────────
# Default: Render. Swap for your target platform.
provider "render" {
  alias = "default"
}

# ─── Identity Worker Service ────────────────────────────────────────────────
# Deploys the batch identity processor on Render.
# Adjust resource type for Railway, Fly.io, or k8s.
resource "render_service" "identity_worker" {
  name      = "jbay-identity-worker-${var.environment}"
  plan      = var.identity_worker_plan
  runtime   = "docker"
  repo_url  = var.github_repo_url
  branch    = var.git_branch

  env = {
    NODE_ENV                    = var.environment
    LOG_LEVEL                   = var.log_level
    IDENTITY_WORKER_ENCRYPTION  = var.identity_worker_encryption
    DHA_BATCH_ENDPOINT         = var.dha_batch_endpoint
    DHA_LIVE_ENDPOINT          = var.dha_live_endpoint
    ALTROM_SANDBOX_ENABLED     = var.altron_sandbox_enabled
    IDENTUS_ISSUER_DID         = var.identus_issuer_did
  }

  secrets = {
    DHA_API_KEY     = var.dha_api_key_secret
    ALTROM_API_KEY  = var.altron_api_key_secret
    IDENTUS_API_KEY = var.identus_api_key_secret
    KMS_KEY_ID      = var.kms_key_id
  }

  health_check_path = "/health"
}

# ─── Domain & DNS ───────────────────────────────────────────────────────────
# Configure once the domain is registered.
# See docs/runbooks/domain-dns-ssl.md for setup steps.
#
# resource "cloudflare_zone" "main" {
#   zone = var.domain_name
# }
#
# resource "cloudflare_record" "identity_worker" {
#   zone_id = cloudflare_zone.main.id
#   name    = "identity.${var.domain_name}"
#   type    = "CNAME"
#   value   = render_service.identity_worker.service_url
#   proxied = true
# }
