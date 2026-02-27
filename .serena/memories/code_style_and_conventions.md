# Code Style and Conventions

## Frontend (TypeScript/Angular)

### General
- **TypeScript strict mode** with additional flags: `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noFallthroughCasesInSwitch`
- **CSS** (not SCSS) for all styling
- **Prettier** with Angular HTML parser for templates
- **ESLint** with angular-eslint, typescript-eslint, and prettier plugin

### Angular Conventions
- **Component prefix**: `app-` (kebab-case for elements, camelCase for attribute directives)
- **Standalone components** only — no NgModules
- **Inline templates** for component co-location
- **Signals** for reactive state (not RxJS observables, except where needed for interop)
- **Zoneless** change detection via `provideZonelessChangeDetection()`

### ng-icons Pattern
```typescript
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSun } from '@ng-icons/lucide';

@Component({
  imports: [NgIcon],
  viewProviders: [provideIcons({ lucideSun })],
  template: `<ng-icon name="lucideSun" size="16" />`
})
```
Always use `viewProviders` (not `providers`) for `provideIcons()`.

### Bundle Budgets
- Warning: 500kB initial bundle
- Error: 1MB initial bundle

## Backend (Go)

### General
- Standard Go conventions
- Module: `github.com/hyprmcp/jetski`
- Linting: golangci-lint v2.8.0
- Internal packages under `internal/`

### Project Structure
- `internal/cmd/` — Cobra CLI commands (serve, migrate, generate)
- `internal/handlers/` — HTTP handlers
- `internal/server/` — HTTP server setup
- `internal/routing/` — Route definitions
- `internal/db/` — Database layer
- `internal/auth/` — Authentication
- `internal/kubernetes/` — K8s CRD and controller logic
- `internal/svc/` — Services/business logic
- `internal/types/` — Shared types
- `internal/middleware/` — HTTP middleware
