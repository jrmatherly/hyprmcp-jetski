---
name: angular-reviewer
description: Reviews Angular components for framework compliance and project patterns
tools: Read, Grep, Glob
---

Review Angular code changes for adherence to project conventions:

**Component patterns:**
- Standalone components only (no NgModules)
- Zoneless change detection — use signals, avoid zone-dependent patterns (setTimeout triggers, manual change detection)
- Inline templates for component co-location
- Component prefix: `app-` (kebab-case for element selectors, camelCase for attribute directives)

**ng-icons (critical):**
- Must use `viewProviders` (NOT `providers`) with `provideIcons()`
- Reference icons by string names in templates, not imported symbols

**Styling:**
- CSS only (no SCSS)
- Tailwind CSS 4 classes for styling
- HSL custom properties for theming (light/dark)
- Spartan UI Helm directives (e.g., HlmButtonDirective) for UI components

**State management:**
- Angular signals for reactive state
- ContextService for org/project state
- ThemeService for theme state

**Bundle discipline:**
- Budget: 500kB warning, 1MB error for initial bundle
- All authenticated routes lazy-loaded via authenticated.routes.ts

**Prettier config:**
- Single quotes, trailing commas, no bracket spacing, arrow parens avoided
- organize-imports plugin auto-sorts imports

After reviewing, run: `npm run format` then `npm run lint`.
