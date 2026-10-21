# Señor Justicia availability

Checks the public website, chat assets and API request validation every five minutes. This repository contains only a public-URL checker and its workflow: no application source, credentials, citizen conversations or analytics.

The check makes no AI model calls. A successful run confirms transport, assets and input validation; it does not establish model availability, credit balance or legal correctness. Model probes and billing checks are handled separately by authorized operations.

GitHub scheduling may be delayed or skipped. A five-minute schedule is a target, not a detection guarantee. Scheduled workflows in a public repository may be disabled after 60 days without repository activity; operations must check this state. GitHub Actions failure notifications depend on the recipient's notification settings. Verify a controlled failure and recovery before claiming alerts are delivered.

The workflow is intended for a public repository using standard GitHub-hosted runners. Do not activate this schedule in a private repository without checking its billing coverage.

Run manually with `node check.mjs` or with the Public availability workflow's Run workflow button.
