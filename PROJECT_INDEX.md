# Project Index: Jetski

Generated: 2026-02-26 | Version: 0.4.4 | Module: `github.com/hyprmcp/jetski`

## Project Structure

```
jetski/
├── main.go                    # Go CLI entry → serve | migrate | generate
├── internal/                  # Go backend (28 packages, 84 files)
│   ├── cmd/                   # Cobra CLI commands
│   ├── handlers/              # HTTP API + webhook handlers
│   ├── middleware/             # Auth, logging, OTEL, rate limiting
│   ├── routing/               # Chi router setup
│   ├── server/                # HTTP server + graceful shutdown
│   ├── svc/                   # Service registry (DB, logger, JWT, mailer, K8s)
│   ├── db/                    # PostgreSQL data access (pgx)
│   ├── types/                 # Domain models (Org, Project, User, Log)
│   ├── kubernetes/            # MCPGateway CRD (v1alpha1) + controller
│   ├── analytics/             # Usage analytics (tools, prompts, sessions)
│   ├── migrations/            # 7 SQL migrations (initial → log project_id)
│   ├── auth/                  # JWT/OIDC auth types
│   ├── mail/                  # Pluggable mailer (SMTP/SES/noop)
│   ├── env/                   # Environment config loading
│   └── ...                    # context, apierrors, lists, util, frontend, tracers
├── projects/ui/               # Angular 20 frontend (51 TS files)
│   └── src/app/
│       ├── app.ts             # Root component (Sentry/PostHog init)
│       ├── app-shell.component.ts  # Layout: header + nav + outlet
│       ├── app.config.ts      # Zoneless, OAuth2, Sentry providers
│       ├── app.routes.ts      # Auth guard → lazy-load authenticated routes
│       ├── authenticated.routes.ts  # All app routes
│       ├── components/        # Shared: header, navigation, table, deployments
│       ├── pages/             # Route pages (15 page components)
│       ├── services/          # ContextService, ThemeService
│       ├── pipes/             # ColorPipe, RelativeDatePipe, HighlightJsonPipe
│       └── libs/ui/           # 16 Spartan/Helm UI component packages
├── .claude/                   # Claude Code automations
│   ├── settings.json          # Hooks: auto-format TS, block lock/secret files
│   ├── agents/                # go-reviewer, angular-reviewer
│   └── skills/                # /new-component, /deploy-check
├── hack/                      # Build scripts (sentry, migrations, version)
├── docker-compose.yaml        # Local dev: Dex + PostgreSQL + Mailpit
├── Dockerfile                 # Multi-stage → distroless
└── .github/workflows/         # CI: build, release-please, semantic-pr
```

## Entry Points

- **CLI**: `main.go` → `internal/cmd/root.go` (Cobra: `serve`, `migrate`, `generate`)
- **API Server**: `internal/cmd/serve.go` → HTTP :8080 + webhook :8085
- **Frontend**: `projects/ui/src/main.ts` → Angular app on :4200
- **Tests (Go)**: `go test ./...` (3 test files)
- **Tests (FE)**: `ng test` via Karma (1 spec file)

## Core Modules

### Backend (Go 1.25)
- **handlers**: REST API — orgs CRUD, projects CRUD, dashboard, analytics, MCP endpoint verify
- **middleware**: Auth (JWT/OIDC via Dex), logging, context injection, rate limiting, OTEL
- **db**: PostgreSQL via pgx — users, orgs, projects, deployment_revisions, mcp_server_log
- **svc**: Service registry pattern — holds DB pool, logger, tracers, JWT keyset, mailer, K8s client
- **kubernetes**: MCPGateway CRD (v1alpha1) managed by metacontroller
- **analytics**: Overview, tool performance, prompt analytics, client usage, recent sessions

### Frontend (Angular 20)
- **Pages**: Home, Onboarding, OrgDashboard, OrgSettings(3), NewProject, ProjectDashboard, ProjectCheck, Logs, Prompts, Deployments, Monitoring, ProjectSettings
- **Components**: Header (org/project switcher), Navigation (context tabs), Table (TanStack), UsageCard, ProjectsGrid, DeploymentRevision, UpsellWrapper
- **Services**: ContextService (org/project state), ThemeService (dark/light mode)
- **UI Lib**: 16 Spartan/Helm packages (alert, button, card, checkbox, dialog, icon, input, label, menu, select, spinner, sonner, table, tooltip, typography, utils)

## API Routes

```
/api/v1/context, /api/v1/verify-mcp-endpoint
/api/v1/organizations[/:id[/members[/:userId]]]
/api/v1/projects[/:id[/status|logs|prompts|deployment-revisions|analytics|settings]]
/api/v1/dashboard/[projects|deployment-revisions|usage]
/webhook/[sync|kubernetes|tlsask]
```

## Configuration

- `mise.toml`: Tools (node 24, pnpm 10, go 1.25, golangci-lint 2.8) + tasks
- `angular.json`: Build output → `internal/frontend/dist/ui`, budgets 500kB/1MB
- `docker-compose.yaml`: Dex (:5556), PostgreSQL (:5432), Mailpit (:1025/:8025)
- `.env.development.local`: DB URL, OIDC, mailer, gateway config
- `renovate.json`: Auto-merge stable deps, group OTEL/Spartan
- `release-please-config.json`: Go release type, conventional commits

## Key Dependencies

**Go**: chi (router), pgx (postgres), cobra (cli), jwx (jwt), otel (tracing), sentry, zap (logging), client-go (k8s)
**Node**: @angular/* 20, @spartan-ng/brain, @ng-icons/lucide, @tanstack/angular-table, chart.js, angular-oauth2-oidc, tailwindcss 4

## Quick Start

```bash
mise install                         # Install tool versions
docker compose up -d                 # Dex + PostgreSQL + Mailpit
mise run serve && npm start          # Backend :8080 + Frontend :4200
```

## Claude Code Automations

- **Hooks**: Auto-format TS/HTML/CSS on edit; block `pnpm-lock.yaml`, `go.sum`, `*.secret.env`
- **Subagents**: `go-reviewer` (Go patterns, SQL injection, K8s), `angular-reviewer` (standalone, zoneless, signals)
- **Skills**: `/new-component <name>` (scaffold), `/deploy-check` (full FE+BE validation)

## Dev Commands

| Command | Purpose |
|---------|---------|
| `npm run format` | Prettier + ESLint fix (frontend) |
| `npm run lint` | Check lint (frontend) |
| `npm test` | Karma unit tests (frontend) |
| `mise run lint` | golangci-lint (backend, includes tidy + controller-gen) |
| `mise run test` | `go test ./...` (backend) |
| `mise run migrate` | Run DB migrations |
| `mise run serve` | Run Go server |
