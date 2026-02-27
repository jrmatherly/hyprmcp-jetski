---
name: new-component
description: Scaffold a new Angular standalone component following project conventions
---

# New Component

Create a new Angular standalone component at the specified path.

**Arguments:** `<component-name> [--page] [--shared]`

## Placement

- `--page`: `projects/ui/src/app/pages/<name>/<name>.component.ts`
- `--shared` (default): `projects/ui/src/app/components/<name>/<name>.component.ts`

## Required Conventions

1. **Standalone component** — no NgModule, set `standalone: true` (default in Angular 20)
2. **Inline template** — use `template` not `templateUrl`
3. **Component selector**: `app-<name>` (kebab-case)
4. **CSS file** — create a `.css` file (not SCSS), use Tailwind CSS classes
5. **Signals** — use Angular signals for local state, not class properties
6. **Imports** — import Spartan UI Helm directives as needed
7. **Icons** — if using ng-icons, use `viewProviders: [provideIcons({...})]`

## Template

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-COMPONENT_NAME',
  template: `
    <div>
      <!-- Component content -->
    </div>
  `,
  styleUrl: './COMPONENT_NAME.component.css',
})
export class ComponentNameComponent {}
```

## After Creation

1. Add the component to the appropriate route in `authenticated.routes.ts` (for pages) or import it where needed (for shared components)
2. Run `npm run format` to auto-format
3. Run `npm run lint` to verify
