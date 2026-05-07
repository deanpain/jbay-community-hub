# Backup and Disaster Recovery — J-Bay Community Hub

## Repo (source code)
- **Host:** GitHub (deanpain/jbay-community-hub)
- **Protection:** Git history is the backup — all history is preserved
- **Cadence:** Every push is backed up. Consider a weekly `git bundle` export to cold storage:
  ```bash
  git bundle create jbay-community-hub-$(date +%Y-%m-%d).bundle --all
  ```

## Paperclip issues
- **Host:** Local Paperclip instance (PGlite database)
- **Risk:** Data loss if `data/pglite/` is deleted
- **Cadence:** Export issues weekly:
  ```bash
  curl -s "http://127.0.0.1:3100/api/companies/a73a2a96-dd59-4f59-a3f1-d842897150d7/issues?limit=500" > paperclip-backup-$(date +%Y-%m-%d).json
  ```

## Secrets / Environment
- **Host:** Render dashboard, local `.env` files
- **Risk:** API keys lost if dashboard access is lost
- **Cadence:** Document which secrets exist in `docs/compliance/` — never store raw values

## Identity-worker data
- **Host:** In-memory queue (no persistent storage in current design)
- **Risk:** In-flight verification requests lost on restart
- **Mitigation:** Document at `docs/runbooks/identity-worker-cloud-hosting.md`

## Recovery test
- Run a restore from git bundle + Paperclip export once per quarter
