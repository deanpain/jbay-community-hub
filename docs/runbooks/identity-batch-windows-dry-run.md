# Runbook — Identity batch windows dry-run

Validates off-peak scheduler behavior and aggregate outcomes before sandbox wiring.

## Target

- `services/identity-worker`
- Ticket intent: configurable windows + queue/batch/outcome metrics

## Execute

```bash
pnpm --filter identity-worker run dry-run
```

Expected output: JSON with `submitted`, `accepted`, `rejected`, `retry`, and `metrics`.

## Interpretation

- `tick()` outside window returns `null` (no flush).
- `tick()` inside window drains queue and updates counters.
- `metrics.queueDepth` should drop to `0` after in-window flush.

## Off-peak window rules

- Standard window (`startHour < endHour`): active when `hour >= startHour && hour < endHour`.
- Overnight window (`startHour > endHour`): active when `hour >= startHour || hour < endHour`.
- Equal hours (`startHour === endHour`): treated as always-on window.

## Next step toward staging

When Altron sandbox creds exist, replace synthetic `dryRunOutcomeFor` with adapter responses while preserving aggregate-only logging.
