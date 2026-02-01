/**
 * Stromboli TypeScript SDK
 *
 * Official TypeScript SDK for [Stromboli](https://github.com/tomblancdev/stromboli) -
 * Container orchestration for Claude Code agents.
 *
 * This SDK provides a type-safe, ergonomic interface for running Claude Code
 * inside isolated Podman containers via the Stromboli API.
 *
 * ## Quick Start
 *
 * @example Basic Usage
 * ```typescript
 * import { StromboliClient } from 'stromboli-ts'
 *
 * const client = new StromboliClient('http://localhost:8585')
 *
 * // Synchronous execution (wait for completion)
 * const result = await client.run({
 *   prompt: 'Hello!',
 *   model: 'haiku',
 * })
 *
 * console.log(result.result)
 * ```
 *
 * @example Async Job
 * ```typescript
 * import { StromboliClient } from 'stromboli-ts'
 *
 * const client = new StromboliClient('http://localhost:8585')
 *
 * // Start async job
 * const job = await client.runAsync({ prompt: 'Analyze this codebase' })
 * console.log(`Job started: ${job.id}`)
 *
 * // Check status later
 * const status = await client.getJob(job.id)
 * if (status.status === 'completed') {
 *   console.log(status.result)
 * }
 * ```
 *
 * @example Session Continuity
 * ```typescript
 * import { StromboliClient } from 'stromboli-ts'
 *
 * const client = new StromboliClient('http://localhost:8585')
 *
 * // First message
 * const { session_id } = await client.run({ prompt: 'My name is Tom' })
 *
 * // Continue the conversation
 * const response = await client.run({
 *   prompt: 'What is my name?',
 *   session_id,
 *   resume: true,
 * })
 * // Claude will remember: "Your name is Tom"
 * ```
 *
 * @example Error Handling
 * ```typescript
 * import { StromboliClient, StromboliError } from 'stromboli-ts'
 *
 * const client = new StromboliClient('http://localhost:8585')
 *
 * try {
 *   await client.run({ prompt: 'Hello' })
 * } catch (error) {
 *   if (error instanceof StromboliError) {
 *     console.error(`[${error.code}] ${error.message}`)
 *     if (error.status) {
 *       console.error(`HTTP ${error.status}`)
 *     }
 *   }
 * }
 * ```
 *
 * @packageDocumentation
 * @module stromboli-ts
 */

// ============================================================================
// Main Client
// ============================================================================

/**
 * The main Stromboli client class.
 * @see {@link StromboliClient}
 */
export { StromboliClient, isCompatible, SDK_VERSION, API_VERSION_RANGE } from './client'

// ============================================================================
// Client Types
// ============================================================================

/**
 * Configuration and request/response types for the client.
 */
export type {
  /** Options for initializing the client */
  StromboliClientOptions,
  /** Response object for onResponse interceptor */
  InterceptorResponse,
  /** Custom retry delay function type */
  RetryDelayFn,
  /** Simplified request interface for common use cases */
  SimpleRunRequest,
  /** Full request type for running Claude */
  RunRequest,
  /** Response from synchronous run */
  RunResponse,
  /** Response from async run (job ID) */
  AsyncRunResponse,
  /** Full job details */
  JobResponse,
  /** List of jobs */
  JobListResponse,
  /** Health check response */
  HealthResponse,
  /** Claude configuration status */
  ClaudeStatusResponse,
  /** List of available secrets */
  SecretsListResponse,
  /** JWT token response */
  TokenResponse,
  /** Token validation response */
  ValidateResponse,
  /** List of sessions */
  SessionListResponse,
  /** Session messages response */
  SessionMessagesResponse,
  /** Session destroy response */
  SessionDestroyResponse,
  /** Claude-specific options */
  ClaudeOptions,
  /** Container/Podman options */
  PodmanOptions,
  /** Job status enum values */
  JobStatus,
  /** Options for waiting for job completion */
  WaitForJobOptions,
  /** Streaming event from Claude output (discriminated union) */
  StreamEvent,
  /** Content event during streaming */
  StreamContentEvent,
  /** Tool use event during streaming */
  StreamToolUseEvent,
  /** Tool result event during streaming */
  StreamToolResultEvent,
  /** Error event during streaming */
  StreamErrorEvent,
  /** Done event during streaming */
  StreamDoneEvent,
  /** Options for streaming execution */
  StreamOptions,
} from './client'

// ============================================================================
// Errors
// ============================================================================

/**
 * Custom error class for all SDK errors.
 * @see {@link StromboliError}
 */
export { StromboliError } from './errors'

// ============================================================================
// Advanced: Generated Types
// ============================================================================

/**
 * Re-exported generated types for advanced usage.
 *
 * These types are auto-generated from the Stromboli OpenAPI specification.
 * Use these if you need direct access to the raw API types.
 *
 * @example
 * ```typescript
 * import type { paths, components } from 'stromboli-ts'
 *
 * // Access raw API path types
 * type RunEndpoint = paths['/run']['post']
 *
 * // Access schema components
 * type Job = components['schemas']['internal_api.Job']
 * ```
 */
export type { paths, components } from './generated/types'

/**
 * Low-level client factory for direct API access.
 *
 * Use this if you need full control over the HTTP client without
 * the convenience wrapper. Returns an openapi-fetch client instance.
 *
 * @example
 * ```typescript
 * import { createStromboliClient } from 'stromboli-ts'
 *
 * const api = createStromboliClient('http://localhost:8585')
 *
 * const { data, error } = await api.POST('/run', {
 *   body: { prompt: 'Hello' }
 * })
 * ```
 */
export { createStromboliClient } from './generated/api'
