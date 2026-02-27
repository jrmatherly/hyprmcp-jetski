# Codebase Structure

## Root Layout
```
jetski/
├── main.go                  # Go entrypoint
├── go.mod / go.sum          # Go module
├── package.json             # Node.js/Angular config
├── pnpm-lock.yaml           # pnpm lockfile
├── angular.json             # Angular workspace config
├── tsconfig.json            # TypeScript config
├── eslint.config.cjs        # ESLint config
├── mise.toml                # Task runner config
├── Dockerfile               # Container build
├── docker-compose.yaml      # Local dev services
├── CLAUDE.md                # AI assistant instructions
├── internal/                # Go backend packages
└── projects/ui/             # Angular frontend
```

## Frontend Structure
```
projects/ui/
├── src/app/
│   ├── app.ts               # Root component (navigation + layout)
│   ├── app.config.ts         # Application providers
│   ├── app.routes.ts         # Top-level routes (auth guard)
│   ├── app-shell.component.ts # App shell layout
│   ├── auth.interceptor.ts   # HTTP auth interceptor
│   ├── authenticated.routes.ts # All authenticated routes (lazy-loaded bundle)
│   ├── components/           # Reusable UI components
│   │   ├── navigation/       # Nav sidebar/menu
│   │   ├── header/           # Top header bar
│   │   ├── table/            # Data table component
│   │   ├── deployments/      # Deployment views
│   │   ├── projects-grid/    # Projects grid view
│   │   ├── usage-card/       # Usage statistics card
│   │   └── upsell-wrapper/   # Upsell/upgrade prompts
│   ├── pages/                # Route-specific pages
│   │   ├── home/             # Landing/home page
│   │   ├── onboarding/       # New user onboarding
│   │   ├── new-project/      # Create project
│   │   ├── project/          # Project views (dashboard, check, logs, prompts)
│   │   ├── project-settings/ # Project settings
│   │   ├── organization-dashboard/ # Org dashboard
│   │   ├── organization-settings/  # Org settings (general, auth, members)
│   │   └── monitoring/       # Monitoring page
│   ├── services/             # Application services
│   │   ├── context.service.ts # App context (orgs, projects, user)
│   │   └── theme.service.ts   # Theme management (dark/light)
│   ├── pipes/                # Angular pipes
│   └── libs/ui/              # Custom Spartan UI helm components
└── public/                   # Static assets
```

## Backend Structure
```
internal/
├── cmd/           # Cobra CLI (root, serve, migrate, generate)
├── handlers/      # HTTP route handlers
├── server/        # HTTP server setup
├── routing/       # Route definitions
├── middleware/     # HTTP middleware
├── auth/          # Authentication logic
├── db/            # Database access layer
├── svc/           # Business logic services
├── types/         # Shared types
├── kubernetes/    # K8s CRD, controllers, API types
├── migrations/    # Database migration files
├── frontend/      # Embedded frontend assets
├── env/           # Environment config
├── envutil/       # Environment utilities
├── envparse/      # Environment parsing
├── context/       # Request context helpers
├── gatewayconfig/ # MCP gateway configuration
├── analytics/     # PostHog analytics
├── tracers/       # OpenTelemetry tracing
├── buildconfig/   # Build-time config
├── mail/          # Email service
├── mailsending/   # Email sending (AWS SES)
├── mailtemplates/ # Email templates
├── apierrors/     # API error types
├── lists/         # List utilities
└── util/          # General utilities
```

## Routing (Frontend)
- `/` → redirects to default org/project
- `/onboarding` — new user flow
- `/organizations/new` — create org
- `/:organizationName` — org dashboard (redirects to single project if only one)
- `/:organizationName/settings` — org settings (general, authorization, members, project settings)
- `/:organizationName/new` — new project
- `/:organizationName/project/:projectName` — project dashboard
- `/:organizationName/project/:projectName/check` — project health check
- `/:organizationName/project/:projectName/logs` — project logs
- `/:organizationName/project/:projectName/prompts` — project prompts
- `/:organizationName/project/:projectName/deployments` — project deployments
- `/:organizationName/project/:projectName/monitoring` — project monitoring
