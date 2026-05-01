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
export { API_VERSION_RANGE, isCompatible, SDK_VERSION, StromboliClient } from './client'

// ============================================================================
// Client Types
// ============================================================================

/**
 * Configuration and request/response types for the client.
 */
export type {
  /** Snapshot of a persistent agent */
  AgentSnapshot,
  /** Persistent agent lifecycle status */
  AgentStatus,
  /** Terminal event from an agent stream */
  AgentStreamDoneEvent,
  /** Stream-level error event from an agent stream */
  AgentStreamErrorEvent,
  /** Discriminated union of agent stream events */
  AgentStreamEvent,
  /** Per-turn event from an agent stream */
  AgentStreamMessageEvent,
  /** Response from async run (job ID) */
  AsyncRunResponse,
  /** Claude-specific options */
  ClaudeOptions,
  /** Claude configuration status */
  ClaudeStatusResponse,
  // Secrets CRUD
  /** Request to create a Podman secret */
  CreateSecretRequest,
  /** Response from creating a Podman secret */
  CreateSecretResponse,
  /** Response from deleting a Podman secret */
  DeleteSecretResponse,
  /** Health check response */
  HealthResponse,
  /** Detailed container image info */
  ImageDetail,
  // Container images
  /** Container image metadata with compatibility info */
  ImageInfo,
  /** Request to pull a container image */
  ImagePullRequest,
  /** Response from pulling a container image */
  ImagePullResponse,
  /** Container image search results */
  ImageSearchResponse,
  /** List of container images */
  ImagesListResponse,
  /** Response object for onResponse interceptor */
  InterceptorResponse,
  /** List of jobs */
  JobListResponse,
  /** Full job details */
  JobResponse,
  /** Job status enum values */
  JobStatus,
  /** Container/Podman options */
  PodmanOptions,
  /** Custom retry delay function type */
  RetryDelayFn,
  /** Full request type for running Claude */
  RunRequest,
  /** Response from synchronous run */
  RunResponse,
  /** Podman secret metadata */
  SecretInfo,
  /** List of available secrets */
  SecretsListResponse,
  /** Request to send a turn to an agent */
  SendAgentRequest,
  /** Response from sending a turn to an agent */
  SendAgentResponse,
  /** Session destroy response */
  SessionDestroyResponse,
  /** List of sessions */
  SessionListResponse,
  // Single message
  /** Single session message response */
  SessionMessageResponse,
  /** Session messages response */
  SessionMessagesResponse,
  /** Simplified request interface for common use cases */
  SimpleRunRequest,
  // Persistent agents
  /** Request to spawn a persistent agent */
  SpawnAgentRequest,
  /** Response from spawning a persistent agent */
  SpawnAgentResponse,
  /** Content event during streaming */
  StreamContentEvent,
  /** Done event during streaming */
  StreamDoneEvent,
  /** Error event during streaming */
  StreamErrorEvent,
  /** Streaming event from Claude output (discriminated union) */
  StreamEvent,
  /** Options for streaming execution */
  StreamOptions,
  /** Tool result event during streaming */
  StreamToolResultEvent,
  /** Tool use event during streaming */
  StreamToolUseEvent,
  /** Options for initializing the client */
  StromboliClientOptions,
  /** JWT token response */
  TokenResponse,
  /** Token validation response */
  ValidateResponse,
  /** Options for waiting for job completion */
  WaitForJobOptions,
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
export type { components, paths } from './generated/types'
