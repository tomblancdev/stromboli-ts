# Stromboli TypeScript SDK - Claude Guidelines 🌋

## Overview

Official TypeScript SDK for [Stromboli](https://github.com/tomblancdev/stromboli) - Container orchestration for Claude Code agents.

## Versioning

| What | Where | Example |
|------|-------|---------|
| SDK version | `package.json` → `version` | `1.0.0` |
| Target API version | `package.json` → `stromboli.apiVersion` | `0.2.0` |
| Compatible range | `package.json` → `stromboli.apiVersionRange` | `>=0.2.0 <0.3.0` |

**OpenAPI Source** (derived from `apiVersion`):
```
https://raw.githubusercontent.com/tomblancdev/stromboli/v{apiVersion}/docs/swagger/swagger.yaml
```

## Architecture

```
stromboli-ts/
├── src/
│   ├── generated/           # 🤖 AUTO-GENERATED (never edit)
│   │   ├── types.ts         # OpenAPI → TypeScript types
│   │   └── api.ts           # Generated API client
│   ├── client.ts            # High-level wrapper
│   ├── errors.ts            # Custom error types
│   └── index.ts             # Public exports
├── tests/
│   ├── unit/                # Mocked tests
│   └── e2e/                 # Real API tests
├── scripts/
│   └── generate.ts          # OpenAPI codegen script
├── Containerfile            # Dev container
├── Makefile                 # All commands
├── biome.json               # Lint + format config
├── bunfig.toml              # Bun config
└── tsconfig.json
```

## Development Rules

### 🐳 Always Use Containers

**NEVER run commands directly on the host.** All development happens in Podman.

```bash
# ✅ Correct
make test
make lint
make build

# ❌ Wrong
bun test
biome check
```

### 🤖 Auto-Generation First

**NEVER manually write API types or endpoints.**

```bash
make generate  # Fetches swagger.yaml → generates src/generated/
```

The `generate` script:
1. Reads `stromboli.apiVersion` from `package.json`
2. Fetches `swagger.yaml` from the tagged release
3. Generates types + client to `src/generated/`

**If the API changes → regenerate. Don't patch manually.**

### 🧪 Test-Driven Development

```
RED    → Write failing test
GREEN  → Minimal code to pass
REFACTOR → Clean up
```

```bash
make test           # Unit tests (mocked)
make test-e2e       # E2E tests (real Stromboli)
make test-coverage  # Target: 90%+
```

### 🎯 KISS - Keep It Simple

Two layers only:

| Layer | Location | Purpose |
|-------|----------|---------|
| Generated | `src/generated/` | Raw, type-safe API calls |
| Client | `src/client.ts` | Thin wrapper (retries, streaming, errors) |

**No over-abstraction.** Before adding a helper, ask: "Is this necessary?"

## Tech Stack

| Component | Tool | Why |
|-----------|------|-----|
| Runtime | Bun | Fast, all-in-one |
| Package Manager | Bun | Built-in |
| Bundler | Bun | Built-in |
| Test Runner | Bun | Built-in |
| Lint + Format | Biome | Single tool, Rust-fast |
| Types Generator | openapi-typescript | Industry standard |
| HTTP Client | openapi-fetch | Type-safe from spec |
| Container | Podman | Rootless, daemonless |

## Makefile Commands

```bash
# Development
make dev            # Watch mode
make shell          # Container shell

# Code Quality
make lint           # Check lint + format
make lint-fix       # Auto-fix
make format         # Format only

# Testing
make test           # Unit tests
make test-e2e       # E2E (needs Stromboli)
make test-watch     # Watch mode
make test-coverage  # Coverage report

# Build & Generate
make build          # Production build
make generate       # Regenerate from OpenAPI

# Release
make publish        # Publish to npm
make docs           # Generate TypeDoc
```

## Code Standards

### Naming

| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `stromboli-client.ts` |
| Types/Classes | PascalCase | `StromboliClient` |
| Functions/Vars | camelCase | `runAsync` |
| Constants | SCREAMING_SNAKE | `DEFAULT_TIMEOUT` |

### Exports

```typescript
// src/index.ts - Public API only
export { StromboliClient } from './client'
export type { RunRequest, RunResponse, Job } from './generated/types'
export { StromboliError } from './errors'
// Don't export internals
```

### Error Handling

```typescript
export class StromboliError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status?: number,
    public readonly cause?: unknown
  ) {
    super(message)
    this.name = 'StromboliError'
  }
}
```

### No Any

```typescript
// ❌ Bad
function parse(data: any) { }

// ✅ Good
function parse(data: unknown): ParsedData { }
```

## Containerfile

```dockerfile
FROM docker.io/oven/bun:1

WORKDIR /app

# Install Biome globally
RUN bun add -g @biomejs/biome

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

COPY . .

CMD ["bun", "test"]
```

## CI/CD Pipeline

### On Push/PR

```yaml
test:
  - make lint
  - make test
  - make build

e2e:
  - Start Stromboli container
  - make test-e2e
```

### On Stromboli Release (webhook/cron)

```yaml
sync-api:
  - Update stromboli.apiVersion in package.json
  - make generate
  - make test
  - Create PR: "chore: sync with Stromboli vX.Y.Z"
```

### On SDK Release

```yaml
release:
  - make build
  - make publish
  - make docs → GH Pages
```

## Compatibility

Maintained in `COMPATIBILITY.md`:

| SDK Version | Stromboli API | Status |
|-------------|---------------|--------|
| 1.0.x       | 0.2.x         | ✅ Current |
| 0.9.x       | 0.1.x         | ⚠️ Deprecated |

Runtime check:

```typescript
const health = await client.health()
if (!isCompatible(health.version, SDK_API_RANGE)) {
  console.warn(`API ${health.version} may not be compatible with this SDK`)
}
```

## Usage Examples

### Basic

```typescript
import { StromboliClient } from 'stromboli-ts'

const client = new StromboliClient('http://localhost:8585')

const result = await client.run({
  prompt: 'Hello!',
  model: 'haiku',
})
```

### Async Job

```typescript
const job = await client.runAsync({
  prompt: 'Review this code',
  workdir: '/workspace',
})

const status = await client.getJob(job.id)
```

### Streaming

```typescript
for await (const event of client.stream({ prompt: 'Count to 10' })) {
  process.stdout.write(event.data)
}
```

### Sessions

```typescript
const { sessionId } = await client.run({ prompt: 'My name is Tom' })
await client.run({ prompt: 'What is my name?', sessionId, resume: true })
```

## References

- [Stromboli Docs](https://tomblancdev.github.io/stromboli/)
- [Bun](https://bun.sh/docs)
- [Biome](https://biomejs.dev/)
- [openapi-typescript](https://openapi-ts.dev/)
