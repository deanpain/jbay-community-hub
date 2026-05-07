# ─── Environment ────────────────────────────────────────────────────────────

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

# ─── Git / Source ───────────────────────────────────────────────────────────

variable "github_repo_url" {
  description = "GitHub repository URL for the service"
  type        = string
  default     = "https://github.com/deanpain/jbay-community-hub"
}

variable "git_branch" {
  description = "Git branch to deploy from"
  type        = string
  default     = "main"
}

# ─── Compute ────────────────────────────────────────────────────────────────

variable "identity_worker_plan" {
  description = "Render plan for the identity worker service"
  type        = string
  default     = "starter"
}

# ─── Logging ────────────────────────────────────────────────────────────────

variable "log_level" {
  description = "Application log level"
  type        = string
  default     = "info"
}

# ─── Identity Pipeline ──────────────────────────────────────────────────────

variable "identity_worker_encryption" {
  description = "Encryption mode for the identity worker (aes256-gcm | auto)"
  type        = string
  default     = "auto"
}

variable "dha_batch_endpoint" {
  description = "DHA batch verification API endpoint"
  type        = string
  sensitive   = false
}

variable "dha_live_endpoint" {
  description = "DHA live verification API endpoint"
  type        = string
  sensitive   = false
}

variable "altron_sandbox_enabled" {
  description = "Enable Altron sandbox mode"
  type        = bool
  default     = true
}

# ─── Secrets (use env vars or secret store) ─────────────────────────────────

variable "dha_api_key_secret" {
  description = "DHA API key (injected as secret)"
  type        = string
  sensitive   = true
}

variable "altron_api_key_secret" {
  description = "Altron API key (injected as secret)"
  type        = string
  sensitive   = true
}

variable "identus_api_key_secret" {
  description = "Identus API key (injected as secret)"
  type        = string
  sensitive   = true
}

variable "kms_key_id" {
  description = "KMS key identifier for encryption-at-rest"
  type        = string
  sensitive   = true
}

# ─── Identity / DID ─────────────────────────────────────────────────────────

variable "identus_issuer_did" {
  description = "DID for the Identus credential issuer"
  type        = string
  sensitive   = true
}

# ─── Domain (for production) ────────────────────────────────────────────────

variable "domain_name" {
  description = "Production domain name (e.g. jbaycommunity.org)"
  type        = string
  default     = ""
}
