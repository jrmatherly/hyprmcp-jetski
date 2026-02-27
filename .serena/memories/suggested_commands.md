# Suggested Commands

## Frontend Development
| Command | Description |
|---------|-------------|
| `pnpm install` | Install Node.js dependencies |
| `npm start` / `ng serve` | Start Angular dev server on http://localhost:4200 |
| `npm run build` | Build for production |
| `npm run build:dev` | Build for development |
| `npm test` / `ng test` | Run unit tests with Karma |
| `npm run format` | Format code with Prettier + fix ESLint issues |
| `npm run lint` | Check formatting/linting without changes |

## Backend Development (via mise)
| Command | Description |
|---------|-------------|
| `mise run serve` | Run the Go backend server |
| `mise run serve -- --install-controller` | Serve with CRD + metacontroller config installed |
| `mise run test` | Run Go tests (`go test ./...`) |
| `mise run lint` | Run golangci-lint (includes tidy + controller-gen) |
| `mise run tidy` | Run `go mod tidy` |
| `mise run migrate` | Run database migrations |
| `mise run purge` | Roll back all migrations |
| `mise run generate` | Generate code (runs migrations first) |
| `mise run controller-gen` | Generate CRD objects and apply configurations |

## Minikube (Local Kubernetes)
| Command | Description |
|---------|-------------|
| `mise run minikube-start` | Start minikube cluster with metacontroller |
| `mise run minikube-stop` | Stop minikube cluster |

## Angular CLI
| Command | Description |
|---------|-------------|
| `ng generate component <name>` | Generate new component |
| `ng generate service <name>` | Generate new service |

## System Utilities (macOS/Darwin)
| Command | Description |
|---------|-------------|
| `git` | Version control |
| `ls`, `cd`, `grep`, `find` | Standard Unix utilities |
| `mise` | Task runner and tool version manager |
