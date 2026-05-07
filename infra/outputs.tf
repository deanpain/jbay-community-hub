output "identity_worker_url" {
  description = "URL of the deployed identity worker service"
  value       = try(render_service.identity_worker.service_url, "pending-deployment")
}

output "identity_worker_env" {
  description = "Environment name the worker is running in"
  value       = var.environment
}

output "dha_batch_endpoint" {
  description = "Configured DHA batch endpoint"
  value       = var.dha_batch_endpoint
}

output "altron_sandbox_enabled" {
  description = "Whether Altron sandbox mode is enabled"
  value       = var.altron_sandbox_enabled
}

output "domain" {
  description = "Configured domain name (empty if not set)"
  value       = var.domain_name
}
