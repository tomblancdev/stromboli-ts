/**
 * Mock Data Factories
 *
 * Type-safe mock data generators for Stromboli API responses.
 * Uses Faker.js to generate realistic test data.
 *
 * @module tests/mocks/factories
 */

import { faker } from '@faker-js/faker'
import type { components } from '../../src/generated/types'

// ============================================================================
// Type Aliases for Convenience
// ============================================================================

type HealthResponse = components['schemas']['internal_api.HealthResponse']
type ComponentHealth = components['schemas']['internal_api.ComponentHealth']
type RunResponse = components['schemas']['internal_api.RunResponse']
type AsyncRunResponse = components['schemas']['internal_api.AsyncRunResponse']
type JobResponse = components['schemas']['internal_api.JobResponse']
type JobListResponse = components['schemas']['internal_api.JobListResponse']
type JobStatus = components['schemas']['stromboli_internal_job.Status']
type SessionListResponse = components['schemas']['internal_api.SessionListResponse']
type SessionMessagesResponse = components['schemas']['internal_api.SessionMessagesResponse']
type SessionDestroyResponse = components['schemas']['internal_api.SessionDestroyResponse']
type Message = components['schemas']['stromboli_internal_history.Message']
type MessageContent = components['schemas']['stromboli_internal_history.MessageContent']
type ContentBlock = components['schemas']['stromboli_internal_history.ContentBlock']
type ErrorResponse = components['schemas']['internal_api.ErrorResponse']
type SecretsListResponse = components['schemas']['internal_api.SecretsListResponse']
type TokenResponse = components['schemas']['internal_api.TokenResponse']
type ValidateResponse = components['schemas']['internal_api.ValidateResponse']
type ClaudeStatusResponse = components['schemas']['internal_api.ClaudeStatusResponse']
type AgentSnapshot = components['schemas']['stromboli_internal_agent.Snapshot']
type CreateAgentResponse = components['schemas']['internal_api.CreateAgentResponse']
type SendAgentResponse = components['schemas']['internal_api.SendAgentResponse']
type ImageInfoResponse = components['schemas']['internal_api.ImageInfoResponse']
type ImageDetailResponse = components['schemas']['internal_api.ImageDetailResponse']
type ImagesListResponse = components['schemas']['internal_api.ImagesListResponse']
type ImagePullResponse = components['schemas']['internal_api.ImagePullResponse']
type ImageSearchResponse = components['schemas']['internal_api.ImageSearchResponse']
type CreateSecretResponse = components['schemas']['internal_api.CreateSecretResponse']
type SecretInfoResponse = components['schemas']['internal_api.SecretInfoResponse']
type DeleteSecretResponse = components['schemas']['internal_api.DeleteSecretResponse']
type SessionMessageResponse = components['schemas']['internal_api.SessionMessageResponse']

// ============================================================================
// ID Generators
// ============================================================================

/**
 * Generate a unique run ID.
 * @example "run-abc123def456"
 */
export function createRunId(): string {
  return `run-${faker.string.alphanumeric(12)}`
}

/**
 * Generate a unique job ID.
 * @example "job-abc123def456"
 */
export function createJobId(): string {
  return `job-${faker.string.alphanumeric(12)}`
}

/**
 * Generate a unique session ID.
 * @example "sess-abc123def456"
 */
export function createSessionId(): string {
  return `sess-${faker.string.alphanumeric(12)}`
}

/**
 * Generate a UUID.
 * @example "550e8400-e29b-41d4-a716-446655440000"
 */
export function createUuid(): string {
  return faker.string.uuid()
}

/**
 * Generate a unique agent ID.
 * @example "agent-abc123def456"
 */
export function createAgentId(): string {
  return `agent-${faker.string.alphanumeric(12)}`
}

/**
 * Generate a unique turn ID.
 * @example "turn-abc123"
 */
export function createTurnId(): string {
  return `turn-${faker.string.alphanumeric(8)}`
}

// ============================================================================
// Component Factories
// ============================================================================

/**
 * Create a mock ComponentHealth.
 */
export function createComponentHealth(overrides: Partial<ComponentHealth> = {}): ComponentHealth {
  return {
    name: faker.helpers.arrayElement(['podman', 'claude', 'redis']),
    status: 'ok',
    error: undefined,
    ...overrides,
  }
}

/**
 * Create a mock HealthResponse.
 */
export function createHealthResponse(overrides: Partial<HealthResponse> = {}): HealthResponse {
  return {
    name: 'stromboli',
    status: 'ok',
    version: faker.system.semver(),
    components: [
      createComponentHealth({ name: 'podman' }),
      createComponentHealth({ name: 'claude' }),
    ],
    ...overrides,
  }
}

// ============================================================================
// Run Response Factories
// ============================================================================

/**
 * Create a mock successful RunResponse.
 */
export function createRunResponse(overrides: Partial<RunResponse> = {}): RunResponse {
  return {
    id: createRunId(),
    status: 'completed',
    output: faker.lorem.paragraph(),
    session_id: createSessionId(),
    error: undefined,
    ...overrides,
  }
}

/**
 * Create a mock failed RunResponse.
 */
export function createFailedRunResponse(overrides: Partial<RunResponse> = {}): RunResponse {
  return {
    id: createRunId(),
    status: 'error',
    output: undefined,
    session_id: createSessionId(),
    error: faker.lorem.sentence(),
    ...overrides,
  }
}

/**
 * Create a mock AsyncRunResponse.
 */
export function createAsyncRunResponse(
  overrides: Partial<AsyncRunResponse> = {}
): AsyncRunResponse {
  return {
    job_id: createJobId(),
    ...overrides,
  }
}

// ============================================================================
// Job Factories
// ============================================================================

/**
 * Create a mock JobResponse.
 */
export function createJobResponse(overrides: Partial<JobResponse> = {}): JobResponse {
  const status: JobStatus = overrides.status ?? 'completed'
  const now = new Date()
  const createdAt = faker.date.recent({ days: 1 })

  return {
    id: createJobId(),
    status,
    output: status === 'completed' ? faker.lorem.paragraph() : undefined,
    error: status === 'failed' ? faker.lorem.sentence() : undefined,
    session_id: createSessionId(),
    created_at: createdAt.toISOString(),
    updated_at: now.toISOString(),
    crash_info:
      status === 'crashed'
        ? {
            reason: 'Out of memory',
            exit_code: 137,
            signal: 'SIGKILL',
            partial_output: faker.lorem.sentence(),
            task_completed: false,
          }
        : undefined,
    ...overrides,
  }
}

/**
 * Create a mock JobListResponse.
 */
export function createJobListResponse(
  count = 3,
  overrides: Partial<JobListResponse> = {}
): JobListResponse {
  return {
    jobs: Array.from({ length: count }, () => createJobResponse()),
    ...overrides,
  }
}

// ============================================================================
// Session Factories
// ============================================================================

/**
 * Create a mock SessionListResponse.
 */
export function createSessionListResponse(
  count = 3,
  overrides: Partial<SessionListResponse> = {}
): SessionListResponse {
  return {
    sessions: Array.from({ length: count }, createSessionId),
    error: undefined,
    ...overrides,
  }
}

/**
 * Create a mock ContentBlock.
 */
export function createContentBlock(
  type: 'text' | 'tool_use' | 'tool_result' = 'text',
  overrides: Partial<ContentBlock> = {}
): ContentBlock {
  const base: ContentBlock = { type }

  switch (type) {
    case 'text':
      return {
        ...base,
        text: faker.lorem.paragraph(),
        ...overrides,
      }
    case 'tool_use':
      return {
        ...base,
        id: `toolu_${faker.string.alphanumeric(24)}`,
        name: faker.helpers.arrayElement(['Bash', 'Read', 'Write', 'Edit']),
        input: { command: faker.system.directoryPath() },
        ...overrides,
      }
    case 'tool_result':
      return {
        ...base,
        tool_use_id: `toolu_${faker.string.alphanumeric(24)}`,
        content: faker.lorem.sentence(),
        is_error: false,
        ...overrides,
      }
    default:
      return { ...base, ...overrides }
  }
}

/**
 * Create a mock MessageContent.
 */
export function createMessageContent(
  role: 'user' | 'assistant' = 'assistant',
  overrides: Partial<MessageContent> = {}
): MessageContent {
  return {
    role,
    content: [createContentBlock('text')],
    model: role === 'assistant' ? 'claude-sonnet-4-20250514' : undefined,
    message_id: role === 'assistant' ? `msg_${faker.string.alphanumeric(24)}` : undefined,
    stop_reason: role === 'assistant' ? 'end_turn' : undefined,
    usage:
      role === 'assistant'
        ? {
            input_tokens: faker.number.int({ min: 100, max: 1000 }),
            output_tokens: faker.number.int({ min: 50, max: 500 }),
            cache_creation_input_tokens: faker.number.int({ min: 0, max: 500 }),
            cache_read_input_tokens: faker.number.int({ min: 0, max: 5000 }),
          }
        : undefined,
    ...overrides,
  }
}

/**
 * Create a mock Message.
 */
export function createMessage(
  type: 'user' | 'assistant' = 'assistant',
  overrides: Partial<Message> = {}
): Message {
  return {
    uuid: createUuid(),
    type,
    session_id: createSessionId(),
    timestamp: faker.date.recent().toISOString(),
    content: createMessageContent(type),
    cwd: '/workspace',
    git_branch: 'main',
    version: '2.1.19',
    permission_mode: 'bypassPermissions',
    ...overrides,
  }
}

/**
 * Create a mock SessionMessagesResponse.
 */
export function createSessionMessagesResponse(
  count = 5,
  overrides: Partial<SessionMessagesResponse> = {}
): SessionMessagesResponse {
  const messages: Message[] = []
  for (let i = 0; i < count; i++) {
    messages.push(createMessage(i % 2 === 0 ? 'user' : 'assistant'))
  }

  return {
    messages,
    total: count,
    limit: 50,
    offset: 0,
    has_more: false,
    ...overrides,
  }
}

/**
 * Create a mock SessionDestroyResponse.
 */
export function createSessionDestroyResponse(
  overrides: Partial<SessionDestroyResponse> = {}
): SessionDestroyResponse {
  return {
    success: true,
    session_id: createSessionId(),
    error: undefined,
    ...overrides,
  }
}

// ============================================================================
// Error Factories
// ============================================================================

/**
 * Create a mock ErrorResponse.
 */
export function createErrorResponse(
  message = 'An error occurred',
  overrides: Partial<ErrorResponse> = {}
): ErrorResponse {
  return {
    error: message,
    ...overrides,
  }
}

// ============================================================================
// Secrets Factories
// ============================================================================

/**
 * Create a mock SecretsListResponse.
 */
export function createSecretsListResponse(
  count = 3,
  overrides: Partial<SecretsListResponse> = {}
): SecretsListResponse {
  const secretNames = ['github-token', 'gitlab-token', 'npm-token', 'docker-token']
  return {
    secrets: secretNames.slice(0, count),
    error: undefined,
    ...overrides,
  }
}

// ============================================================================
// Auth Factories
// ============================================================================

/**
 * Create a mock TokenResponse.
 */
export function createTokenResponse(overrides: Partial<TokenResponse> = {}): TokenResponse {
  return {
    access_token: `access-${faker.string.alphanumeric(32)}`,
    refresh_token: `refresh-${faker.string.alphanumeric(32)}`,
    token_type: 'Bearer',
    expires_in: 3600,
    ...overrides,
  }
}

/**
 * Create a mock ValidateResponse.
 */
export function createValidateResponse(
  overrides: Partial<ValidateResponse> = {}
): ValidateResponse {
  return {
    valid: true,
    subject: `client-${faker.string.alphanumeric(8)}`,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    ...overrides,
  }
}

/**
 * Create a mock ClaudeStatusResponse.
 */
export function createClaudeStatusResponse(
  overrides: Partial<ClaudeStatusResponse> = {}
): ClaudeStatusResponse {
  return {
    configured: true,
    message: 'Claude is configured',
    ...overrides,
  }
}

// ============================================================================
// Scenario Factories
// ============================================================================

/**
 * Create a complete conversation scenario with alternating user/assistant messages.
 */
export function createConversation(turns = 3): Message[] {
  const sessionId = createSessionId()
  const messages: Message[] = []
  let parentUuid: string | undefined

  for (let i = 0; i < turns * 2; i++) {
    const isUser = i % 2 === 0
    const uuid = createUuid()

    messages.push(
      createMessage(isUser ? 'user' : 'assistant', {
        uuid,
        session_id: sessionId,
        parent_uuid: parentUuid,
      })
    )

    parentUuid = uuid
  }

  return messages
}

/**
 * Create a list of jobs with various statuses.
 */
export function createMixedStatusJobs(): JobResponse[] {
  return [
    createJobResponse({ status: 'completed' }),
    createJobResponse({ status: 'running' }),
    createJobResponse({ status: 'pending' }),
    createJobResponse({ status: 'failed' }),
  ]
}

// ============================================================================
// Persistent Agent Factories
// ============================================================================

/**
 * Create a mock AgentSnapshot.
 */
export function createAgentSnapshot(overrides: Partial<AgentSnapshot> = {}): AgentSnapshot {
  const created = faker.date.recent({ days: 1 })
  return {
    id: createAgentId(),
    session_id: createSessionId(),
    status: 'running',
    turns_completed: faker.number.int({ min: 0, max: 12 }),
    idle_timeout_seconds: 1800,
    idle_timeout_disabled: false,
    created_at: created.toISOString(),
    last_activity_at: new Date().toISOString(),
    ...overrides,
  }
}

/**
 * Create a mock CreateAgentResponse (same shape as snapshot).
 */
export function createCreateAgentResponse(
  overrides: Partial<CreateAgentResponse> = {}
): CreateAgentResponse {
  return createAgentSnapshot(overrides) as CreateAgentResponse
}

/**
 * Create a mock SendAgentResponse.
 */
export function createSendAgentResponse(
  overrides: Partial<SendAgentResponse> = {}
): SendAgentResponse {
  return {
    turn_id: createTurnId(),
    ...overrides,
  }
}

// ============================================================================
// Container Image Factories
// ============================================================================

/**
 * Create a mock ImageInfoResponse.
 */
export function createImageInfo(overrides: Partial<ImageInfoResponse> = {}): ImageInfoResponse {
  return {
    id: `sha256:${faker.string.alphanumeric(64)}`,
    repository: 'python',
    tag: '3.12-slim',
    size: faker.number.int({ min: 50_000_000, max: 500_000_000 }),
    created: faker.date.recent({ days: 30 }).toISOString(),
    compatible: true,
    compatibility_rank: 3,
    has_claude_cli: false,
    tools: ['python', 'pip'],
    description: 'Python development image',
    ...overrides,
  }
}

/**
 * Create a mock ImageDetailResponse.
 */
export function createImageDetail(
  overrides: Partial<ImageDetailResponse> = {}
): ImageDetailResponse {
  return {
    ...createImageInfo(),
    rank_description: 'Standard glibc-based (compatible)',
    labels: { maintainer: 'docker' },
    ...overrides,
  }
}

/**
 * Create a mock ImagesListResponse.
 */
export function createImagesListResponse(
  count = 3,
  overrides: Partial<ImagesListResponse> = {}
): ImagesListResponse {
  return {
    images: Array.from({ length: count }, () => createImageInfo()),
    ...overrides,
  }
}

/**
 * Create a mock ImagePullResponse.
 */
export function createImagePullResponse(
  overrides: Partial<ImagePullResponse> = {}
): ImagePullResponse {
  return {
    success: true,
    image: 'python:3.12-slim',
    image_id: `sha256:${faker.string.alphanumeric(64)}`,
    ...overrides,
  }
}

/**
 * Create a mock ImageSearchResponse.
 */
export function createImageSearchResponse(
  overrides: Partial<ImageSearchResponse> = {}
): ImageSearchResponse {
  return {
    results: [],
    ...overrides,
  }
}

// ============================================================================
// Secret CRUD Factories
// ============================================================================

/**
 * Create a mock CreateSecretResponse.
 */
export function createCreateSecretResponse(
  overrides: Partial<CreateSecretResponse> = {}
): CreateSecretResponse {
  return {
    success: true,
    name: 'github-token',
    error: undefined,
    ...overrides,
  }
}

/**
 * Create a mock SecretInfoResponse.
 */
export function createSecretInfo(overrides: Partial<SecretInfoResponse> = {}): SecretInfoResponse {
  return {
    id: faker.string.alphanumeric(12),
    name: 'github-token',
    created_at: faker.date.recent({ days: 30 }).toISOString(),
    ...overrides,
  }
}

/**
 * Create a mock DeleteSecretResponse.
 */
export function createDeleteSecretResponse(
  overrides: Partial<DeleteSecretResponse> = {}
): DeleteSecretResponse {
  return {
    success: true,
    name: 'github-token',
    error: undefined,
    ...overrides,
  }
}

// ============================================================================
// Single Session Message Factory
// ============================================================================

/**
 * Create a mock SessionMessageResponse (a single Message).
 */
export function createSessionMessageResponse(
  overrides: Partial<SessionMessageResponse> = {}
): SessionMessageResponse {
  return createMessage('assistant', overrides as Partial<Message>) as SessionMessageResponse
}
