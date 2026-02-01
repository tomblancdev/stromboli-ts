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

// Main client
export { StromboliClient } from './client'
export type {
  StromboliClientOptions,
  RunRequest,
  RunResponse,
  AsyncRunResponse,
  Job,
  HealthResponse,
  Session,
} from './client'

// Errors
export { StromboliError } from './errors'

// Re-export generated types for advanced usage
export type { paths, components } from './generated/types'
export { createStromboliClient } from './generated/api'
