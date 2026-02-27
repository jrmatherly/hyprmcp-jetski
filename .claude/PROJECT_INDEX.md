# Jetski - Project Index

> **Auto-generated**: 2026-02-27 | **Version**: 0.4.4 | **Repo**: `jrmatherly/hyprmcp-jetski` | **Module**: `github.com/hyprmcp/jetski`

## Overview

Jetski is an **MCP (Model Context Protocol) Gateway** management platform. It provides a web UI and backend server for managing MCP gateway deployments on Kubernetes, with multi-tenant organization support, analytics, monitoring, and deployment management.

> **Fork note**: This is `jrmatherly/hyprmcp-jetski`, forked from `hyprmcp/jetski`. The Go module path is intentionally kept as `github.com/hyprmcp/jetski`. Brand identity uses `apollosai` / `apollosai.dev`. See `.scratchpad/TODO.md` for remaining migration tasks.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | Angular (zoneless, standalone) | 20 |
| UI Library | Spartan UI (Brain + Helm) | 0.0.1-alpha.486 |
| Styling | Tailwind CSS | 4 |
| Icons | ng-icons + Lucide | 32 |
| Tables | TanStack Angular Table | 8 |
| Charts | Chart.js via ng2-charts | 4/8 |
| Auth (FE) | angular-oauth2-oidc | 20 |
| Backend | Go | 1.25 |
| CLI | Cobra | 1.10 |
| HTTP Router | Chi | 5.2 |
| Database | PostgreSQL via pgx | 5.7 |
| Migrations | golang-migrate | 4.19 |
| Kubernetes | client-go + controller-runtime + metacontroller | 0.34/0.22 |
| JWT | lestrrat-go/jwx | 3.0 |
| Observability | OpenTelemetry + Sentry | 1.38/0.36 |
| Logging | Zap | 1.27 |
| Email | AWS SES + go-mail | — |
| Task Runner | mise | — |
| Package Manager | pnpm | 10 |
| Container | Docker (distroless) | — |
| CI/CD | GitHub Actions + Release Please | — |

---

## Project Structure

```
jetski/
├── main.go                          # Go entrypoint → cmd.NewRoot().Execute()
├── go.mod / go.sum                  # Go module (github.com/hyprmcp/jetski)
├── package.json                     # Node.js/Angular config (pnpm)
├── angular.json                     # Angular workspace config
├── tsconfig.json                    # TypeScript strict config
├── eslint.config.cjs                # ESLint + Prettier + Angular rules
├── mise.toml                        # Task runner (serve, test, lint, migrate, etc.)
├── Dockerfile                       # Multi-stage Go build → distroless
├── docker-compose.yaml              # Local dev: Dex + PostgreSQL + Mailpit
├── .scratchpad/TODO.md              # Fork migration TODOs
├── CLAUDE.md                        # AI assistant instructions
├── CONTRIBUTING.md                  # Developer setup guide
├── .mcp.json                        # MCP servers (postgres, angular)
├── .claude/                         # Claude Code automations
│   ├── settings.json                # Hooks: auto-format TS/Go, block lock/secret/generated files
│   ├── agents/                      # go-reviewer, angular-reviewer, migration-reviewer subagents
│   └── skills/                      # /new-component, /deploy-check, /new-migration skills
├── internal/                        # Go backend packages (28 packages)
├── projects/ui/                     # Angular frontend application
├── hack/                            # Build/release utility scripts
└── .github/workflows/               # CI/CD pipelines
```

---

## Frontend (Angular 20)

### Architecture

- **Zoneless** change detection (`provideZonelessChangeDetection()`)
- **Standalone components** — no NgModules
- **Inline templates** for component co-location
- **Angular Signals** for reactive state
- **OAuth2/OIDC** via Dex for authentication
- **Bundle strategy**: Initial shell + lazy-loaded authenticated routes

### Component Inventory

#### Root & Shell
| File | Class | Purpose |
|------|-------|---------|
| `app.ts` | `App` | Root component, initializes Sentry/PostHog analytics |
| `app-shell.component.ts` | `AppShellComponent` | Layout shell: header + nav + router-outlet + toaster |
| `app.config.ts` | — | Providers: zoneless, OAuth2, Sentry, HTTP interceptors |
| `app.routes.ts` | — | Top-level routes with `authGuard` (OAuth2 token validation) |
| `authenticated.routes.ts` | — | All authenticated routes (lazy-loaded bundle) |
| `auth.interceptor.ts` | `authInterceptor` | Handles 401 responses → logout + reload |

#### Services
| File | Class | Purpose |
|------|-------|---------|
| `services/context.service.ts` | `ContextService` | Organization/project context, selection state |
| `services/theme.service.ts` | `ThemeService` | Light/dark/system theme with localStorage persistence |

#### Pipes
| File | Class | Purpose |
|------|-------|---------|
| `pipes/color-pipe.ts` | `ColorPipe` | Maps numbers to Tailwind color classes (16-color rotation) |
| `pipes/relative-date-pipe.ts` | `RelativeDatePipe` | ISO dates → relative time ("2 hours ago") via date-fns |
| `pipes/highlight-json-pipe.ts` | `HighlightJsonPipe` | JSON syntax highlighting via highlight.js |

#### Shared Components
| Directory | Class | Purpose |
|-----------|-------|---------|
| `components/header/` | `HeaderComponent` | Fixed top header: logo, org/project switcher, theme toggle, user menu |
| `components/navigation/` | `NavigationComponent` | Horizontal tab bar: context-aware tabs (Overview, Logs, etc.) |
| `components/table/` | `TableComponent<T>` | Reusable TanStack table: sorting, pagination, column visibility |
| `components/table/` | `TableHeadSortButtonComponent<T>` | Sort toggle with arrows for table headers |
| `components/table/` | `TableHeadSelectionComponent<T>` | Header checkbox for row selection |
| `components/table/` | `TableRowSelectionComponent<T>` | Per-row checkbox for selection |
| `components/usage-card/` | `UsageCardComponent` | Shows projects, sessions, tool calls usage metrics |
| `components/projects-grid/` | `ProjectsGridComponent` | Grid of project cards with deployment status |
| `components/upsell-wrapper/` | `UpsellWrapperComponent` | Pro feature upsell banner with blurred content overlay |
| `components/deployments/` | `DeploymentRevisionComponent` | Single deployment revision: author, status, build #, time |
| `components/deployments/` | `ProjectDeploymentsComponent` | Full deployments page for a project |
| `components/deployments/` | `OrganizationDeploymentsComponent` | Recent deployments widget for org dashboard |

#### Page Components
| Route | Class | Purpose |
|-------|-------|---------|
| `/` | `HomeComponent` | Placeholder for accounts without organizations |
| `/onboarding` | `OnboardingComponent` | Organization creation form (first-time + new org flows) |
| `/:org` | `OrganizationDashboardComponent` | Org overview: usage card + projects grid |
| `/:org/settings` | `OrganizationSettingsComponent` | Settings layout with sidebar nav |
| `/:org/settings/` | `OrganizationSettingsGeneralComponent` | Org name + custom domain config |
| `/:org/settings/members` | `OrganizationSettingsMembersComponent` | Invite/manage members |
| `/:org/settings/authorization` | `OrganizationSettingsAuthorizationComponent` | OAuth2 DCR settings |
| `/:org/settings/project/:name` | `ProjectSettingsGeneralComponent` | Project config + deletion |
| `/:org/new` | `NewProjectComponent` | Project creation wizard with MCP URL validation |
| `/:org/project/:name` | `ProjectDashboardComponent` | Analytics dashboard: overview, tools, sessions, prompts |
| `/:org/project/:name/check` | `ProjectCheckComponent` | Post-creation provisioning status poller |
| `/:org/project/:name/logs` | `LogsComponent` | MCP call logs table with sorting/pagination |
| `/:org/project/:name/prompts` | `PromptsComponent` | Prompt analytics table |
| `/:org/project/:name/deployments` | `ProjectDeploymentsComponent` | Deployment history |
| `/:org/project/:name/monitoring` | `MonitoringComponent` | Health metrics, CPU/memory charts, alerts |

#### Dashboard Sub-Components (in `pages/project/dashboard/`)
| Class | Purpose |
|-------|---------|
| `OverviewComponent` | Summary metric cards |
| `PromptAnalyticsComponent` | Prompt usage analytics |
| `ToolsPerformanceComponent` | Tool performance chart |
| `ToolAnalyticsComponent` | Tool usage breakdown |
| `ClientUsageComponent` | Client/user analytics |
| `RecentSessionsComponent` | Recent sessions table |

### UI Component Library (`projects/ui/libs/ui/`)

16 Spartan/Helm packages built on `@spartan-ng/brain` + Tailwind CSS:

| Package | Components |
|---------|------------|
| `ui-alert-helm` | HlmAlert, HlmAlertTitle, HlmAlertIcon, HlmAlertDescription |
| `ui-button-helm` | HlmButton |
| `ui-card-helm` | HlmCard, HlmCardHeader, HlmCardTitle, HlmCardDescription, HlmCardContent, HlmCardFooter |
| `ui-checkbox-helm` | HlmCheckbox |
| `ui-dialog-helm` | HlmDialog, HlmDialogContent, HlmDialogHeader, HlmDialogFooter, HlmDialogTitle, HlmDialogDescription |
| `ui-icon-helm` | HlmIcon |
| `ui-input-helm` | HlmInput, HlmInputError |
| `ui-label-helm` | HlmLabel |
| `ui-menu-helm` | HlmMenu, HlmMenuItem, HlmMenuGroup, HlmMenuSeparator, HlmSubMenu |
| `ui-select-helm` | HlmSelect, HlmSelectTrigger, HlmSelectContent, HlmSelectOption |
| `ui-spinner-helm` | HlmSpinner |
| `ui-sonner-helm` | HlmToaster |
| `ui-table-helm` | HlmTable |
| `ui-tooltip-helm` | HlmTooltip, HlmTooltipTrigger |
| `ui-typography-helm` | HlmH1-H4, HlmP, HlmLead, HlmSmall, HlmLarge, HlmMuted, HlmCode, HlmBlockquote, HlmUl |
| `ui-utils-helm` | Utility functions (clsx, tailwind-merge) |

### Route Tree

```
AppShellComponent (canActivateChild: contextGuard)
├── ''                    → HomeComponent (redirectToDefaultPage)
├── 'onboarding'          → OnboardingComponent (onboardingGuard)
├── 'organizations/new'   → OnboardingComponent
└── ':organizationName'
    ├── ''                → OrganizationDashboardComponent (redirectOrgDashboardToProject)
    ├── 'settings'        → OrganizationSettingsComponent
    │   ├── ''            → OrganizationSettingsGeneralComponent
    │   ├── 'authorization' → OrganizationSettingsAuthorizationComponent
    │   ├── 'members'     → OrganizationSettingsMembersComponent
    │   └── 'project/:projectName' → ProjectSettingsGeneralComponent
    ├── 'new'             → NewProjectComponent
    └── 'project/:projectName'
        ├── ''            → ProjectDashboardComponent
        ├── 'check'       → ProjectCheckComponent
        ├── 'logs'        → LogsComponent
        ├── 'prompts'     → PromptsComponent
        ├── 'deployments' → ProjectDeploymentsComponent
        └── 'monitoring'  → MonitoringComponent
```

---

## Backend (Go 1.25)

### Package Inventory

| Package | Path | Purpose |
|---------|------|---------|
| **cmd** | `internal/cmd/` | Cobra CLI: `serve`, `migrate`, `generate` commands |
| **handlers** | `internal/handlers/` | HTTP route handlers for API, dashboard, webhooks |
| **handlers/webhook** | `internal/handlers/webhook/` | Webhook router + gateway/kubernetes/tls handlers |
| **middleware** | `internal/middleware/` | Auth, logging, context injection, rate limiting, OTEL, Sentry |
| **routing** | `internal/routing/` | Chi router setup: mounts API, internal, webhook, frontend routes |
| **server** | `internal/server/` | HTTP server with graceful shutdown |
| **svc** | `internal/svc/` | Service registry: DB pool, logger, tracers, JWT, mailer, K8s client |
| **db** | `internal/db/` | PostgreSQL data access (users, orgs, projects, logs, dashboard) |
| **db/queryable** | `internal/db/queryable/` | Abstract DB interface (Exec, Query, QueryRow, CopyFrom, Begin) |
| **types** | `internal/types/` | Domain models: Organization, Project, User, DeploymentRevision, MCPServerLog |
| **auth** | `internal/auth/` | Authentication types (UserAuthInfo) |
| **migrations** | `internal/migrations/` | Database migrations (7 migrations: initial → mcp log project_id) |
| **kubernetes** | `internal/kubernetes/` | MCPGateway CRD, controller installation, apply configs |
| **kubernetes/api** | `internal/kubernetes/api/v1alpha1/` | CRD type definitions (MCPGateway, ProjectSpec, AuthorizationSpec) |
| **env** | `internal/env/` | Environment variable loading (host, DB, OIDC, mailer, Sentry, gateway) |
| **envutil** | `internal/envutil/` | Env var helpers with defaults and validation |
| **envparse** | `internal/envparse/` | Custom parsers (Duration, ByteSlice, MailAddress, Float) |
| **gatewayconfig** | `internal/gatewayconfig/` | MCP proxy gateway configuration types |
| **analytics** | `internal/analytics/` | Analytics: overview, tools, prompts, performance, clients, sessions |
| **mail** | `internal/mail/` | Mail interface + SMTP/SES/noop implementations |
| **mailsending** | `internal/mailsending/` | Email sending logic (organization invitations) |
| **mailtemplates** | `internal/mailtemplates/` | Embedded email templates |
| **context** | `internal/context/` | Request context helpers (DB, logger, IP, user, mailer) |
| **apierrors** | `internal/apierrors/` | Sentinel errors (NotFound, AlreadyExists, Conflict, Forbidden, QuotaExceeded) |
| **lists** | `internal/lists/` | Pagination and sorting utilities |
| **util** | `internal/util/` | Must(), Require(), PtrTo(), PtrCopy(), PtrEq() |
| **frontend** | `internal/frontend/` | Embedded Angular frontend serving via BrowserFS() |
| **buildconfig** | `internal/buildconfig/` | Build-time version and commit info |
| **tracers** | `internal/tracers/` | OpenTelemetry tracer provider management |

### API Routes

```
/api/v1/
├── GET    /context                                    # App context
├── GET    /verify-mcp-endpoint                        # Verify MCP server connectivity
├── /organizations
│   ├── GET    /                                       # List user's organizations
│   ├── POST   /                                       # Create organization
│   └── /{organizationId}
│       ├── PUT    /                                   # Update org (custom domain, auth)
│       └── /members
│           ├── GET    /                               # List members
│           ├── PUT    /                               # Add member (invite)
│           └── DELETE /{userId}                       # Remove member
├── /projects
│   ├── GET    /                                       # List user's projects
│   ├── POST   /                                       # Create project
│   └── /{projectId}
│       ├── GET    /                                   # Project summary
│       ├── DELETE /                                   # Delete project
│       ├── GET    /status                             # Deployment status
│       ├── GET    /logs                               # MCP server logs (paginated)
│       ├── GET    /prompts                            # Prompt analytics
│       ├── GET    /deployment-revisions               # Deployment history
│       ├── GET    /analytics                          # Project analytics
│       └── PUT    /settings                           # Update project settings
└── /dashboard
    ├── GET    /projects                               # Project summaries
    ├── GET    /deployment-revisions                   # Recent deployments
    └── GET    /usage                                  # Usage statistics

/internal/
└── [Internal endpoints]

/webhook/
├── /sync                                              # Gateway sync webhook
├── /kubernetes                                        # Kubernetes webhook
└── /tlsask                                            # TLS certificate requests

/                                                      # Angular frontend (embedded)
```

### Database Schema (7 migrations)

| Migration | Purpose |
|-----------|---------|
| `0_initial` | Core schema: users, organizations, projects, deployment_revisions, org_user_accounts, mcp_server_log |
| `1_project_telemetry` | Add telemetry toggle to projects |
| `2_mcpserverlog_started_at_index` | Performance index on mcp_server_log |
| `3_organization_dcr_settings` | Dynamic Client Registration settings for orgs |
| `4_organization_custom_domain` | Custom domain support for organizations |
| `5_on_delete_cascade` | Foreign key cascading deletes |
| `6_mcpserverlog_project_id` | Associate MCP logs with projects |

### Kubernetes CRD

**MCPGateway** (`v1alpha1`):
- `MCPGatewaySpec`: Organization ID/name, custom domain, authorization settings, projects list
- `ProjectSpec`: Project ID, name, deployment revision, authentication/telemetry flags
- `AuthorizationSpec`: Dynamic client registration settings
- Managed by **metacontroller** (composite controller pattern)

---

## Infrastructure

### Local Development Setup

```bash
mise install                          # Install tools (node 24, pnpm 10, go 1.25, golangci-lint)
docker compose up -d                  # Start Dex + PostgreSQL + Mailpit
mise run serve && pnpm run start      # Launch backend (8080) + frontend (4200)
```

**Local Services** (docker-compose):
| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| Dex | ghcr.io/dexidp/dex:v2.45.0-alpine | 5556 (HTTP), 5557 (gRPC) | OIDC provider |
| PostgreSQL | postgres:17-alpine | 5432 | Database (user: local/local, db: jetski) |
| Mailpit | axllent/mailpit:v1.27.10 | 1025 (SMTP), 8025 (Web UI) | Email testing |

### CI/CD

**build.yaml** — Runs on push to `main`, tags, PRs:
1. Validate migrations
2. Prettier lint (frontend)
3. golangci-lint (backend)
4. Build Angular production bundle
5. Build multi-platform Docker images (amd64 + arm64)
6. Generate SBOM, sign with Cosign
7. Push to `ghcr.io/jrmatherly/hyprmcp-jetski`

**release-please.yaml** — Semantic versioning with conventional commits:
- Types: `feat`, `fix`, `chore`, `docs`, `perf`, `build`, `deps`, `ci`, `refactor`, `revert`, `style`, `test`
- Auto-generates changelogs and release PRs

**semantic-pr.yaml** — Enforces conventional commit PR titles

### Dependency Management (Renovate)

- Auto-merge: minor/patch for stable (>=1.0.0) deps
- Grouped: OpenTelemetry packages, Spartan UI packages
- Noisy deps (PostHog, Sentry, Fontsource): Monday 6-9 AM schedule

---

## Development Commands

### Frontend
| Command | Description |
|---------|-------------|
| `pnpm install` | Install dependencies |
| `npm start` | Dev server on http://localhost:4200 |
| `npm run build` | Production build |
| `npm test` | Unit tests (Karma) |
| `npm run format` | Prettier + ESLint fix |
| `npm run lint` | Check formatting/linting |

### Backend
| Command | Description |
|---------|-------------|
| `mise run serve` | Run Go backend server |
| `mise run test` | Run Go tests |
| `mise run lint` | golangci-lint (includes tidy + controller-gen) |
| `mise run migrate` | Run DB migrations |
| `mise run purge` | Rollback all migrations |
| `mise run generate` | Generate code (runs migrations first) |
| `mise run controller-gen` | Regenerate CRD objects |

### Kubernetes
| Command | Description |
|---------|-------------|
| `mise run minikube-start` | Start minikube + metacontroller |
| `mise run minikube-stop` | Stop minikube |

---

## Code Style & Conventions

### Frontend
- TypeScript **strict mode** with extra flags
- **CSS** (not SCSS) for all styling
- **Standalone components** only, inline templates
- **Signals** for state, **zoneless** change detection
- Component prefix: `app-` (kebab-case elements, camelCase directives)
- ng-icons: always use `viewProviders` with `provideIcons()`
- Bundle budgets: 500kB warning, 1MB error

### Backend
- Standard Go conventions, `internal/` packages
- **Service Locator** pattern via `svc.Registry`
- **Chi middleware chain**: context injection → auth → logging → rate limiting → OTEL
- **Transaction wrapper**: `db.RunTx()` for ACID operations
- **Embedded assets**: Angular frontend + K8s manifests compiled in

### Commit Style
Conventional commits: `type(scope): description`
- Examples: `feat(ui):`, `fix(api):`, `chore(deps):`, `docs:`, `perf:`

---

## Key Configuration Files

| File | Purpose |
|------|---------|
| `mise.toml` | Task runner + tool versions (node 24, pnpm 10, go 1.25, golangci-lint 2.8) |
| `angular.json` | Angular workspace: build output → `internal/frontend/dist/ui` |
| `tsconfig.json` | TypeScript strict config with path mappings |
| `eslint.config.cjs` | ESLint: angular-eslint + typescript-eslint + prettier |
| `.prettierrc.mjs` | Prettier: single quotes, trailing commas, organize-imports plugin |
| `components.json` | Spartan UI config: components in `projects/ui/libs/ui` |
| `docker-compose.yaml` | Local dev services: Dex (OIDC) + PostgreSQL + Mailpit |
| `.env.development.local` | Local env vars: DB URL, OIDC config, mailer, gateway config |
| `renovate.json` | Dependency update automation rules |
| `release-please-config.json` | Semantic versioning: Go release type, changelog sections |
| `.mcp.json` | MCP servers for Claude Code (postgres for local DB introspection) |
