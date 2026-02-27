---
name: upgrade-deps
description: Guided dependency upgrade workflow for Go or frontend packages with lockstep bumping and CI verification
disable-model-invocation: true
---

# Upgrade Dependencies

Guided workflow for coordinating dependency upgrades across this Go + Angular monorepo.

## Usage

```
/upgrade-deps [go|frontend|all] [package-name]
```

Examples:
- `/upgrade-deps go go.opentelemetry.io/otel` — upgrade a specific Go dependency
- `/upgrade-deps frontend @angular/core` — upgrade a specific frontend package
- `/upgrade-deps all` — check both Go and frontend for available upgrades

## Go Dependency Upgrade

### Step 1: Identify available upgrades

```bash
go list -m -u all 2>/dev/null | grep '\[' | head -30
```

If a specific package was requested, filter to that package and its related modules.

### Step 2: Check for tightly-coupled packages

These package groups MUST be bumped together:

| Group | Packages |
|-------|----------|
| **OpenTelemetry core** | `go.opentelemetry.io/otel`, `otel/sdk`, `otel/trace`, `otel/metric`, exporters |
| **OpenTelemetry contrib** | `go.opentelemetry.io/contrib/instrumentation/...` (otelhttp, otelaws) |
| **AWS SDK v2** | `github.com/aws/aws-sdk-go-v2` and all `aws-sdk-go-v2/service/*` packages |
| **Kubernetes** | `k8s.io/api`, `k8s.io/apimachinery`, `k8s.io/client-go`, `k8s.io/cli-runtime` |

When upgrading any package in a group, upgrade ALL packages in that group to compatible versions.

### Step 3: Upgrade

```bash
go get <package>@<version>  # repeat for each package in the group
go mod tidy                 # clean up transitive deps
```

### Step 4: Verify

```bash
go build ./...
golangci-lint run
mise run test
```

### Step 5: Check for new gosec findings

If `golangci-lint run` reports new gosec findings in upstream code, add exclusion rules to `.golangci.yml` and document them in `.scratchpad/TODO.md` (local-only, not committed).

## Frontend Dependency Upgrade

### Step 1: Check for available upgrades

```bash
npm outdated
```

### Step 2: Check for peer dependency constraints

Angular packages must all be on the same major version. Check:
- `@angular/*` packages
- `@spartan-ng/*` packages (check compatibility with Angular version)
- `angular-eslint` (must match Angular major)

### Step 3: Upgrade

```bash
pnpm add <package>@<version>     # for runtime deps
pnpm add -D <package>@<version>  # for dev deps
```

### Step 4: Verify

```bash
npm run build
npm run lint
npm test -- --watch=false
```

## Report

After completing upgrades, summarize:

```
Dependency Upgrade Results
──────────────────────────
Packages upgraded: <list with old → new versions>
Lockstep groups:   <any groups bumped together>
Build:             PASS / FAIL
Lint:              PASS / FAIL
Tests:             PASS / FAIL
──────────────────────────
New gosec exclusions: <any added to .golangci.yml>
```
