---
name: dev-standards
description: Development discipline guardrails for Go and Angular work. Use when implementing features, fixing bugs, or writing validation code. Enforces validation-first development, research escalation after repeated failures, real data testing, and comprehensive failure reporting.
---

# Development Standards

Behavioral guardrails for disciplined development in this Go + Angular/TypeScript monorepo.

## Core Priority Order

1. **Working code** — functionality first
2. **Validation** — prove it works with real data
3. **Readability** — clear, maintainable code
4. **Static analysis** — address linter warnings only after code works

## Validation-First Development

**Never address linter warnings before functionality is verified.** A function that passes `golangci-lint` but produces wrong output is worse than one with lint warnings that works correctly.

### Go validation pattern

Every new or modified function should be testable via `mise run test`. When writing exploratory validation:

```go
func TestFeatureName(t *testing.T) {
    // Use real data, not mocked inputs
    result, err := DoThing(realInput)
    if err != nil {
        t.Fatalf("unexpected error: %v", err)
    }
    // Assert against concrete expected values
    if result.Field != "expected" {
        t.Errorf("got %q, want %q", result.Field, "expected")
    }
}
```

### Angular validation pattern

Test with real service behavior. When validating UI components:

```typescript
it('should load projects from context', () => {
  // Use realistic test data matching API shape
  const mockProjects = [{ name: 'test-project', organizationId: '...' }];
  // Assert against specific expected state
  expect(component.projects()).toEqual(mockProjects);
});
```

## Research Escalation Rule

**After 3 consecutive failed approaches to the same problem, STOP and research externally.**

1. First attempt fails → try a different approach
2. Second attempt fails → reconsider assumptions
3. Third attempt fails → **mandatory research**: use web search, official docs, or MCP tools (Context7, Angular MCP, Microsoft Learn) to find current best practices

Document what you found in a code comment or commit message so future sessions don't repeat the cycle.

## No Mocking Core Functionality

- **Never mock** the service, handler, or component under test
- **Do mock** external boundaries: HTTP clients, database connections, Kubernetes API
- **Use real data** that matches production shapes — not `{"foo": "bar"}` placeholders
- For Go: prefer table-driven tests with realistic inputs from `test-data.yaml` or actual API responses
- For Angular: use `HttpTestingController` for HTTP, real signals for component state

## Module Size Discipline

- **Go**: Keep files under ~500 lines. If a file grows beyond that, extract a focused sub-package
- **Angular**: One component per file. Services should have a single responsibility
- **SQL migrations**: One logical change per migration pair. Don't bundle unrelated schema changes

## Comprehensive Failure Reporting

When running validation or tests, **always report ALL failures**, not just the first one.

### In CI output

```
# Bad — stops at first failure, hides remaining issues
FAIL: TestAuth — expected 200, got 401
--- FAIL

# Good — shows the full picture
FAIL: TestAuth — expected 200, got 401
FAIL: TestProjectCreate — missing required field "name"
FAIL: TestOrgSettings — unauthorized for non-admin
--- 3 of 12 tests failed
```

### In Go tests

Use `t.Errorf` (continues) instead of `t.Fatalf` (stops) when checking multiple independent assertions in one test. Reserve `t.Fatalf` for setup failures that make remaining assertions meaningless.

## Pre-Completion Checklist

Before declaring work complete, verify:

- [ ] Functionality works with real or realistic data
- [ ] `mise run lint` passes (Go changes)
- [ ] `npm run lint` passes (frontend changes)
- [ ] `mise run test` passes (Go changes)
- [ ] `npm test -- --watch=false` passes (frontend changes)
- [ ] No hardcoded secrets, tokens, or credentials in source
- [ ] New files follow existing naming and structure conventions
- [ ] SQL migrations have matching up/down pairs (`hack/validate-migrations.sh`)
- [ ] Changes don't break the build: `npm run build` for frontend

## What This Skill Does NOT Cover

- **Project architecture** — see `CLAUDE.md` for architecture overview
- **Component scaffolding** — use `/new-component` skill
- **Migration creation** — use `/new-migration` skill
- **Full deploy validation** — use `/deploy-check` skill
