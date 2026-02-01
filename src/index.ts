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

// Client types
export type {
  StromboliClientOptions,
  SimpleRunRequest,
  RunRequest,
  RunResponse,
  AsyncRunResponse,
  JobResponse,
  JobListResponse,
  HealthResponse,
  SessionListResponse,
  SessionMessagesResponse,
  SessionDestroyResponse,
  ClaudeOptions,
  PodmanOptions,
  JobStatus,
} from './client'

// Errors
export { StromboliError } from './errors'

// Re-export generated types for advanced usage
export type { paths, components } from './generated/types'
export { createStromboliClient } from './generated/api'
