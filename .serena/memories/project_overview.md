# Jetski - Project Overview

## Purpose
Jetski is an **MCP (Model Context Protocol) Gateway** management platform. It provides a web UI and backend server for managing MCP gateway deployments on Kubernetes. The platform supports multi-tenant organizations with projects, monitoring, logs, and deployment management.

## Tech Stack

### Frontend (Angular 20)
- **Framework**: Angular 20 with zoneless change detection (`provideZonelessChangeDetection()`)
- **Architecture**: Standalone components (no NgModules)
- **UI Library**: Spartan UI (`@spartan-ng/brain`) with custom helm directives
- **Styling**: Tailwind CSS 4 with CSS custom properties for theming (light/dark mode)
- **Icons**: ng-icons with Lucide icon set (`@ng-icons/lucide`)
- **State**: Angular Signals for reactive state management
- **Auth**: `angular-oauth2-oidc` with Dex as OIDC provider
- **Tables**: TanStack Angular Table
- **Charts**: Chart.js via ng2-charts
- **Notifications**: ngx-sonner (toast notifications)
- **Analytics**: PostHog, Sentry
- **Package Manager**: pnpm

### Backend (Go 1.25)
- **CLI Framework**: Cobra (`spf13/cobra`)
- **HTTP Router**: Chi (`go-chi/chi/v5`)
- **Database**: PostgreSQL via pgx (`jackc/pgx/v5`)
- **Migrations**: golang-migrate
- **Kubernetes**: client-go, controller-runtime, metacontroller
- **Auth**: JWT validation via `lestrrat-go/jwx`
- **Email**: AWS SES + go-mail
- **Observability**: OpenTelemetry, Sentry
- **Logging**: Zap (`go.uber.org/zap`)
- **Task Runner**: mise

### Infrastructure
- **Kubernetes-native**: Uses CRDs (MCPGateway) with metacontroller
- **Container**: Docker
- **CI**: GitHub Actions
- **Release**: release-please

## Module Path
`github.com/hyprmcp/jetski`

## Entry Point
`main.go` → `internal/cmd/root.go` → Cobra commands: `serve`, `migrate`, `generate`
