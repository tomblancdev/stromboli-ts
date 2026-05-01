/**
 * Stromboli TypeScript SDK Client
 *
 * High-level wrapper around the generated API client for executing
 * Claude Code in isolated Podman containers.
 *
 * @module client
 */

import packageJson from '../package.json' with { type: 'json' }
import { StromboliError } from './errors'
import { type StromboliApiClient, createStromboliClient } from './generated/api'
import type { components } from './generated/types'

// ============================================================================
// Type Aliases
// ============================================================================

/**
 * Full run request with all API options.
 * Use {@link SimpleRunRequest} for a more user-friendly interface.
 *
 * @see https://github.com/tomblancdev/stromboli for API documentation
 */
export type RunRequest = components['schemas']['internal_api.RunRequest']

/**
 * Response from a synchronous Claude execution.
 *
 * @property output - Claude's response text (when successful)
 * @property session_id - Session ID for conversation continuation
 * @property status - Execution status: 'completed' or 'error'
 * @property error - Error message (when failed)
 */
export type RunResponse = components['schemas']['internal_api.RunResponse']

/**
 * Response from starting an async Claude execution.
 *
 * @property job_id - Unique job identifier for tracking (e.g., 'job-abc123')
 */
export type AsyncRunResponse = components['schemas']['internal_api.AsyncRunResponse']

/**
 * Job status and result for async executions.
 *
 * @property id - Unique job identifier
 * @property status - Current status: 'pending', 'running', 'completed', 'failed', 'crashed', 'cancelled'
 * @property output - Claude's output (when completed)
 * @property error - Error message (when failed)
 * @property session_id - Associated session ID
 * @property created_at - Job creation timestamp (ISO 8601)
 * @property updated_at - Last update timestamp (ISO 8601)
 */
export type JobResponse = components['schemas']['internal_api.JobResponse']

/**
 * List of async jobs.
 *
 * @property jobs - Array of job responses
 */
export type JobListResponse = components['schemas']['internal_api.JobListResponse']

/**
 * API health check response.
 *
 * @property status - Overall status: 'ok' or 'error'
 * @property version - Stromboli API version (e.g., '0.3.0')
 * @property name - Service name ('stromboli')
 * @property components - Individual component health statuses
 */
export type HealthResponse = components['schemas']['internal_api.HealthResponse']

/**
 * List of existing sessions.
 *
 * @property sessions - Array of session IDs (e.g., ['sess-abc123', 'sess-def456'])
 * @property error - Error message if request failed
 */
export type SessionListResponse = components['schemas']['internal_api.SessionListResponse']

/**
 * Paginated list of session messages.
 *
 * @property messages - Array of conversation messages
 * @property total - Total number of messages in session
 * @property offset - Current pagination offset
 * @property limit - Number of messages per page
 * @property has_more - Whether more messages are available
 */
export type SessionMessagesResponse = components['schemas']['internal_api.SessionMessagesResponse']

/**
 * Result of session destruction.
 *
 * @property success - Whether the session was successfully deleted
 * @property session_id - The deleted session ID
 * @property error - Error message if deletion failed
 */
export type SessionDestroyResponse = components['schemas']['internal_api.SessionDestroyResponse']

/**
 * All available Claude CLI options for container execution.
 * These map directly to Claude Code CLI flags.
 *
 * @see https://docs.anthropic.com/claude-code for CLI documentation
 */
export type ClaudeOptions = components['schemas']['stromboli_internal_types.ClaudeOptions']

/**
 * Podman container configuration options.
 *
 * @property timeout - Container timeout (e.g., '5m', '1h', '30s')
 * @property memory - Memory limit (e.g., '512m', '1g')
 * @property cpus - CPU limit (e.g., '0.5', '2')
 * @property image - Custom container image (must match allowed patterns)
 * @property volumes - Volume mounts (e.g., ['/data:/data:ro'])
 */
export type PodmanOptions = components['schemas']['stromboli_internal_types.PodmanOptions']

/**
 * Job execution status.
 *
 * - `pending` - Job is queued, waiting to start
 * - `running` - Job is currently executing
 * - `completed` - Job finished successfully
 * - `failed` - Job failed with an error
 * - `crashed` - Container crashed unexpectedly
 * - `cancelled` - Job was cancelled by user
 */
export type JobStatus = components['schemas']['stromboli_internal_job.Status']

/**
 * Claude configuration status response.
 *
 * @property configured - Whether Claude credentials are set up
 * @property message - Human-readable status message
 */
export type ClaudeStatusResponse = components['schemas']['internal_api.ClaudeStatusResponse']

/**
 * List of available Podman secrets.
 *
 * @property secrets - Array of secret names (e.g., ['github-token', 'gitlab-token'])
 * @property error - Error message if request failed
 */
export type SecretsListResponse = components['schemas']['internal_api.SecretsListResponse']

/**
 * JWT token response from authentication.
 *
 * @property access_token - JWT access token for API authentication
 * @property refresh_token - Token for obtaining new access tokens
 * @property token_type - Token type (typically 'Bearer')
 * @property expires_in - Token expiration time in seconds
 */
export type TokenResponse = components['schemas']['internal_api.TokenResponse']

/**
 * Token validation response.
 *
 * @property valid - Whether the token is valid
 * @property subject - Token subject (client ID)
 * @property expires_at - Unix timestamp when token expires
 */
export type ValidateResponse = components['schemas']['internal_api.ValidateResponse']

// ----------------------------------------------------------------------------
// Persistent Agents (added in stromboli v0.5.x)
// ----------------------------------------------------------------------------

/**
 * Configuration for spawning a long-lived Claude agent.
 *
 * Persistent agents are containers that stay alive between turns, letting you
 * stream a multi-turn conversation through a single Claude process.
 */
export type SpawnAgentRequest = components['schemas']['stromboli_internal_agent.CreateRequest']

/**
 * Snapshot of a persistent agent's current state.
 *
 * @property id - Agent ID
 * @property session_id - Underlying session ID
 * @property status - Current lifecycle status
 * @property turns_completed - Number of turns processed since spawn
 * @property idle_timeout_seconds - Effective idle timeout
 * @property idle_timeout_disabled - True if the idle watchdog is off
 * @property created_at - Spawn timestamp (ISO 8601)
 * @property last_activity_at - Last input/output timestamp (ISO 8601)
 * @property exit_error - Error message if the agent crashed
 */
export type AgentSnapshot = components['schemas']['stromboli_internal_agent.Snapshot']

/**
 * Persistent agent lifecycle status.
 */
export type AgentStatus = components['schemas']['stromboli_internal_agent.Status']

/**
 * Response after spawning a persistent agent.
 * Same shape as {@link AgentSnapshot}.
 */
export type SpawnAgentResponse = components['schemas']['internal_api.CreateAgentResponse']

/**
 * Request to append a turn to a running agent's stream-json stdin.
 *
 * @property prompt - The next user turn (required)
 */
export type SendAgentRequest = components['schemas']['internal_api.SendAgentRequest']

/**
 * Acknowledgement that a turn has started.
 * Output for the turn streams via {@link StromboliClient.streamAgent}.
 *
 * @property turn_id - Unique turn identifier
 */
export type SendAgentResponse = components['schemas']['internal_api.SendAgentResponse']

// ----------------------------------------------------------------------------
// Container Images (added in stromboli v0.5.x)
// ----------------------------------------------------------------------------

/**
 * Container image metadata with compatibility information.
 *
 * @property repository - Image repository (e.g., 'python')
 * @property tag - Image tag (e.g., '3.12-slim')
 * @property id - Image SHA
 * @property size - Image size in bytes
 * @property created - Creation timestamp (ISO 8601)
 * @property compatible - Whether the image is compatible with Stromboli
 * @property compatibility_rank - 0-N rank (higher is better)
 * @property has_claude_cli - Whether the image already bundles Claude CLI
 * @property tools - Detected tools available in the image
 * @property description - Human-readable description
 */
export type ImageInfo = components['schemas']['internal_api.ImageInfoResponse']

/**
 * Detailed image info, including container labels.
 * Returned by {@link StromboliClient.inspectImage}.
 */
export type ImageDetail = components['schemas']['internal_api.ImageDetailResponse']

/**
 * List of local container images sorted by compatibility rank.
 *
 * @property images - Image metadata entries
 */
export type ImagesListResponse = components['schemas']['internal_api.ImagesListResponse']

/**
 * Request to pull a container image from a registry.
 *
 * @property image - Fully-qualified image reference (required)
 * @property platform - Target platform (e.g., 'linux/amd64')
 * @property quiet - Suppress progress output
 */
export type ImagePullRequest = components['schemas']['internal_api.ImagePullRequest']

/**
 * Result of an image pull operation.
 *
 * @property success - Whether the pull succeeded
 * @property image - The pulled image reference
 * @property image_id - Resolved image SHA (when successful)
 */
export type ImagePullResponse = components['schemas']['internal_api.ImagePullResponse']

/**
 * Search results from container registries.
 *
 * @property results - Search result entries
 */
export type ImageSearchResponse = components['schemas']['internal_api.ImageSearchResponse']

// ----------------------------------------------------------------------------
// Secrets CRUD (added in stromboli v0.5.x)
// ----------------------------------------------------------------------------

/**
 * Request to create a new Podman secret.
 *
 * @property name - Secret name (required)
 * @property value - Secret value (required, never returned by the API afterwards)
 */
export type CreateSecretRequest = components['schemas']['internal_api.CreateSecretRequest']

/**
 * Result of secret creation.
 *
 * @property success - Whether creation succeeded
 * @property name - Secret name (echoed)
 * @property error - Error message on failure
 */
export type CreateSecretResponse = components['schemas']['internal_api.CreateSecretResponse']

/**
 * Secret metadata. Never contains the actual secret value.
 *
 * @property id - Internal secret ID
 * @property name - Secret name
 * @property created_at - Creation timestamp (ISO 8601)
 */
export type SecretInfo = components['schemas']['internal_api.SecretInfoResponse']

/**
 * Result of secret deletion.
 *
 * @property success - Whether deletion succeeded
 * @property name - Secret name (echoed)
 * @property error - Error message on failure
 */
export type DeleteSecretResponse = components['schemas']['internal_api.DeleteSecretResponse']

// ----------------------------------------------------------------------------
// Single Session Message (added in stromboli v0.5.x)
// ----------------------------------------------------------------------------

/**
 * Single session message, returned by {@link StromboliClient.getSessionMessage}.
 */
export type SessionMessageResponse = components['schemas']['internal_api.SessionMessageResponse']

// ============================================================================
// Internal Types
// ============================================================================

/**
 * API result type for handling openapi-fetch responses.
 * @internal
 */
interface ApiResult<T> {
  data?: T
  error?: unknown
  response: { status: number }
}

// ============================================================================
// Client Options
// ============================================================================

/**
 * Response object passed to onResponse interceptor.
 * Provides safe access to response metadata without the full Response API.
 */
export interface InterceptorResponse {
  /** HTTP status code */
  status: number
  /** Response headers */
  headers: Headers
  /** Request URL */
  url: string
  /** Whether the response was successful (status 200-299) */
  ok: boolean
}

/**
 * Custom retry delay function type.
 * Called with the attempt number (1-based) and base delay.
 *
 * @param attempt - Current retry attempt (1 for first retry)
 * @param baseDelay - Base delay from options (default 1000ms)
 * @returns Delay in milliseconds before the retry
 *
 * @example
 * ```typescript
 * // Exponential backoff with jitter
 * const delayFn: RetryDelayFn = (attempt, base) =>
 *   base * Math.pow(2, attempt - 1) + Math.random() * 1000
 * ```
 */
export type RetryDelayFn = (attempt: number, baseDelay: number) => number

/**
 * Configuration options for the Stromboli client.
 *
 * @example
 * ```typescript
 * const client = new StromboliClient({
 *   baseUrl: 'http://localhost:8585',
 *   timeout: 60000, // 1 minute
 *   retries: 3,
 *   retryDelay: 1000,
 *   retryBackoff: 'exponential',
 * })
 * ```
 */
export interface StromboliClientOptions {
  /**
   * Base URL of the Stromboli API.
   * @example 'http://localhost:8585'
   */
  baseUrl: string

  /**
   * Request timeout in milliseconds.
   * @default 30000
   */
  timeout?: number

  /**
   * Number of retry attempts for failed requests.
   * Only retries on network errors and 5xx status codes.
   * @default 0
   */
  retries?: number

  /**
   * Base delay between retries in milliseconds, or a custom function.
   *
   * When a function is provided, it receives the attempt number (1-based)
   * and base delay (1000ms), and should return the delay in milliseconds.
   *
   * @default 1000
   *
   * @example
   * ```typescript
   * // Fixed delay
   * retryDelay: 2000
   *
   * // Exponential with jitter
   * retryDelay: (attempt, base) => base * Math.pow(2, attempt - 1) + Math.random() * 1000
   * ```
   */
  retryDelay?: number | RetryDelayFn

  /**
   * Backoff strategy for retries (when retryDelay is a number).
   * - `linear` - Delay increases linearly (1s, 2s, 3s, ...)
   * - `exponential` - Delay doubles each retry (1s, 2s, 4s, ...)
   *
   * Ignored when retryDelay is a function.
   * @default 'exponential'
   */
  retryBackoff?: 'linear' | 'exponential'

  /**
   * Interceptor called before each request.
   * Can be used to modify request options or add headers.
   *
   * @example
   * ```typescript
   * onRequest: (init) => ({
   *   ...init,
   *   headers: { ...init.headers, 'X-Custom': 'value' },
   * })
   * ```
   */
  onRequest?: (init: RequestInit) => RequestInit | Promise<RequestInit>

  /**
   * Interceptor called after each successful response.
   * Can be used for logging or metrics.
   */
  onResponse?: (response: InterceptorResponse) => void | Promise<void>

  /**
   * Interceptor called when an error occurs.
   * Can be used for error logging or reporting.
   */
  onError?: (error: StromboliError) => void

  /**
   * Debug logging callback.
   * Called with internal SDK events for debugging and diagnostics.
   *
   * @example
   * ```typescript
   * debug: (msg, data) => console.log(`[stromboli] ${msg}`, data)
   * ```
   */
  debug?: (message: string, data?: unknown) => void
}

// ============================================================================
// Simple Run Request
// ============================================================================

/**
 * Simplified run request for common use cases.
 *
 * This interface provides a flattened, user-friendly way to configure
 * Claude executions. For advanced options, use {@link RunRequest} directly.
 *
 * @example
 * ```typescript
 * // Basic usage
 * const result = await client.run({
 *   prompt: 'Analyze this code and suggest improvements',
 *   model: 'sonnet',
 * })
 *
 * // With container options
 * const result = await client.run({
 *   prompt: 'Run the test suite',
 *   model: 'haiku',
 *   workdir: '/workspace',
 *   timeout: '10m',
 *   memory: '1g',
 *   allowedTools: ['Bash', 'Read'],
 * })
 *
 * // Continue a conversation
 * const followUp = await client.run({
 *   prompt: 'Now fix the failing tests',
 *   sessionId: result.session_id,
 *   resume: true,
 * })
 * ```
 */
export interface SimpleRunRequest {
  /**
   * The prompt to send to Claude.
   * This is the only required field.
   * @example 'Analyze this code and suggest improvements'
   */
  prompt: string

  /**
   * Model to use for the request.
   * - `sonnet` - Balanced performance and cost (recommended)
   * - `opus` - Most capable, highest cost
   * - `haiku` - Fastest, lowest cost
   * @default 'sonnet' (server default)
   */
  model?: 'sonnet' | 'opus' | 'haiku'

  /**
   * Working directory inside the container where Claude will execute.
   * Use with Podman volume mounts to give Claude access to your code.
   * @example '/workspace'
   */
  workdir?: string

  /**
   * Session ID for conversation continuation.
   * Use with `resume: true` to continue a previous conversation.
   * @example 'sess-abc123def456'
   */
  sessionId?: string

  /**
   * Resume an existing session.
   * Requires `sessionId` to be set.
   * @default false
   */
  resume?: boolean

  /**
   * Container execution timeout.
   * Supports Go duration format: '30s', '5m', '1h'.
   * @example '5m'
   */
  timeout?: string

  /**
   * Container memory limit.
   * Supports Docker memory format: '512m', '1g', '2g'.
   * @example '512m'
   */
  memory?: string

  /**
   * Maximum dollar amount for API calls.
   * Claude will stop when this budget is reached.
   * @example 1.0
   */
  maxBudgetUsd?: number

  /**
   * Replace the default system prompt entirely.
   * @example 'You are a senior Go developer specializing in APIs.'
   */
  systemPrompt?: string

  /**
   * Append to the default system prompt.
   * Use this to add context without replacing the defaults.
   * @example 'Focus on security best practices.'
   */
  appendSystemPrompt?: string

  /**
   * Allowed tools with optional patterns.
   * Use patterns like 'Bash(git:*)' to restrict commands.
   * @example ['Bash(git:*)', 'Read', 'Edit']
   */
  allowedTools?: string[]

  /**
   * Tools to deny.
   * @example ['Write', 'Bash(rm:*)']
   */
  disallowedTools?: string[]

  /**
   * Webhook URL to notify when async job completes.
   * Only used with {@link StromboliClient.runAsync}.
   * @example 'https://my-app.com/webhooks/stromboli'
   */
  webhookUrl?: string

  // ==========================================================================
  // Container Options
  // ==========================================================================

  /**
   * Volume mounts in host:container or host:container:options format.
   * @example ['/data:/data:ro', '/workspace:/workspace']
   */
  volumes?: string[]

  /**
   * Secrets to inject as environment variables.
   * Map of env var name to Podman secret name.
   * @example { 'GH_TOKEN': 'github-token' }
   */
  secretsEnv?: Record<string, string>

  /**
   * CPU limit for the container.
   * @example '0.5' (half a CPU) or '2' (two CPUs)
   */
  cpus?: string

  /**
   * CPU shares (relative weight).
   * @example 512 (half of default 1024)
   */
  cpuShares?: number

  /**
   * Custom container image to use.
   * Must match allowed patterns configured in Stromboli.
   * @example 'python:3.12'
   */
  image?: string

  // ==========================================================================
  // Request Control
  // ==========================================================================

  /**
   * AbortSignal to cancel the request.
   * When aborted, the request will throw a StromboliError with code 'ABORTED'.
   *
   * @example
   * ```typescript
   * const controller = new AbortController()
   *
   * // Cancel after 5 seconds
   * setTimeout(() => controller.abort(), 5000)
   *
   * try {
   *   await client.run({
   *     prompt: 'Long task...',
   *     signal: controller.signal,
   *   })
   * } catch (error) {
   *   if (error.code === 'ABORTED') {
   *     console.log('Request was cancelled')
   *   }
   * }
   * ```
   */
  signal?: AbortSignal

  // ==========================================================================
  // Agent Options
  // ==========================================================================

  /**
   * Agent to use for the session.
   * @example 'reviewer'
   */
  agent?: string

  /**
   * Custom agents definition as JSON object.
   * @example { reviewer: { name: 'Code Reviewer', ... } }
   */
  agents?: Record<string, unknown>

  /**
   * Continue the most recent conversation in the workspace.
   * Ignores `sessionId` when true.
   * @default false
   */
  continueSession?: boolean
}

// ============================================================================
// Streaming Types
// ============================================================================

/**
 * Content event - Claude is outputting text.
 */
export interface StreamContentEvent {
  type: 'content'
  /** The content text */
  data: string
}

/**
 * Tool use event - Claude is calling a tool.
 */
export interface StreamToolUseEvent {
  type: 'tool_use'
  /** Unique tool call ID */
  toolId: string
  /** Name of the tool being called */
  toolName: string
  /** Input parameters for the tool */
  toolInput: unknown
}

/**
 * Tool result event - Result from a tool call.
 */
export interface StreamToolResultEvent {
  type: 'tool_result'
  /** Tool call ID this result corresponds to */
  toolId: string
  /** The result content */
  result: string
  /** Whether the tool execution errored */
  isError: boolean
}

/**
 * Error event - An error occurred during streaming.
 */
export interface StreamErrorEvent {
  type: 'error'
  /** Error message */
  error: string
}

/**
 * Done event - Stream has completed.
 */
export interface StreamDoneEvent {
  type: 'done'
}

/**
 * Event emitted during streaming output.
 *
 * This is a discriminated union - use `event.type` to narrow the type:
 *
 * @example
 * ```typescript
 * for await (const event of client.stream({ prompt: 'Hello' })) {
 *   switch (event.type) {
 *     case 'content':
 *       // event.data is string (not optional)
 *       process.stdout.write(event.data)
 *       break
 *     case 'tool_use':
 *       console.log(`Calling ${event.toolName}`)
 *       break
 *     case 'error':
 *       console.error(event.error)
 *       break
 *     case 'done':
 *       console.log('Stream complete')
 *       break
 *   }
 * }
 * ```
 */
export type StreamEvent =
  | StreamContentEvent
  | StreamToolUseEvent
  | StreamToolResultEvent
  | StreamErrorEvent
  | StreamDoneEvent

// ----------------------------------------------------------------------------
// Persistent Agent Stream Events
// ----------------------------------------------------------------------------

/**
 * Typed SSE event emitted by {@link StromboliClient.streamAgent}.
 *
 * Stromboli emits each event with an SSE `event:` name (e.g.
 * `agent.output`, `agent.error`, `agent.done`) and a JSON `data:` payload.
 * The shape of `data` is opaque to the SDK — consult the stromboli docs
 * for the schema of each event name.
 */
export interface AgentStreamMessageEvent {
  type: 'message'
  /** SSE event name, e.g. `agent.output`. Defaults to `'message'` when the server omits it. */
  event: string
  /** Parsed JSON payload, or the raw string if the payload was not valid JSON. */
  data: unknown
}

/**
 * Stream-level error event from {@link StromboliClient.streamAgent}.
 */
export interface AgentStreamErrorEvent {
  type: 'error'
  error: string
}

/**
 * Terminal event indicating the agent stream has closed.
 */
export interface AgentStreamDoneEvent {
  type: 'done'
}

/**
 * Discriminated union of agent stream events.
 *
 * @example
 * ```typescript
 * for await (const event of client.streamAgent('agent-abc')) {
 *   if (event.type === 'message') {
 *     console.log(event.event, event.data)
 *   }
 * }
 * ```
 */
export type AgentStreamEvent =
  | AgentStreamMessageEvent
  | AgentStreamErrorEvent
  | AgentStreamDoneEvent

/**
 * Options for streaming execution.
 */
export interface StreamOptions {
  /**
   * Connection timeout in milliseconds.
   * Maximum time to wait for initial connection.
   * @default 30000
   */
  connectionTimeout?: number

  /**
   * Idle timeout in milliseconds.
   * Maximum time to wait between chunks before aborting.
   * Use this to detect stalled streams.
   * @default 60000
   */
  idleTimeout?: number

  /**
   * Maximum total duration in milliseconds.
   * The stream will be aborted after this time regardless of activity.
   * Use this to prevent runaway streams.
   * @default undefined (no limit)
   */
  maxDuration?: number

  /**
   * AbortSignal to cancel the stream.
   * When aborted, the stream will throw a StromboliError with code 'ABORTED'.
   *
   * @example
   * ```typescript
   * const controller = new AbortController()
   * setTimeout(() => controller.abort(), 10000)
   *
   * for await (const event of client.stream(
   *   { prompt: 'Hello' },
   *   { signal: controller.signal }
   * )) {
   *   // Handle events...
   * }
   * ```
   */
  signal?: AbortSignal
}

// ============================================================================
// Wait For Job Options
// ============================================================================

/**
 * Options for the waitForJob helper.
 */
export interface WaitForJobOptions {
  /**
   * Polling interval in milliseconds.
   * @default 2000
   */
  pollInterval?: number

  /**
   * Maximum time to wait in milliseconds.
   * @default 300000 (5 minutes)
   */
  maxWaitTime?: number

  /**
   * Callback invoked when job status changes.
   */
  onStatusChange?: (status: JobStatus) => void
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Convert a SimpleRunRequest to the full API RunRequest format.
 * @internal
 */
function toApiRequest(request: SimpleRunRequest): RunRequest {
  return {
    prompt: request.prompt,
    workdir: request.workdir,
    webhook_url: request.webhookUrl,
    claude: {
      model: request.model,
      session_id: request.sessionId,
      resume: request.resume,
      continue: request.continueSession,
      max_budget_usd: request.maxBudgetUsd,
      system_prompt: request.systemPrompt,
      append_system_prompt: request.appendSystemPrompt,
      allowed_tools: request.allowedTools,
      disallowed_tools: request.disallowedTools,
      agent: request.agent,
      agents: request.agents,
    },
    podman: {
      timeout: request.timeout,
      memory: request.memory,
      volumes: request.volumes,
      secrets_env: request.secretsEnv,
      cpus: request.cpus,
      cpu_shares: request.cpuShares,
      image: request.image,
    },
  }
}

// ============================================================================
// Version Compatibility
// ============================================================================

/**
 * SDK version string, read from package.json.
 */
export const SDK_VERSION: string = packageJson.version

/**
 * Compatible API version range (semver).
 * The SDK is tested against APIs matching this range.
 */
export const API_VERSION_RANGE = '>=0.3.0-alpha'

/**
 * Check if an API version is compatible with this SDK.
 *
 * Uses basic semver comparison. Returns true if the API version
 * is greater than or equal to the minimum required version.
 *
 * @param apiVersion - The API version to check (e.g., '0.3.0')
 * @returns True if compatible, false otherwise
 *
 * @example
 * ```typescript
 * import { isCompatible } from 'stromboli-ts'
 *
 * const health = await client.health()
 * if (!isCompatible(health.version ?? '')) {
 *   console.warn(`API ${health.version} may not be compatible with this SDK`)
 * }
 * ```
 */
export function isCompatible(apiVersion: string): boolean {
  // Parse versions, stripping any pre-release suffix for comparison
  const parseVersion = (v: string): number[] => {
    const clean = v.replace(/^[>=<~^]*/, '').replace(/-.*$/, '')
    return clean.split('.').map((n) => Number.parseInt(n, 10) || 0)
  }

  const minVersion = parseVersion(API_VERSION_RANGE)
  const currentVersion = parseVersion(apiVersion)

  // Compare major.minor.patch
  for (let i = 0; i < 3; i++) {
    const min = minVersion[i] ?? 0
    const cur = currentVersion[i] ?? 0

    if (cur > min) return true
    if (cur < min) return false
  }

  return true // Equal versions are compatible
}

// ============================================================================
// Stromboli Client
// ============================================================================

/**
 * Main client for interacting with the Stromboli API.
 *
 * Stromboli orchestrates Claude Code execution in isolated Podman containers,
 * providing a secure and scalable way to run AI-powered coding tasks.
 *
 * @example
 * ```typescript
 * import { StromboliClient } from 'stromboli-ts'
 *
 * // Create client with URL string
 * const client = new StromboliClient('http://localhost:8585')
 *
 * // Or with options object
 * const client = new StromboliClient({
 *   baseUrl: 'http://localhost:8585',
 *   timeout: 60000,
 * })
 *
 * // Check API health
 * const health = await client.health()
 * console.log(`Stromboli ${health.version} is ${health.status}`)
 *
 * // Run Claude synchronously
 * const result = await client.run({
 *   prompt: 'What files are in this directory?',
 *   model: 'haiku',
 * })
 * console.log(result.output)
 *
 * // Run Claude asynchronously (for long tasks)
 * const job = await client.runAsync({
 *   prompt: 'Refactor the entire codebase',
 *   webhookUrl: 'https://my-app.com/webhook',
 * })
 *
 * // Check job status
 * const jobId = job.job_id ?? ''
 * const status = await client.getJob(jobId)
 * console.log(`Job ${status.id} is ${status.status}`)
 * ```
 */
export class StromboliClient {
  /** @internal */
  private readonly api: StromboliApiClient

  /** @internal */
  private readonly baseUrl: string

  /** @internal */
  private readonly options: Required<
    Pick<StromboliClientOptions, 'timeout' | 'retries' | 'retryBackoff'>
  > & {
    retryDelay: number | RetryDelayFn
  } & Pick<StromboliClientOptions, 'onRequest' | 'onResponse' | 'onError' | 'debug'>

  /**
   * Request timeout in milliseconds.
   * @readonly
   */
  readonly timeout: number

  /** @internal */
  private authToken?: string

  /** @internal - Stores last response metadata for interceptor */
  private lastResponseMeta?: { url: string; headers: Headers }

  /**
   * Create a new Stromboli client.
   *
   * @param options - Base URL string or configuration options
   *
   * @example
   * ```typescript
   * // Simple: just the URL
   * const client = new StromboliClient('http://localhost:8585')
   *
   * // Advanced: with options
   * const client = new StromboliClient({
   *   baseUrl: 'http://localhost:8585',
   *   timeout: 60000,
   *   debug: (msg, data) => console.log(`[stromboli] ${msg}`, data),
   * })
   * ```
   */
  constructor(options: StromboliClientOptions | string) {
    const opts = typeof options === 'string' ? { baseUrl: options } : options
    this.baseUrl = opts.baseUrl
    this.api = createStromboliClient(opts.baseUrl)
    this.timeout = opts.timeout ?? 30000
    this.options = {
      timeout: opts.timeout ?? 30000,
      retries: opts.retries ?? 0,
      retryDelay: opts.retryDelay ?? 1000,
      retryBackoff: opts.retryBackoff ?? 'exponential',
      onRequest: opts.onRequest,
      onResponse: opts.onResponse,
      onError: opts.onError,
      debug: opts.debug,
    }

    // Register middleware for auth injection, request ID tracking, and response capture
    this.api.use({
      onRequest: async ({ request }) => {
        // Generate request ID for correlation
        const requestId = this.generateRequestId()
        request.headers.set('X-Request-ID', requestId)

        // Auto-inject auth token if set
        if (this.authToken) {
          request.headers.set('Authorization', `Bearer ${this.authToken}`)
        }

        this.log('Request started', {
          id: requestId,
          method: request.method,
          url: request.url,
          authenticated: !!this.authToken,
        })

        // Store URL for response interceptor
        this.lastResponseMeta = { url: request.url, headers: new Headers() }

        return request
      },
      onResponse: async ({ response }) => {
        // Store response headers for interceptor
        if (this.lastResponseMeta) {
          this.lastResponseMeta.headers = response.headers
        }
        return response
      },
    })
  }

  // ==========================================================================
  // Internal Helpers
  // ==========================================================================

  /**
   * Generate a unique request ID for correlation.
   * Format: req_<timestamp>_<random>
   * @internal
   */
  private generateRequestId(): string {
    return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
  }

  /**
   * Log a debug message if debug callback is set.
   * @internal
   */
  private log(message: string, data?: unknown): void {
    this.options.debug?.(message, data)
  }

  // ==========================================================================
  // Internal Request Handling
  // ==========================================================================

  /**
   * Check if an error should trigger a retry.
   * @internal
   */
  private shouldRetry(error: StromboliError, attempt: number): boolean {
    if (attempt > this.options.retries) return false
    // Retry on network errors and 5xx status codes
    return error.code === 'NETWORK_ERROR' || (error.status !== undefined && error.status >= 500)
  }

  /**
   * Calculate delay before next retry.
   * @internal
   */
  private getRetryDelay(attempt: number): number {
    const { retryDelay, retryBackoff } = this.options

    // Default base delay for custom functions
    const defaultBaseDelay = typeof retryDelay === 'number' ? retryDelay : 1000

    // If retryDelay is a function, use it with the configured or default base delay
    if (typeof retryDelay === 'function') {
      return retryDelay(attempt, defaultBaseDelay)
    }

    // Otherwise use built-in strategies
    return retryBackoff === 'exponential' ? retryDelay * 2 ** (attempt - 1) : retryDelay * attempt
  }

  /**
   * Execute a request with timeout, error handling, and retry logic.
   * @internal
   *
   * @param fn - Function that executes the request
   * @param externalSignal - Optional AbortSignal from caller for cancellation
   * @param attempt - Current retry attempt (internal use)
   */
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Core request method with retry/timeout/abort handling
  private async request<T>(
    fn: (signal: AbortSignal) => Promise<ApiResult<T>>,
    externalSignal?: AbortSignal,
    attempt = 1
  ): Promise<T> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.options.timeout)

    // Link external signal for user-initiated cancellation
    if (externalSignal) {
      if (externalSignal.aborted) {
        const abortedError = StromboliError.abortedError()
        this.options.onError?.(abortedError)
        throw abortedError
      }
      externalSignal.addEventListener('abort', () => {
        this.log('Request aborted by user')
        controller.abort()
      })
    }

    try {
      // Call onRequest interceptor if provided
      if (this.options.onRequest) {
        await this.options.onRequest({ signal: controller.signal })
      }

      const result = await fn(controller.signal)
      const { data, error, response } = result

      // Call onResponse interceptor if provided
      if (this.options.onResponse && response) {
        const interceptorResponse: InterceptorResponse = {
          status: response.status,
          headers: this.lastResponseMeta?.headers ?? new Headers(),
          url: this.lastResponseMeta?.url ?? '',
          ok: response.status >= 200 && response.status < 300,
        }
        await this.options.onResponse(interceptorResponse)
      }

      this.log('Request completed', { status: response.status, attempt })

      if (error || !data) {
        const stromboliError = StromboliError.fromResponse(response.status, error)
        this.options.onError?.(stromboliError)

        // Retry on 5xx errors
        if (this.shouldRetry(stromboliError, attempt)) {
          clearTimeout(timeoutId)
          const delay = this.getRetryDelay(attempt)
          this.log('Retrying request', { attempt: attempt + 1, delay, reason: stromboliError.code })
          await new Promise((r) => setTimeout(r, delay))
          return this.request(fn, externalSignal, attempt + 1)
        }

        throw stromboliError
      }

      return data
    } catch (err) {
      clearTimeout(timeoutId)

      // Re-throw StromboliError as-is (already handled above)
      if (err instanceof StromboliError) {
        throw err
      }

      // Handle abort - check if it was user-initiated vs timeout
      if (err instanceof DOMException && err.name === 'AbortError') {
        // If external signal was aborted, it's a user cancellation
        if (externalSignal?.aborted) {
          const abortedError = StromboliError.abortedError()
          this.options.onError?.(abortedError)
          throw abortedError
        }
        // Otherwise it's a timeout
        const timeoutError = StromboliError.timeoutError(this.options.timeout)
        this.options.onError?.(timeoutError)
        throw timeoutError
      }

      // Handle network errors (fetch failures, DNS errors, etc.)
      const networkError = StromboliError.networkError(err)
      this.options.onError?.(networkError)

      // Retry on network errors
      if (this.shouldRetry(networkError, attempt)) {
        const delay = this.getRetryDelay(attempt)
        this.log('Retrying request', { attempt: attempt + 1, delay, reason: 'NETWORK_ERROR' })
        await new Promise((r) => setTimeout(r, delay))
        return this.request(fn, externalSignal, attempt + 1)
      }

      throw networkError
    } finally {
      clearTimeout(timeoutId)
    }
  }

  /**
   * Run a synchronous Claude session in an isolated container.
   *
   * This method blocks until Claude completes the task. For long-running
   * tasks, consider using {@link runAsync} instead.
   *
   * @param request - Run configuration (simple or full format)
   * @returns Claude's response with output and session ID
   * @throws {StromboliError} When the API returns an error
   *
   * @example
   * ```typescript
   * // Simple usage
   * const result = await client.run({
   *   prompt: 'Hello, Claude!',
   *   model: 'haiku',
   * })
   * console.log(result.output)
   *
   * // With workspace and tools
   * const result = await client.run({
   *   prompt: 'Run the tests and fix any failures',
   *   workdir: '/workspace',
   *   allowedTools: ['Bash', 'Read', 'Edit'],
   *   timeout: '10m',
   * })
   *
   * // Continue conversation
   * const followUp = await client.run({
   *   prompt: 'Now add more test coverage',
   *   sessionId: result.session_id,
   *   resume: true,
   * })
   * ```
   *
   * @see {@link runAsync} - For long-running tasks
   * @see {@link SimpleRunRequest} - Available options
   */
  async run(request: SimpleRunRequest | RunRequest): Promise<RunResponse> {
    const apiRequest = 'claude' in request ? request : toApiRequest(request)
    const externalSignal = 'signal' in request ? request.signal : undefined

    return this.request(
      (signal) =>
        this.api.POST('/run', {
          body: apiRequest,
          signal,
        }) as Promise<ApiResult<RunResponse>>,
      externalSignal
    )
  }

  /**
   * Start an asynchronous Claude session.
   *
   * Returns immediately with a job ID. Use {@link getJob} to poll for
   * results, or provide a `webhookUrl` to be notified when complete.
   *
   * @param request - Run configuration (simple or full format)
   * @returns Job ID for tracking the execution
   * @throws {StromboliError} When the API returns an error
   *
   * @example
   * ```typescript
   * // Start async job
   * const job = await client.runAsync({
   *   prompt: 'Perform a comprehensive code review',
   *   model: 'opus',
   * })
   * console.log(`Started job: ${job.job_id}`)
   *
   * // Poll for completion
   * let status = await client.getJob(job.job_id!)
   * while (status.status === 'pending' || status.status === 'running') {
   *   await new Promise(r => setTimeout(r, 5000)) // Wait 5s
   *   status = await client.getJob(job.job_id!)
   * }
   * console.log(status.output)
   *
   * // Or use webhook
   * const job = await client.runAsync({
   *   prompt: 'Long running task...',
   *   webhookUrl: 'https://my-app.com/webhook',
   * })
   * ```
   *
   * @see {@link run} - For quick, synchronous tasks
   * @see {@link getJob} - To check job status
   * @see {@link cancelJob} - To cancel a running job
   */
  async runAsync(request: SimpleRunRequest | RunRequest): Promise<AsyncRunResponse> {
    const apiRequest = 'claude' in request ? request : toApiRequest(request)
    const externalSignal = 'signal' in request ? request.signal : undefined

    return this.request(
      (signal) =>
        this.api.POST('/run/async', {
          body: apiRequest,
          signal,
        }) as Promise<ApiResult<AsyncRunResponse>>,
      externalSignal
    )
  }

  /**
   * Get the status and result of an async job.
   *
   * @param jobId - The job ID returned by {@link runAsync}
   * @returns Current job status and output (if completed)
   * @throws {StromboliError} When the job is not found or API error
   *
   * @example
   * ```typescript
   * const status = await client.getJob('job-abc123')
   *
   * switch (status.status) {
   *   case 'completed':
   *     console.log('Output:', status.output)
   *     break
   *   case 'failed':
   *     console.error('Error:', status.error)
   *     break
   *   case 'running':
   *     console.log('Still running...')
   *     break
   * }
   * ```
   *
   * @see {@link runAsync} - To start an async job
   * @see {@link listJobs} - To list all jobs
   */
  async getJob(jobId: string): Promise<JobResponse> {
    return this.request(
      (signal) =>
        this.api.GET('/jobs/{id}', {
          params: { path: { id: jobId } },
          signal,
        }) as Promise<ApiResult<JobResponse>>
    )
  }

  /**
   * List all async jobs.
   *
   * @returns List of all jobs with their current status
   * @throws {StromboliError} When the API returns an error
   *
   * @example
   * ```typescript
   * const { jobs } = await client.listJobs()
   *
   * for (const job of jobs ?? []) {
   *   console.log(`${job.id}: ${job.status}`)
   * }
   *
   * // Filter running jobs
   * const running = jobs?.filter(j => j.status === 'running')
   * ```
   *
   * @see {@link getJob} - To get a specific job
   * @see {@link cancelJob} - To cancel a job
   */
  async listJobs(): Promise<JobListResponse> {
    return this.request(
      (signal) => this.api.GET('/jobs', { signal }) as Promise<ApiResult<JobListResponse>>
    )
  }

  /**
   * Cancel a running or pending job.
   *
   * @param jobId - The job ID to cancel
   * @throws {StromboliError} When the job is not found or cannot be cancelled
   *
   * @example
   * ```typescript
   * await client.cancelJob('job-abc123')
   * console.log('Job cancelled')
   * ```
   *
   * @see {@link runAsync} - To start an async job
   * @see {@link getJob} - To check job status
   */
  async cancelJob(jobId: string): Promise<void> {
    await this.request(
      (signal) =>
        this.api.DELETE('/jobs/{id}', {
          params: { path: { id: jobId } },
          signal,
        }) as Promise<ApiResult<unknown>>
    )
  }

  /**
   * Check the API health status.
   *
   * Use this to verify the Stromboli server is running and all
   * components (Podman, Claude) are properly configured.
   *
   * @returns Health status with version and component details
   * @throws {StromboliError} When the API is unreachable
   *
   * @example
   * ```typescript
   * const health = await client.health()
   *
   * console.log(`Stromboli v${health.version}`)
   * console.log(`Status: ${health.status}`)
   *
   * for (const component of health.components ?? []) {
   *   console.log(`  ${component.name}: ${component.status}`)
   * }
   * ```
   *
   * @see {@link claudeStatus} - To check Claude configuration specifically
   */
  async health(): Promise<HealthResponse> {
    return this.request(
      (signal) => this.api.GET('/health', { signal }) as Promise<ApiResult<HealthResponse>>
    )
  }

  /**
   * List all existing sessions.
   *
   * Sessions store conversation history and can be resumed with
   * the `resume: true` option in {@link run} or {@link runAsync}.
   *
   * @returns List of session IDs
   * @throws {StromboliError} When the API returns an error
   *
   * @example
   * ```typescript
   * const { sessions } = await client.listSessions()
   *
   * for (const sessionId of sessions ?? []) {
   *   console.log(`Session: ${sessionId}`)
   * }
   * ```
   *
   * @see {@link deleteSession} - To delete a session
   * @see {@link getSessionMessages} - To view session history
   */
  async listSessions(): Promise<SessionListResponse> {
    return this.request(
      (signal) => this.api.GET('/sessions', { signal }) as Promise<ApiResult<SessionListResponse>>
    )
  }

  /**
   * Delete a session and its conversation history.
   *
   * @param sessionId - The session ID to delete
   * @returns Confirmation of deletion
   * @throws {StromboliError} When the session is not found or API error
   *
   * @example
   * ```typescript
   * const result = await client.deleteSession('sess-abc123')
   *
   * if (result.success) {
   *   console.log(`Deleted session: ${result.session_id}`)
   * }
   * ```
   *
   * @see {@link listSessions} - To list all sessions
   */
  async deleteSession(sessionId: string): Promise<SessionDestroyResponse> {
    return this.request(
      (signal) =>
        this.api.DELETE('/sessions/{id}', {
          params: { path: { id: sessionId } },
          signal,
        }) as Promise<ApiResult<SessionDestroyResponse>>
    )
  }

  /**
   * Get paginated messages from a session's conversation history.
   *
   * @param sessionId - The session ID to fetch messages from
   * @param options - Pagination options
   * @param options.offset - Number of messages to skip (default: 0)
   * @param options.limit - Maximum messages to return (default: 50)
   * @returns Paginated list of conversation messages
   * @throws {StromboliError} When the session is not found or API error
   *
   * @example
   * ```typescript
   * // Get first page
   * const page1 = await client.getSessionMessages('sess-abc123', {
   *   limit: 10,
   * })
   *
   * for (const msg of page1.messages ?? []) {
   *   console.log(`[${msg.type}] ${msg.content}`)
   * }
   *
   * // Get next page if available
   * if (page1.has_more) {
   *   const page2 = await client.getSessionMessages('sess-abc123', {
   *     offset: 10,
   *     limit: 10,
   *   })
   * }
   * ```
   *
   * @see {@link listSessions} - To list all sessions
   */
  async getSessionMessages(
    sessionId: string,
    options?: { offset?: number; limit?: number }
  ): Promise<SessionMessagesResponse> {
    return this.request(
      (signal) =>
        this.api.GET('/sessions/{id}/messages', {
          params: {
            path: { id: sessionId },
            query: options,
          },
          signal,
        }) as Promise<ApiResult<SessionMessagesResponse>>
    )
  }

  /**
   * Fetch a single message from a session by message ID.
   *
   * Use this when you have a specific message UUID from
   * {@link getSessionMessages} and want the full record.
   *
   * @param sessionId - The session ID
   * @param messageId - The message UUID
   * @returns The matching session message
   * @throws {StromboliError} When the session or message is not found
   *
   * @example
   * ```typescript
   * const page = await client.getSessionMessages('sess-abc123', { limit: 10 })
   * const first = page.messages?.[0]
   * if (first?.uuid) {
   *   const msg = await client.getSessionMessage('sess-abc123', first.uuid)
   *   console.log(msg)
   * }
   * ```
   *
   * @see {@link getSessionMessages} - To list session messages
   */
  async getSessionMessage(sessionId: string, messageId: string): Promise<SessionMessageResponse> {
    return this.request(
      (signal) =>
        this.api.GET('/sessions/{id}/messages/{message_id}', {
          params: {
            path: { id: sessionId, message_id: messageId },
          },
          signal,
        }) as Promise<ApiResult<SessionMessageResponse>>
    )
  }

  /**
   * Check Claude configuration status.
   *
   * Verifies that Claude credentials are properly configured
   * in the Stromboli server.
   *
   * @returns Configuration status with message
   * @throws {StromboliError} When the API returns an error
   *
   * @example
   * ```typescript
   * const status = await client.claudeStatus()
   *
   * if (status.configured) {
   *   console.log('Claude is ready!')
   * } else {
   *   console.error('Claude not configured:', status.message)
   * }
   * ```
   *
   * @see {@link health} - For overall API health
   */
  async claudeStatus(): Promise<ClaudeStatusResponse> {
    return this.request(
      (signal) =>
        this.api.GET('/claude/status', { signal }) as Promise<ApiResult<ClaudeStatusResponse>>
    )
  }

  // ==========================================================================
  // Secrets Management
  // ==========================================================================

  /**
   * List all available Podman secrets.
   *
   * These secrets can be injected into containers using the
   * `secretsEnv` option in {@link run} or {@link runAsync}.
   *
   * @returns List of available secret names
   * @throws {StromboliError} When the API returns an error
   *
   * @example
   * ```typescript
   * const { secrets } = await client.listSecrets()
   *
   * for (const secret of secrets ?? []) {
   *   console.log(`Secret: ${secret}`)
   * }
   *
   * // Use a secret in a run
   * if (secrets?.includes('github-token')) {
   *   await client.run({
   *     prompt: 'Clone a private repo',
   *     secretsEnv: { 'GH_TOKEN': 'github-token' },
   *   })
   * }
   * ```
   */
  async listSecrets(): Promise<SecretsListResponse> {
    return this.request(
      (signal) => this.api.GET('/secrets', { signal }) as Promise<ApiResult<SecretsListResponse>>
    )
  }

  /**
   * Create a new Podman secret.
   *
   * The secret value is write-once — the API never returns it back. Read
   * operations only expose metadata via {@link getSecret}.
   *
   * @param request - Secret name and value
   * @returns Result of creation (success flag, name)
   * @throws {StromboliError} When the API returns an error or the secret already exists
   *
   * @example
   * ```typescript
   * const result = await client.createSecret({
   *   name: 'github-token',
   *   value: process.env.GH_TOKEN!,
   * })
   *
   * if (!result.success) {
   *   console.error('Failed:', result.error)
   * }
   * ```
   *
   * @see {@link listSecrets} - To list all secrets
   * @see {@link deleteSecret} - To remove a secret
   */
  async createSecret(request: CreateSecretRequest): Promise<CreateSecretResponse> {
    return this.request(
      (signal) =>
        this.api.POST('/secrets', {
          body: request,
          signal,
        }) as Promise<ApiResult<CreateSecretResponse>>
    )
  }

  /**
   * Get metadata for a single secret.
   *
   * The actual secret value is never returned — only id, name, and
   * timestamps.
   *
   * @param name - Secret name
   * @returns Secret metadata
   * @throws {StromboliError} When the secret is not found
   *
   * @example
   * ```typescript
   * const meta = await client.getSecret('github-token')
   * console.log(`Created: ${meta.created_at}`)
   * ```
   *
   * @see {@link listSecrets} - To enumerate secrets
   */
  async getSecret(name: string): Promise<SecretInfo> {
    return this.request(
      (signal) =>
        this.api.GET('/secrets/{name}', {
          params: { path: { name } },
          signal,
        }) as Promise<ApiResult<SecretInfo>>
    )
  }

  /**
   * Delete a Podman secret by name.
   *
   * @param name - Secret name to delete
   * @returns Result of deletion (success flag, name)
   * @throws {StromboliError} When the secret is not found or in use
   *
   * @example
   * ```typescript
   * const result = await client.deleteSecret('github-token')
   * if (result.success) {
   *   console.log('Secret deleted')
   * }
   * ```
   *
   * @see {@link createSecret} - To create a secret
   */
  async deleteSecret(name: string): Promise<DeleteSecretResponse> {
    return this.request(
      (signal) =>
        this.api.DELETE('/secrets/{name}', {
          params: { path: { name } },
          signal,
        }) as Promise<ApiResult<DeleteSecretResponse>>
    )
  }

  // ==========================================================================
  // Authentication
  // ==========================================================================

  /**
   * Check if the client has an auth token set.
   *
   * Note: This only checks local state, not token validity.
   * Use {@link validateToken} to verify with the server.
   *
   * @returns True if an auth token is set, false otherwise
   *
   * @example
   * ```typescript
   * if (!client.isAuthenticated()) {
   *   await client.authenticate('my-client-id')
   * }
   * ```
   */
  isAuthenticated(): boolean {
    return this.authToken !== undefined
  }

  /**
   * Set the authentication token for API requests.
   *
   * Use this to manually set a token obtained through other means.
   * For new authentication, use {@link authenticate} instead.
   *
   * @param token - JWT access token
   *
   * @example
   * ```typescript
   * // Set token from environment
   * client.setAuthToken(process.env.STROMBOLI_TOKEN!)
   * ```
   */
  setAuthToken(token: string): void {
    this.authToken = token
  }

  /**
   * Get the current authentication token.
   *
   * @returns The current JWT access token, or undefined if not authenticated
   */
  getAuthToken(): string | undefined {
    return this.authToken
  }

  /**
   * Authenticate with the Stromboli API using client credentials.
   *
   * On success, stores the access token for subsequent requests.
   *
   * @param clientId - API client ID
   * @returns Token response with access and refresh tokens
   * @throws {StromboliError} When authentication fails
   *
   * @example
   * ```typescript
   * const tokens = await client.authenticate('my-client-id')
   * console.log(`Authenticated! Token expires in ${tokens.expires_in}s`)
   *
   * // Token is automatically used for subsequent requests
   * await client.run({ prompt: 'Hello!' })
   * ```
   *
   * @see {@link refreshToken} - To refresh an expired token
   * @see {@link logout} - To invalidate the token
   */
  async authenticate(clientId: string): Promise<TokenResponse> {
    const response = await this.request(
      (signal) =>
        this.api.POST('/auth/token', {
          body: { client_id: clientId },
          signal,
        }) as Promise<ApiResult<TokenResponse>>
    )

    if (response.access_token) {
      this.authToken = response.access_token
    }

    return response
  }

  /**
   * Refresh the authentication token.
   *
   * Use this to obtain a new access token before the current one expires.
   *
   * @param refreshToken - Refresh token from initial authentication
   * @returns New token response
   * @throws {StromboliError} When refresh fails
   *
   * @example
   * ```typescript
   * // Store refresh token during authentication
   * const { refresh_token } = await client.authenticate('my-client-id')
   *
   * // Later, when access token is about to expire
   * const newTokens = await client.refreshToken(refresh_token!)
   * console.log(`New token expires in ${newTokens.expires_in}s`)
   * ```
   *
   * @see {@link authenticate} - For initial authentication
   */
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const response = await this.request(
      (signal) =>
        this.api.POST('/auth/refresh', {
          body: { refresh_token: refreshToken },
          signal,
        }) as Promise<ApiResult<TokenResponse>>
    )

    if (response.access_token) {
      this.authToken = response.access_token
    }

    return response
  }

  /**
   * Validate the current authentication token.
   *
   * @returns Validation response with token claims
   * @throws {StromboliError} When token is invalid or expired
   *
   * @example
   * ```typescript
   * try {
   *   const validation = await client.validateToken()
   *   console.log(`Token valid for: ${validation.subject}`)
   *   console.log(`Expires at: ${new Date(validation.expires_at! * 1000)}`)
   * } catch (error) {
   *   console.log('Token is invalid or expired')
   * }
   * ```
   */
  async validateToken(): Promise<ValidateResponse> {
    return this.request(
      (signal) => this.api.GET('/auth/validate', { signal }) as Promise<ApiResult<ValidateResponse>>
    )
  }

  /**
   * Logout and invalidate the current token.
   *
   * After calling this, the token will no longer be accepted by the API.
   *
   * @throws {StromboliError} When logout fails
   *
   * @example
   * ```typescript
   * await client.logout()
   * console.log('Logged out successfully')
   * ```
   *
   * @see {@link authenticate} - To authenticate again
   */
  async logout(): Promise<void> {
    await this.request(
      (signal) => this.api.POST('/auth/logout', { signal }) as Promise<ApiResult<unknown>>
    )
    this.authToken = undefined
  }

  // ==========================================================================
  // Streaming
  // ==========================================================================

  /**
   * Execute Claude and stream output in real-time.
   *
   * This is an async generator that yields events as Claude produces output.
   * Useful for showing progress during long-running tasks.
   *
   * @param request - Run configuration (simple or full format)
   * @param options - Streaming options (timeouts)
   * @yields Stream events with Claude's output
   * @throws {StromboliError} When the API returns an error
   *
   * @example
   * ```typescript
   * for await (const event of client.stream({
   *   prompt: 'Count from 1 to 10 slowly',
   *   model: 'haiku',
   * })) {
   *   switch (event.type) {
   *     case 'content':
   *       process.stdout.write(event.data)
   *       break
   *     case 'error':
   *       console.error('Error:', event.error)
   *       break
   *     case 'done':
   *       console.log('\nDone!')
   *       break
   *   }
   * }
   * ```
   *
   * @example With custom timeouts
   * ```typescript
   * for await (const event of client.stream(
   *   { prompt: 'Long task...' },
   *   { connectionTimeout: 10000, idleTimeout: 120000 }
   * )) {
   *   // Handle events...
   * }
   * ```
   *
   * @see {@link run} - For non-streaming execution
   * @see {@link StreamOptions} - Available options
   */
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Streaming with multiple timeout types and SSE parsing
  async *stream(
    request: SimpleRunRequest | RunRequest,
    options: StreamOptions = {}
  ): AsyncGenerator<StreamEvent> {
    const apiRequest = 'claude' in request ? request : toApiRequest(request)
    const {
      connectionTimeout = 30000,
      idleTimeout = 60000,
      maxDuration,
      signal: externalSignal,
    } = options

    // Build query params for GET /run/stream
    const params = new URLSearchParams({
      prompt: apiRequest.prompt,
    })

    if (apiRequest.workdir) {
      params.set('workdir', apiRequest.workdir)
    }

    if (apiRequest.claude?.session_id) {
      params.set('session_id', apiRequest.claude.session_id)
    }

    const controller = new AbortController()
    let idleTimer: ReturnType<typeof setTimeout> | undefined
    let connectionTimer: ReturnType<typeof setTimeout> | undefined
    let maxDurationTimer: ReturnType<typeof setTimeout> | undefined
    let isConnected = false
    let isUserAborted = false
    let isMaxDurationExceeded = false

    // Link external signal for user-initiated cancellation
    if (externalSignal) {
      if (externalSignal.aborted) {
        throw StromboliError.abortedError()
      }
      externalSignal.addEventListener('abort', () => {
        isUserAborted = true
        this.log('Stream aborted by user')
        controller.abort()
      })
    }

    // Helper to reset idle timer
    const resetIdleTimer = () => {
      if (idleTimer) clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        this.log('Stream idle timeout', { idleTimeout })
        controller.abort()
      }, idleTimeout)
    }

    // Connection timeout
    connectionTimer = setTimeout(() => {
      if (!isConnected) {
        this.log('Stream connection timeout', { connectionTimeout })
        controller.abort()
      }
    }, connectionTimeout)

    // Max duration timeout (overall stream limit)
    if (maxDuration !== undefined) {
      maxDurationTimer = setTimeout(() => {
        isMaxDurationExceeded = true
        this.log('Stream max duration exceeded', { maxDuration })
        controller.abort()
      }, maxDuration)
    }

    try {
      // We need to use fetch directly for SSE streaming
      const url = `${this.baseUrl}/run/stream?${params.toString()}`
      const requestId = this.generateRequestId()

      const headers: Record<string, string> = {
        Accept: 'text/event-stream',
        'X-Request-ID': requestId,
      }

      if (this.authToken) {
        headers.Authorization = `Bearer ${this.authToken}`
      }

      this.log('Stream started', { id: requestId, url })

      const response = await fetch(url, {
        method: 'GET',
        headers,
        signal: controller.signal,
      })

      // Connected - clear connection timeout and start idle timer
      isConnected = true
      if (connectionTimer) clearTimeout(connectionTimer)
      resetIdleTimer()

      if (!response.ok) {
        throw StromboliError.fromResponse(response.status, await response.text())
      }

      if (!response.body) {
        throw new StromboliError('No response body', 'STREAM_ERROR')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          this.log('Stream completed')
          yield { type: 'done' }
          break
        }

        // Reset idle timer on each chunk
        resetIdleTimer()

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              yield { type: 'done' }
              return
            }
            yield { type: 'content', data }
          } else if (line.startsWith('error: ')) {
            yield { type: 'error', error: line.slice(7) }
          }
        }
      }
    } catch (err) {
      if (err instanceof StromboliError) {
        throw err
      }

      if (err instanceof DOMException && err.name === 'AbortError') {
        // Check abort reasons in priority order
        if (isUserAborted) {
          throw StromboliError.abortedError()
        }

        if (isMaxDurationExceeded) {
          this.log('Stream timeout', { type: 'MAX_DURATION', timeout: maxDuration })
          throw new StromboliError(
            `Stream exceeded max duration of ${maxDuration}ms`,
            'MAX_DURATION_EXCEEDED'
          )
        }

        // Determine if it was connection timeout or idle timeout
        const timeout = isConnected ? idleTimeout : connectionTimeout
        const errorType = isConnected ? 'IDLE_TIMEOUT' : 'CONNECTION_TIMEOUT'
        this.log('Stream timeout', { type: errorType, timeout })
        throw new StromboliError(
          isConnected
            ? `Stream idle timeout after ${idleTimeout}ms`
            : `Stream connection timeout after ${connectionTimeout}ms`,
          errorType
        )
      }

      throw StromboliError.networkError(err)
    } finally {
      if (idleTimer) clearTimeout(idleTimer)
      if (connectionTimer) clearTimeout(connectionTimer)
      if (maxDurationTimer) clearTimeout(maxDurationTimer)
    }
  }

  // ==========================================================================
  // Helpers
  // ==========================================================================

  /**
   * Wait for an async job to complete.
   *
   * Polls the job status until it reaches a terminal state
   * (completed, failed, crashed, or cancelled).
   *
   * @param jobId - The job ID to wait for
   * @param options - Polling options
   * @returns Final job response
   * @throws {StromboliError} When polling times out or job fails
   *
   * @example
   * ```typescript
   * const job = await client.runAsync({
   *   prompt: 'Long running task...',
   * })
   *
   * const result = await client.waitForJob(job.job_id ?? '', {
   *   pollInterval: 2000,
   *   maxWaitTime: 300000, // 5 minutes
   *   onStatusChange: (status) => console.log(`Status: ${status}`),
   * })
   *
   * console.log('Result:', result.output)
   * ```
   *
   * @see {@link runAsync} - To start an async job
   * @see {@link getJob} - To check job status once
   */
  async waitForJob(jobId: string, options?: WaitForJobOptions): Promise<JobResponse> {
    const pollInterval = options?.pollInterval ?? 2000
    const maxWaitTime = options?.maxWaitTime ?? 300000
    const startTime = Date.now()
    let lastStatus: JobStatus | undefined

    while (true) {
      const job = await this.getJob(jobId)
      const currentStatus = job.status

      // Notify on status change
      if (currentStatus !== lastStatus) {
        options?.onStatusChange?.(currentStatus as JobStatus)
        lastStatus = currentStatus as JobStatus
      }

      // Check for terminal states
      if (
        currentStatus === 'completed' ||
        currentStatus === 'failed' ||
        currentStatus === 'crashed' ||
        currentStatus === 'cancelled'
      ) {
        return job
      }

      // Check timeout
      if (Date.now() - startTime > maxWaitTime) {
        throw new StromboliError(
          `Job ${jobId} did not complete within ${maxWaitTime}ms`,
          'TIMEOUT_ERROR'
        )
      }

      // Wait before next poll
      await new Promise((r) => setTimeout(r, pollInterval))
    }
  }

  // ==========================================================================
  // Persistent Agents
  // ==========================================================================

  /**
   * List all persistent agents.
   *
   * Persistent agents are long-lived Claude containers that survive between
   * turns, letting you stream a multi-turn conversation through a single
   * Claude process. Use {@link spawnAgent} to start one.
   *
   * @returns Array of agent snapshots
   * @throws {StromboliError} When the API returns an error
   *
   * @example
   * ```typescript
   * const agents = await client.listAgents()
   * for (const agent of agents) {
   *   console.log(`${agent.id}: ${agent.status} (${agent.turns_completed} turns)`)
   * }
   * ```
   *
   * @see {@link spawnAgent} - To create a new agent
   */
  async listAgents(): Promise<AgentSnapshot[]> {
    return this.request(
      (signal) => this.api.GET('/agents', { signal }) as Promise<ApiResult<AgentSnapshot[]>>
    )
  }

  /**
   * Spawn a new persistent agent.
   *
   * Launches a long-lived Claude container with stream-json I/O. The agent
   * stays running until you call {@link stopAgent}, the idle watchdog fires,
   * or the server shuts down.
   *
   * @param request - Agent configuration
   * @returns Spawned agent metadata (id, session_id, status, etc.)
   * @throws {StromboliError} When the request is invalid or spawn fails
   *
   * @example
   * ```typescript
   * const agent = await client.spawnAgent({
   *   prompt: 'You are an on-call assistant.',
   *   workdir: '/workspace',
   *   idle_timeout_seconds: 1800,
   * })
   * console.log(`Spawned agent ${agent.id}`)
   * ```
   *
   * @see {@link sendToAgent} - To send a turn
   * @see {@link streamAgent} - To consume agent output
   * @see {@link stopAgent} - To shut down the agent
   */
  async spawnAgent(request: SpawnAgentRequest): Promise<SpawnAgentResponse> {
    return this.request(
      (signal) =>
        this.api.POST('/agents', {
          body: request,
          signal,
        }) as Promise<ApiResult<SpawnAgentResponse>>
    )
  }

  /**
   * Get the current snapshot of a persistent agent.
   *
   * @param agentId - The agent ID
   * @returns Current agent snapshot
   * @throws {StromboliError} When the agent is not found
   *
   * @example
   * ```typescript
   * const agent = await client.getAgent('agent-abc123')
   * if (agent.status === 'running') {
   *   console.log(`${agent.turns_completed} turns processed`)
   * }
   * ```
   */
  async getAgent(agentId: string): Promise<AgentSnapshot> {
    return this.request(
      (signal) =>
        this.api.GET('/agents/{id}', {
          params: { path: { id: agentId } },
          signal,
        }) as Promise<ApiResult<AgentSnapshot>>
    )
  }

  /**
   * Stop a persistent agent.
   *
   * Sends a graceful shutdown to the underlying Claude container.
   * The agent's session history is preserved.
   *
   * @param agentId - The agent ID to stop
   * @throws {StromboliError} When the agent is not found
   *
   * @example
   * ```typescript
   * await client.stopAgent('agent-abc123')
   * ```
   *
   * @see {@link spawnAgent} - To start an agent
   */
  async stopAgent(agentId: string): Promise<void> {
    await this.request(
      (signal) =>
        this.api.DELETE('/agents/{id}', {
          params: { path: { id: agentId } },
          signal,
        }) as Promise<ApiResult<unknown>>
    )
  }

  /**
   * Send a turn to a running persistent agent.
   *
   * Appends a prompt to the agent's stream-json stdin. The output for this
   * turn is delivered via {@link streamAgent}, not in the response body —
   * this method only returns an acknowledgement with a `turn_id` once the
   * server has accepted the input.
   *
   * @param agentId - The agent ID
   * @param request - Turn payload (prompt is required)
   * @returns Acknowledgement with the turn ID
   * @throws {StromboliError} When the agent is not found or not accepting input
   *
   * @example
   * ```typescript
   * const ack = await client.sendToAgent('agent-abc123', {
   *   prompt: 'What\'s the latest alert?',
   * })
   * console.log(`Turn started: ${ack.turn_id}`)
   *
   * // Consume output via streamAgent in a separate task
   * ```
   *
   * @see {@link streamAgent} - To read agent output
   */
  async sendToAgent(agentId: string, request: SendAgentRequest): Promise<SendAgentResponse> {
    return this.request(
      (signal) =>
        this.api.POST('/agents/{id}/send', {
          params: { path: { id: agentId } },
          body: request,
          signal,
        }) as Promise<ApiResult<SendAgentResponse>>
    )
  }

  /**
   * Stream events from a persistent agent (SSE).
   *
   * Yields each `agent.*` event the server emits — typically one per turn
   * boundary plus incremental output events. The connection stays open until
   * the agent stops, the caller aborts, or an idle timeout fires.
   *
   * @param agentId - The agent ID to stream from
   * @param options - Streaming options (timeouts, abort signal)
   * @yields Agent stream events
   * @throws {StromboliError} On HTTP errors, timeouts, or aborts
   *
   * @example
   * ```typescript
   * for await (const event of client.streamAgent('agent-abc123')) {
   *   switch (event.type) {
   *     case 'message':
   *       console.log(event.event, event.data)
   *       break
   *     case 'error':
   *       console.error(event.error)
   *       break
   *     case 'done':
   *       return
   *   }
   * }
   * ```
   *
   * @see {@link sendToAgent} - To send a turn
   */
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: SSE parsing with multiple timeout types
  async *streamAgent(
    agentId: string,
    options: StreamOptions = {}
  ): AsyncGenerator<AgentStreamEvent> {
    const {
      connectionTimeout = 30000,
      idleTimeout = 60000,
      maxDuration,
      signal: externalSignal,
    } = options

    const controller = new AbortController()
    let idleTimer: ReturnType<typeof setTimeout> | undefined
    let connectionTimer: ReturnType<typeof setTimeout> | undefined
    let maxDurationTimer: ReturnType<typeof setTimeout> | undefined
    let isConnected = false
    let isUserAborted = false
    let isMaxDurationExceeded = false

    if (externalSignal) {
      if (externalSignal.aborted) {
        throw StromboliError.abortedError()
      }
      externalSignal.addEventListener('abort', () => {
        isUserAborted = true
        this.log('Agent stream aborted by user')
        controller.abort()
      })
    }

    const resetIdleTimer = () => {
      if (idleTimer) clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        this.log('Agent stream idle timeout', { idleTimeout })
        controller.abort()
      }, idleTimeout)
    }

    connectionTimer = setTimeout(() => {
      if (!isConnected) {
        this.log('Agent stream connection timeout', { connectionTimeout })
        controller.abort()
      }
    }, connectionTimeout)

    if (maxDuration !== undefined) {
      maxDurationTimer = setTimeout(() => {
        isMaxDurationExceeded = true
        this.log('Agent stream max duration exceeded', { maxDuration })
        controller.abort()
      }, maxDuration)
    }

    try {
      const url = `${this.baseUrl}/agents/${encodeURIComponent(agentId)}/stream`
      const requestId = this.generateRequestId()

      const headers: Record<string, string> = {
        Accept: 'text/event-stream',
        'X-Request-ID': requestId,
      }
      if (this.authToken) {
        headers.Authorization = `Bearer ${this.authToken}`
      }

      this.log('Agent stream started', { id: requestId, url })

      const response = await fetch(url, {
        method: 'GET',
        headers,
        signal: controller.signal,
      })

      isConnected = true
      if (connectionTimer) clearTimeout(connectionTimer)
      resetIdleTimer()

      if (!response.ok) {
        throw StromboliError.fromResponse(response.status, await response.text())
      }
      if (!response.body) {
        throw new StromboliError('No response body', 'STREAM_ERROR')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let pendingEvent = 'message'
      let pendingData: string[] = []

      const flush = (): AgentStreamEvent | undefined => {
        if (pendingData.length === 0) {
          pendingEvent = 'message'
          return undefined
        }
        const raw = pendingData.join('\n')
        pendingData = []
        const event = pendingEvent
        pendingEvent = 'message'
        let parsed: unknown = raw
        try {
          parsed = JSON.parse(raw)
        } catch {
          // Leave as raw string if not JSON
        }
        return { type: 'message', event, data: parsed }
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          const final = flush()
          if (final) yield final
          this.log('Agent stream completed')
          yield { type: 'done' }
          break
        }

        resetIdleTimer()

        buffer += decoder.decode(value, { stream: true })
        let newlineIndex = buffer.indexOf('\n')
        while (newlineIndex !== -1) {
          const rawLine = buffer.slice(0, newlineIndex)
          buffer = buffer.slice(newlineIndex + 1)
          const line = rawLine.replace(/\r$/, '')

          if (line === '') {
            const ev = flush()
            if (ev) yield ev
          } else if (line.startsWith(':')) {
            // SSE comment — ignore
          } else if (line.startsWith('event:')) {
            pendingEvent = line.slice(6).trim() || 'message'
          } else if (line.startsWith('data:')) {
            pendingData.push(line.slice(5).replace(/^ /, ''))
          } else if (line.startsWith('error:')) {
            yield { type: 'error', error: line.slice(6).trim() }
          }
          newlineIndex = buffer.indexOf('\n')
        }
      }
    } catch (err) {
      if (err instanceof StromboliError) {
        throw err
      }
      if (err instanceof DOMException && err.name === 'AbortError') {
        if (isUserAborted) {
          throw StromboliError.abortedError()
        }
        if (isMaxDurationExceeded) {
          throw new StromboliError(
            `Agent stream exceeded max duration of ${maxDuration}ms`,
            'MAX_DURATION_EXCEEDED'
          )
        }
        throw new StromboliError(
          isConnected
            ? `Agent stream idle timeout after ${idleTimeout}ms`
            : `Agent stream connection timeout after ${connectionTimeout}ms`,
          isConnected ? 'IDLE_TIMEOUT' : 'CONNECTION_TIMEOUT'
        )
      }
      throw StromboliError.networkError(err)
    } finally {
      if (idleTimer) clearTimeout(idleTimer)
      if (connectionTimer) clearTimeout(connectionTimer)
      if (maxDurationTimer) clearTimeout(maxDurationTimer)
    }
  }

  // ==========================================================================
  // Container Images
  // ==========================================================================

  /**
   * List local container images, sorted by Stromboli compatibility rank.
   *
   * Useful for discovering which of your local images can be passed to
   * {@link run} via the `image` option without surprises.
   *
   * @returns List of local images
   * @throws {StromboliError} When the API returns an error
   *
   * @example
   * ```typescript
   * const { images } = await client.listImages()
   * for (const img of images ?? []) {
   *   console.log(`${img.repository}:${img.tag} — rank ${img.compatibility_rank}`)
   * }
   * ```
   *
   * @see {@link inspectImage} - For full image metadata
   * @see {@link pullImage} - To fetch a missing image
   */
  async listImages(): Promise<ImagesListResponse> {
    return this.request(
      (signal) => this.api.GET('/images', { signal }) as Promise<ApiResult<ImagesListResponse>>
    )
  }

  /**
   * Inspect a single image, including its labels and a human-readable
   * compatibility description.
   *
   * @param name - Image name with optional tag (e.g. `python:3.12-slim`)
   * @returns Detailed image metadata
   * @throws {StromboliError} When the image is not found locally
   *
   * @example
   * ```typescript
   * const img = await client.inspectImage('python:3.12-slim')
   * console.log(img.rank_description, img.tools)
   * ```
   *
   * @see {@link listImages} - To enumerate images
   */
  async inspectImage(name: string): Promise<ImageDetail> {
    return this.request(
      (signal) =>
        this.api.GET('/images/{name}', {
          params: { path: { name } },
          signal,
        }) as Promise<ApiResult<ImageDetail>>
    )
  }

  /**
   * Pull a container image from a registry.
   *
   * Blocks until the pull completes. Supports passing a target platform
   * for multi-arch registries.
   *
   * @param request - Image reference + optional platform/quiet flag
   * @returns Pull result (success flag, resolved image_id)
   * @throws {StromboliError} When the pull fails (e.g., auth, network, not found)
   *
   * @example
   * ```typescript
   * const result = await client.pullImage({
   *   image: 'python:3.12-slim',
   *   platform: 'linux/amd64',
   * })
   * if (result.success) {
   *   console.log(`Pulled ${result.image_id}`)
   * }
   * ```
   */
  async pullImage(request: ImagePullRequest): Promise<ImagePullResponse> {
    return this.request(
      (signal) =>
        this.api.POST('/images/pull', {
          body: request,
          signal,
        }) as Promise<ApiResult<ImagePullResponse>>
    )
  }

  /**
   * Search container registries for images matching a query.
   *
   * @param query - Search term (e.g., 'python')
   * @param options - Optional limit and full-description toggle
   * @returns Search results
   * @throws {StromboliError} When the search fails
   *
   * @example
   * ```typescript
   * const { results } = await client.searchImages('python', { limit: 5 })
   * for (const r of results ?? []) {
   *   console.log(r)
   * }
   * ```
   */
  async searchImages(
    query: string,
    options?: { limit?: number; noTrunc?: boolean }
  ): Promise<ImageSearchResponse> {
    return this.request(
      (signal) =>
        this.api.GET('/images/search', {
          params: {
            query: {
              q: query,
              limit: options?.limit,
              no_trunc: options?.noTrunc,
            },
          },
          signal,
        }) as Promise<ApiResult<ImageSearchResponse>>
    )
  }
}
