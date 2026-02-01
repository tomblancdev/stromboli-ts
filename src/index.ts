/**
 * Stromboli TypeScript SDK
 *
 * Official TypeScript SDK for Stromboli - Container orchestration for Claude Code agents
 *
 * @example
 * ```typescript
 * import { StromboliClient } from 'stromboli-ts'
 *
 * const client = new StromboliClient('http://localhost:8585')
 *
 * const result = await client.run({
 *   prompt: 'Hello!',
 *   model: 'haiku',
 * })
 * ```
 */

export type {
  AsyncRunResponse,
  HealthResponse,
  Job,
  RunRequest,
  RunResponse,
  Session,
  StromboliClientOptions,
} from './client'
// Main client
export { StromboliClient } from './client'

// Errors
export { StromboliError } from './errors'
export { createStromboliClient } from './generated/api'
// Re-export generated types for advanced usage
export type { components, paths } from './generated/types'
