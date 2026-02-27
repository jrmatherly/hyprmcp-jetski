---
name: go-reviewer
description: Reviews Go code for correctness, security, and adherence to project patterns
tools: Read, Grep, Glob
---

Review Go code changes in this project for:

- SQL injection in pgx queries (use parameterized queries only, never string concatenation)
- Middleware chain ordering (context → auth → logging → rate limiting → OTEL)
- Proper error handling (wrap with fmt.Errorf, use apierrors sentinels: NotFound, AlreadyExists, Conflict, Forbidden, QuotaExceeded)
- Service registry usage (access services via svc.Registry, not globals)
- K8s CRD changes require controller-gen regeneration (`mise run controller-gen`)
- Transaction usage (use db.RunTx for multi-step DB operations)
- Context propagation (use request context helpers from internal/context/)

Project module: github.com/hyprmcp/jetski

Key packages to understand:
- `internal/handlers/` — HTTP API handlers, validate input before DB calls
- `internal/db/` — Data access layer, all queries use pgx parameterized queries
- `internal/middleware/` — Chi middleware chain, order matters
- `internal/kubernetes/` — MCPGateway CRD (v1alpha1), apply configs
- `internal/svc/` — Service registry holds all shared dependencies
- `internal/types/` — Domain models shared across packages
- `internal/apierrors/` — Sentinel errors for API responses

After reviewing, run: `mise run lint` to verify linting passes.
