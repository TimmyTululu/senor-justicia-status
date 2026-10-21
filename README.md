# Señor Justicia availability

Checks the public website, chat assets and API request validation once a day at 21:40 UTC (16:40 America/Cancun). This repository contains only a public-URL checker and its workflow: no application source, credentials, citizen conversations or analytics.

The check makes no AI model calls. A successful run confirms transport, assets and input validation; it does not establish model availability, credit balance or legal correctness. Model probes and billing checks are handled separately by authorized operations.

GitHub scheduling may be delayed or skipped. The daily schedule is a target, not a detection guarantee. Scheduled workflows in a public repository may be disabled after 60 days without repository activity; operations must check this state. GitHub Actions failure notifications depend on the recipient's notification settings. The initial controlled failure and recovery verified email delivery. Healthy runs remain silent.

The workflow is intended for a public repository using standard GitHub-hosted runners. Do not activate this schedule in a private repository without checking its billing coverage.

Run manually with `node check.mjs` or with the Public availability workflow's Run workflow button.
