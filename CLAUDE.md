# CLAUDE.md

## Repository Identity

- **Repo**: `jrmatherly/hyprmcp-jetski` (fork of `hyprmcp/jetski`)
- **Go module path**: Kept as `github.com/hyprmcp/jetski` (148 refs across 59 Go files — intentionally not renamed)
- **Docker images**: `ghcr.io/jrmatherly/hyprmcp-jetski` (CI builds), `ghcr.io/jrmatherly/mcp-gateway` (gateway)
- **Brand for test data/emails**: `apollosai` / `apollosai.dev`
- **Fork migration TODOs**: See `.scratchpad/TODO.md`

## Development Commands

### Frontend

- `npm start` - Dev server on http://localhost:4200 (proxies `/api` and `/internal` to :8080)
- `npm run build` - Production build (outputs to `internal/frontend/dist/ui`, embedded in Go binary)
- `npm test` - Unit tests with Karma
- `npm run format` - Format with Prettier + fix ESLint issues
- `npm run lint` - Check formatting/linting without changes
- `pnpm install` - Install dependencies (this project uses **pnpm**, not npm, for package management)
- `pnpm add [-D] <package>` - Add a dependency

### Backend (via mise)

- `mise run serve` - Go backend server on http://localhost:8080
- `mise run serve -- --install-controller` - Serve with CRD + metacontroller config installed
- `mise run test` - Run Go tests (`go test ./...`)
- `mise run lint` - golangci-lint (depends on `tidy` and `controller-gen`)
- `mise run migrate` - Run database migrations
- `mise run purge` - Roll back all migrations
- `mise run generate` - Generate code (runs migrations first)
- `mise run controller-gen` - Regenerate Kubernetes CRD objects

### Local Development Setup

```bash
mise install                    # Install tools (node 24, pnpm 10, go 1.25, golangci-lint)
go install golang.org/x/tools/cmd/goimports@latest  # Go auto-format (used by Claude hook)
cp .dex.secret.env.example .dex.secret.env  # Fill in GitHub OAuth creds
docker compose up -d            # Start Dex (:5556), PostgreSQL (:5432), Mailpit (:1025/:8025)
mise run serve &                # Go backend on :8080
npm start                       # Angular dev server on :4200 (proxies API to :8080)
```

### Post-Change Checklist

- **Frontend changes**: Run `npm run format` then `npm run lint`
- **Go changes**: Run `mise run lint`
- **Kubernetes API/CRD changes**: Run `mise run controller-gen` then `mise run lint`
- **SQL migration changes**: Run `hack/validate-migrations.sh` to verify pairing/sequencing

### Commit Convention

Conventional commits enforced by CI. PR titles must use: `feat`, `fix`, `chore`, `docs`, `perf`, `refactor`, `deps`, `ci`, `test`, `build`, `style`, `revert`

### Claude Code Automations

- **Hooks** (`.claude/settings.json`):
  - Auto-formats TS/HTML/CSS on edit (Prettier)
  - Auto-formats Go on edit (`goimports` if available, falls back to `gofmt`)
  - Blocks edits to `pnpm-lock.yaml`, `go.sum`, `*.secret.env`
  - Blocks edits to controller-gen generated files (`zz_generated*`, `applyconfiguration/`)
  - A security reminder hook fires when editing `.github/workflows/*.yaml` — informational, not blocking
- **Subagents**: `go-reviewer` (Go code review), `angular-reviewer` (Angular conventions), `migration-reviewer` (SQL migration safety)
- **Skills**: `/new-component <name>` (scaffold Angular component), `/deploy-check` (full FE+BE validation), `/new-migration <desc>` (scaffold SQL migration pair)
- **MCP Servers** (`.mcp.json`): `postgres` (local DB schema introspection), `angular` (official Angular CLI MCP — docs, best practices, examples)

### Upstream Provenance

- Original project by Glasskube (glasskube.com). Legacy references to `glasskube`, `distr.sh`, `jetski-sh` orgs have been cleaned out.
- GitHub Actions workflows use SHA-pinned versions for supply chain security. When updating, look up the exact commit SHA for each release tag.
- Dex OIDC uses official `ghcr.io/dexidp/dex` image. Upstream had custom Tailwind-styled login UI — see `.scratchpad/TODO.md` for custom build task.

## Architecture Overview

### Frontend (Angular 20)

- **Zoneless** change detection (`provideZonelessChangeDetection()`)
- **Standalone components** only (no NgModules)
- **Spartan UI** (`@spartan-ng/brain` + custom Helm directives) with **Tailwind CSS 4**
- **CSS** (not SCSS) for all styling, HSL custom properties for light/dark theming
- **Signals** for reactive state, inline templates for component co-location
- Component prefix: `app-`, budget: 500kB warning / 1MB error
- Environment files: `projects/ui/src/env/env.ts` (dev) / `env.prod.ts` (prod)

### Frontend Structure

```
projects/ui/src/app/
├── app.ts / app-shell.component.ts    # Root + layout shell
├── app.config.ts                      # Providers (zoneless, OAuth2, Sentry)
├── app.routes.ts                      # Auth guard → lazy-loads authenticated.routes
├── authenticated.routes.ts            # All authenticated routes
├── components/                        # Shared: header, navigation, table, deployments, etc.
├── pages/                             # Route pages (org dashboard, project views, settings)
├── services/                          # ContextService (org/project state), ThemeService
├── pipes/                             # ColorPipe, RelativeDatePipe, HighlightJsonPipe
└── libs/ui/                           # 16 Spartan/Helm UI component packages
```

### Routes

```
/ → redirects to default org/project
AppShellComponent (canActivateChild: contextGuard)
├── /onboarding
├── /organizations/new
└── /:organizationName
    ├── / → OrgDashboard (redirects to project if only one)
    ├── /settings (general, authorization, members, project/:name)
    ├── /new → NewProject
    └── /project/:projectName
        ├── / → ProjectDashboard (analytics)
        ├── /check, /logs, /prompts, /deployments, /monitoring
```

### ng-icons Pattern

```typescript
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSun, lucideMoon } from '@ng-icons/lucide';

@Component({
  imports: [NgIcon],
  viewProviders: [provideIcons({lucideSun, lucideMoon})],  // Must be viewProviders, not providers
  template: `<ng-icon name="lucideSun" size="16" />`
})
```

### Backend (Go 1.25)

- **Module**: `github.com/hyprmcp/jetski`
- **Entry point**: `main.go` → `internal/cmd/root.go` (Cobra CLI: `serve`, `migrate`, `generate`)
- **HTTP Router**: Chi with middleware chain: Context injection → Auth (JWT/OIDC) → Logging → Rate limiting → OTEL
- **Service Registry**: `internal/svc/Registry` (DB pool, logger, tracers, JWT keyset, mailer, K8s client)
- **Database**: PostgreSQL via pgx, 7 migrations in `internal/migrations/sql/`
- **Migration naming**: `{N}_{description}.up.sql` + `.down.sql` (0-indexed, sequential, no gaps)
- **Kubernetes**: MCPGateway CRD (v1alpha1), managed by metacontroller
- **Frontend embedding**: Angular build embedded into Go binary via `internal/frontend/BrowserFS()`
- **Auth**: Dex (federated OIDC provider), configured in `docker-compose.yaml`

### Backend Packages

- `internal/cmd/` - Cobra CLI commands
- `internal/handlers/` - HTTP API + webhook handlers
- `internal/middleware/` - Auth, logging, context injection, rate limiting, OTEL, Sentry
- `internal/routing/` - Chi router setup
- `internal/server/` - HTTP server with graceful shutdown
- `internal/svc/` - Service registry
- `internal/db/` - PostgreSQL data access
- `internal/types/` - Domain models (Organization, Project, User, DeploymentRevision, MCPServerLog)
- `internal/kubernetes/` - MCPGateway CRD, controller, apply configs
- `internal/analytics/` - Usage analytics (overview, tools, prompts, sessions, clients)

### API Routes

All under `/api/v1/`, JWT-authenticated:

- `/context` - App context (orgs, projects, user)
- `/verify-mcp-endpoint` - Validate MCP server URL
- `/organizations[/:id]` - CRUD + `/members` sub-resource
- `/projects[/:id]` - CRUD + `/status`, `/logs`, `/prompts`, `/deployment-revisions`, `/analytics`, `/settings`
- `/dashboard/projects`, `/dashboard/deployment-revisions`, `/dashboard/usage`
- Webhooks on port 8085: `/sync`, `/kubernetes`, `/tlsask`
