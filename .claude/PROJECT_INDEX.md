# Jetski - Project Index

> **Auto-generated**: 2026-02-27 | **Version**: 0.6.0 | **Repo**: `jrmatherly/hyprmcp-jetski` | **Module**: `github.com/hyprmcp/jetski`

## Overview

| Metric | Value |
|--------|-------|
| Go packages | 26 |
| Go source files | 85 (6,277 lines) |
| TypeScript files | 151 (9,228 lines) |
| Angular components | 37 |
| Helm UI libraries | 16 |
| SQL migrations | 7 (0-6) |
| DB tables | 8 + 2 enums |
| API routes | 19 authenticated + 1 internal + 1 webhook |
| CI workflows | 4 |

## Stack

| Layer | Technology |
|-------|-----------|
| Backend | Go 1.25, Chi router, pgx/v5, lestrrat-go/jwx/v3, OpenTelemetry, Sentry |
| Frontend | Angular 21 (zoneless), Spartan UI + Helm, Tailwind CSS 4, ng-icons/lucide |
| Database | PostgreSQL 17 via pgx, golang-migrate |
| Auth | Dex OIDC (federated), JWT validation |
| Kubernetes | MCPGateway CRD (v1alpha1), metacontroller |
| CI/CD | GitHub Actions (CodeQL, govulncheck, golangci-lint, release-please) |

## Go Packages (`internal/`)

| Package | Description | Files |
|---------|-------------|-------|
| `analytics` | Usage analytics queries (overview, tools, prompts, sessions, clients) | 8 |
| `apierrors` | Sentinel errors: NotFound, AlreadyExists, Conflict, Forbidden, QuotaExceeded | 1 |
| `auth` | Auth types (UserAuthInfo) | 1 |
| `buildconfig` | Build metadata (version, commit, release flag) | 1 |
| `cmd` | Cobra CLI: `serve`, `migrate`, `generate` | 4 |
| `context` | Request context accessors (DB, logger, mailer, user, token, IP) | 1 |
| `db` | PostgreSQL data access (CRUD for all domain types) | 8 |
| `db/queryable` | Queryable interface for DB abstraction | 1 |
| `env` | Environment variable accessors for all config | 3 |
| `envparse` | Typed env var parsing (float, duration, mail address) | 1 |
| `envutil` | Generic env utilities (GetEnv, RequireEnv, generics) | 1 |
| `frontend` | Embedded Angular build (`BrowserFS()`) | 1 |
| `gatewayconfig` | MCP Gateway YAML config parser | 1 |
| `handlers` | HTTP API handlers + routers (context, orgs, projects, dashboard, webhooks) | 17 |
| `kubernetes` | MCPGateway CRD, controller, apply configs | 12 |
| `lists` | Pagination and sorting helpers | 1 |
| `mail` | Mailer interface + SMTP/SES/noop implementations | 5 |
| `mailsending` | Email workflows (invitations) | 1 |
| `mailtemplates` | HTML email templates | 1 |
| `middleware` | Chi middleware: auth, logging, context, rate limiting, OTEL, Sentry | 1 |
| `migrations` | Database migration runner (golang-migrate) | 1 |
| `routing` | Chi router assembly | 1 |
| `server` | HTTP server with graceful shutdown | 2 |
| `svc` | Service registry (DB pool, logger, tracers, JWT keyset, mailer, K8s) | 8 |
| `tracers` | OpenTelemetry tracer setup | 1 |
| `types` | Domain models (Organization, Project, User, DeploymentRevision, MCPServerLog) | 7 |
| `util` | Generic helpers (Must, PtrTo, Require) | 2 |

## API Routes

### Authenticated (`/api/v1/`, JWT + rate limiting)

| Method | Path | Handler |
|--------|------|---------|
| GET | `/context/` | getContextHandler |
| GET | `/verify-mcp-endpoint` | verifyMcpEndpointHandler |
| GET | `/organizations/` | getOrganizations |
| POST | `/organizations/` | postOrganizationHandler |
| PUT | `/organizations/{organizationId}` | putOrganizationHandler |
| GET | `/organizations/{organizationId}/members` | getOrganizationMembers |
| PUT | `/organizations/{organizationId}/members` | putOrganizationMember |
| DELETE | `/organizations/{organizationId}/members/{userId}` | deleteOrganizationMember |
| GET | `/projects/` | getProjects |
| POST | `/projects/` | postProjectHandler |
| GET | `/projects/{projectId}` | getProjectSummary |
| DELETE | `/projects/{projectId}` | deleteProjectHandler |
| GET | `/projects/{projectId}/status` | getProjectStatusHandler |
| GET | `/projects/{projectId}/logs` | getLogsForProject |
| GET | `/projects/{projectId}/prompts` | getPromptsForProject |
| GET | `/projects/{projectId}/deployment-revisions` | getDeploymentRevisionsForProject |
| GET | `/projects/{projectId}/analytics` | getAnalytics |
| PUT | `/projects/{projectId}/settings` | putProjectSettings |
| GET | `/dashboard/projects` | getProjectsForDashboard |
| GET | `/dashboard/deployment-revisions` | getDeploymentRevisionsForDashboard |
| GET | `/dashboard/usage` | getUsageForDashboard |

### Internal (`/internal/`)

| Method | Path | Handler |
|--------|------|---------|
| GET | `/environment` | getFrontendEnvironmentHandler |

### Webhooks (port 8085)

| Method | Path | Handler |
|--------|------|---------|
| POST | `/webhook/proxy/{deploymentRevisionID}` | gateway.NewHandler |

## Database Schema

### Tables

| Table | Key Columns | Notes |
|-------|------------|-------|
| `Organization` | id, name, settings_authorization_dcr_public_client, settings_custom_domain | Unique name |
| `UserAccount` | id, email | Unique email |
| `Organization_UserAccount` | organization_id, user_account_id | Join table |
| `Project` | id, name, organization_id, created_by, latest_deployment_revision_id | Unique (org, name) |
| `DeploymentRevision` | id, project_id, created_by, port, oci_url, proxy_url, authenticated, telemetry | Cascades from Project |
| `DeploymentRevisionEvent` | id, deployment_revision_id, type | Enum: ok/error/progressing |
| `MCPServerLog` | id, deployment_revision_id, project_id, mcp_session_id, started_at, duration, mcp_request, mcp_response | JSONB request/response |
| `ContextProperty` | id, project_id, type, name, required | Enum: string/number/boolean |
| `Context` | id, auth_token_digest, user_account_id, context_property_id, context_property_value | JSONB value |

### Migrations (0-6)

| # | Description |
|---|-------------|
| 0 | Initial schema (all tables, enums, indexes) |
| 1 | Add telemetry flag to DeploymentRevision |
| 2 | Add started_at index on MCPServerLog |
| 3 | Add DCR public client setting to Organization |
| 4 | Add custom domain to Organization |
| 5 | Add ON DELETE CASCADE to all foreign keys |
| 6 | Add project_id to MCPServerLog (denormalized) |

## Frontend Components

### Root & Layout
- `App` — root component
- `AppShellComponent` — layout shell (header + navigation + router outlet)

### Shared Components
- `HeaderComponent` — top nav bar with org/project selector
- `NavigationComponent` — side navigation
- `TableComponent<T>` — generic data table (TanStack)
- `TableHeadSortButtonComponent` / `TableHeadSelectionComponent` / `TableRowSelectionComponent`
- `UsageCardComponent` — dashboard usage card
- `UpsellWrapperComponent` — feature upsell wrapper
- `DeploymentRevisionComponent` / `ProjectDeploymentsComponent` / `OrganizationDeploymentsComponent`
- `ProjectsGridComponent` — project cards grid

### Pages
- `HomeComponent` — redirect to default org/project
- `OnboardingComponent` — first-time setup
- `NewProjectComponent` — create project form
- `OrganizationDashboardComponent` — org overview
- `OrganizationSettingsComponent` — settings shell (general, auth, members sub-tabs)
- `ProjectSettingsGeneralComponent` — project settings
- `ProjectDashboardComponent` — project analytics dashboard
- `ProjectCheckComponent` — project health check
- `LogsComponent` — MCP server logs viewer
- `PromptsComponent` — MCP prompts viewer
- `MonitoringComponent` — monitoring dashboard

### Analytics Widgets
- `OverviewComponent` — summary metrics
- `ClientUsageComponent` — client usage charts
- `ToolAnalyticsComponent` / `ToolsPerformanceComponent` — tool metrics
- `RecentSessionsComponent` — session history
- `PromptAnalyticsComponent` — prompt usage

### Helm UI Libraries (16)

| Library | Components |
|---------|-----------|
| ui-alert-helm | HlmAlert, HlmAlertDescription, HlmAlertIcon, HlmAlertTitle |
| ui-button-helm | HlmButton |
| ui-card-helm | HlmCard, HlmCardContent, HlmCardDescription, HlmCardFooter, HlmCardHeader, HlmCardTitle |
| ui-checkbox-helm | HlmCheckbox |
| ui-dialog-helm | HlmDialog, HlmDialogClose, HlmDialogContent, HlmDialogDescription, HlmDialogFooter, HlmDialogHeader, HlmDialogOverlay, HlmDialogTitle, HlmDialogService |
| ui-icon-helm | HlmIcon |
| ui-input-helm | HlmInput, HlmInputError |
| ui-label-helm | HlmLabel |
| ui-menu-helm | HlmMenu, HlmMenuBar, HlmMenuBarItem, HlmMenuGroup, HlmMenuItem, HlmMenuItemCheck, HlmMenuItemCheckbox, HlmMenuItemIcon, HlmMenuItemRadio, HlmMenuLabel, HlmMenuSeparator, HlmMenuShortcut, HlmSubMenu |
| ui-select-helm | HlmSelect, HlmSelectContent, HlmSelectGroup, HlmSelectLabel, HlmSelectOption, HlmSelectScrollDown, HlmSelectScrollUp, HlmSelectTrigger, HlmSelectValueTemplate |
| ui-sonner-helm | HlmToaster |
| ui-spinner-helm | HlmSpinner |
| ui-table-helm | HlmTable, HlmCaption, HlmTHead, HlmTBody, HlmTFoot, HlmTr, HlmTh, HlmTd |
| ui-tooltip-helm | HlmTooltip, HlmTooltipTrigger |
| ui-typography-helm | HlmH1-H4, HlmP, HlmBlockquote, HlmCode, HlmLarge, HlmLead, HlmMuted, HlmSmall, HlmUl |
| ui-utils-helm | hlm (Tailwind class merge utility) |

## CI/CD Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `build.yaml` | Push to main/tags, PRs | Lint (Go+TS), build frontend, Docker build+push, Cosign signing |
| `release-please.yaml` | Push to main | Automated release PR from conventional commits |
| `security.yaml` | Push to main, PRs, weekly | CodeQL (Go+TS), govulncheck, SARIF upload |
| `semantic-pr.yaml` | PR open/edit | Validate PR title matches conventional commits |

## Claude Code Automations

### Hooks
- **Format on save**: Prettier (TS/HTML/CSS), goimports/gofmt (Go)
- **Block edits**: Lock files, generated files, existing migrations (0-6), secret env files

### Subagents
- `go-reviewer` — Go code correctness, security, project patterns
- `angular-reviewer` — Angular component conventions, bundle discipline
- `migration-reviewer` — SQL migration safety (up/down pairing, idempotency)
- `security-reviewer` — Security vulnerabilities (log injection, SQL injection, SSRF, XSS, auth bypass)

### Skills
- `/new-component <name>` — Scaffold Angular standalone component
- `/new-migration <desc>` — Scaffold SQL migration pair
- `/deploy-check` — Full pre-deployment validation
- `/upgrade-deps [go|frontend|all]` — Guided dependency upgrades
- `/security-check [go|frontend|all]` — Local security analysis
- `dev-standards` — Development discipline guardrails (auto-invoked)

### MCP Servers
- `postgres` — Local DB schema introspection
- `angular` — Official Angular CLI MCP
- See `.example.mcp.json` for additional recommended servers (context7, GitHub)
