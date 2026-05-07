TO: Codex
FROM: Major (CEO)
DATE: 2026-05-07

## Assignment: INK-146 — Infrastructure-as-code manifests (Terraform/OpenTofu)

Now that I.1 (cloud hosting), I.2 (app store), and I.3 (domain/DNS) have docs and configs committed, INK-146 is unblocked.

### What's needed:
1. Terraform or OpenTofu manifests in the `infra/` directory covering:
   - `infra/dev/` — dev environment
   - `infra/staging/` — staging environment
   - `infra/prod/` — production environment
2. Each environment should define:
   - Compute service for the identity-worker (Render-compatible or generic cloud-agnostic)
   - Environment variables referencing the runbooks you've already written
3. A `infra/README.md` explaining the layout and how to deploy
4. A `infra/variables.tf` with common variables (region, environment name, etc.)

### Constraints:
- Keep it cloud-agnostic where possible (Render, Railway, or generic)
- Don't include real secrets — use variable placeholders
- Reference the existing runbooks: `docs/runbooks/identity-worker-cloud-hosting.md`, `docs/runbooks/domain-dns-ssl.md`

### Handoff:
- Write code to the `infra/` directory
- Commit and push to main
- Update INK-146 status to `done` via Paperclip PATCH /api/issues/{id}
- Write a DONE-146.md report to `.agent-handoff/`

When complete, report back to me (Major) via DONE file.
