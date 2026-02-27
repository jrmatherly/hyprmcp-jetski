---
name: security-check
description: Run local security checks (golangci-lint gosec, go vet) before pushing to catch issues before CI
disable-model-invocation: true
---

# Security Check

Run local security analysis to catch issues before CI. Mirrors what CodeQL, govulncheck, and gosec check in the GitHub Actions pipeline.

## Usage

```
/security-check [go|frontend|all]
```

Default: `all`

## Go Security Checks

### Step 1: Static analysis with gosec (via golangci-lint)

```bash
golangci-lint run
```

This runs gosec along with other linters configured in `.golangci.yml`. Any new findings in upstream code should be suppressed with exclusion rules, not code changes.

### Step 2: Go vet

```bash
go vet ./...
```

### Step 3: Check for known vulnerable dependencies

```bash
go install golang.org/x/vuln/cmd/govulncheck@latest 2>/dev/null
govulncheck ./...
```

If govulncheck reports a vulnerability, check if the vulnerable code path is actually called. govulncheck uses call-graph analysis — only real invocations trigger alerts.

### Step 4: Manual pattern checks

Search for common security anti-patterns in changed files:

```bash
# Log injection: user-controlled values logged without sanitization
git diff --name-only HEAD~1 -- '*.go' | xargs grep -n 'zap\.\(String\|Any\).*r\.\(URL\|Header\|Form\|Body\)' 2>/dev/null

# SQL injection: string concatenation in queries
git diff --name-only HEAD~1 -- '*.go' | xargs grep -n 'fmt\.Sprintf.*SELECT\|fmt\.Sprintf.*INSERT\|fmt\.Sprintf.*UPDATE\|fmt\.Sprintf.*DELETE' 2>/dev/null

# Hardcoded secrets
git diff --name-only HEAD~1 -- '*.go' '*.ts' | xargs grep -in 'password\s*=\s*"[^"]\+"\|secret\s*=\s*"[^"]\+"\|token\s*=\s*"[^"]\+"\|api_key\s*=\s*"[^"]\+' 2>/dev/null
```

## Frontend Security Checks

### Step 1: Lint (includes security-relevant ESLint rules)

```bash
npm run lint
```

### Step 2: Audit dependencies

```bash
npm audit
```

### Step 3: Manual pattern checks

```bash
# innerHTML usage (XSS risk)
git diff --name-only HEAD~1 -- '*.ts' '*.html' | xargs grep -n 'innerHTML\|bypassSecurityTrust' 2>/dev/null
```

## Report

```
Security Check Results
──────────────────────
Go gosec (golangci-lint): PASS / FAIL / <N> findings
Go vet:                   PASS / FAIL
govulncheck:              PASS / FAIL / <N> vulnerabilities
Pattern checks (Go):      CLEAN / <N> warnings
Frontend lint:            PASS / FAIL
npm audit:                CLEAN / <N> advisories
Pattern checks (FE):      CLEAN / <N> warnings
──────────────────────
Result: SECURE / NEEDS ATTENTION
```

If any step reports findings, list each one with file, line, and description. For gosec findings in upstream code, recommend adding exclusion rules to `.golangci.yml`.
