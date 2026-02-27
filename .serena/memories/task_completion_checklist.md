# Task Completion Checklist

## After Frontend Changes
1. Run `npm run format` to format TypeScript code with Prettier and fix linting issues
2. Run `npm run lint` to verify no remaining lint errors
3. Run `npm test` to ensure unit tests pass

## After Backend (Go) Changes
1. Run `mise run lint` to lint Go code (includes `go mod tidy` and `controller-gen`)
2. Run `mise run test` to ensure Go tests pass

## After Kubernetes API/CRD Changes
1. Run `mise run controller-gen` to regenerate CRD objects and apply configurations
2. Run `mise run lint` (which depends on controller-gen)

## Before Committing
- Ensure both frontend and backend linting/formatting pass
- Ensure tests pass for the changed areas
- Follow existing commit message style (conventional commits): `type(scope): description`
  - Examples: `fix(deps):`, `chore(deps):`, `feat(ui):`, `fix(api):`
