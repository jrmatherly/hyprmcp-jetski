---
name: deploy-check
description: Run full pre-deployment validation for both frontend and backend
disable-model-invocation: true
---

# Deploy Check

Run the complete validation checklist for both frontend and backend. Execute each step sequentially and stop on first failure.

## Steps

1. **Frontend lint**: `npm run lint`
2. **Frontend tests**: `npm test -- --watch=false`
3. **Backend lint**: `mise run lint`
4. **Backend tests**: `mise run test`

## Output

Report results as a summary:

```
Deploy Check Results
────────────────────
Frontend lint:  PASS / FAIL
Frontend tests: PASS / FAIL
Backend lint:   PASS / FAIL
Backend tests:  PASS / FAIL
────────────────────
Result: READY / NOT READY
```

If any step fails, show the error output and stop. Do not continue to subsequent steps after a failure.
