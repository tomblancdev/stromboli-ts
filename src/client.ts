/**
 * Stromboli TypeScript SDK Client
 *
 * High-level wrapper around the generated API client
 */

import { StromboliError } from './errors'
import { type StromboliApiClient, createStromboliClient } from './generated/api'
import type { components } from './generated/types'

// Re-export key API types
export type RunRequest = components['schemas']['internal_api.RunRequest']
export type RunResponse = components['schemas']['internal_api.RunResponse']
export type AsyncRunResponse = components['schemas']['internal_api.AsyncRunResponse']
export type JobResponse = components['schemas']['internal_api.JobResponse']
export type JobListResponse = components['schemas']['internal_api.JobListResponse']
export type HealthResponse = components['schemas']['internal_api.HealthResponse']
export type SessionListResponse = components['schemas']['internal_api.SessionListResponse']
export type SessionMessagesResponse = components['schemas']['internal_api.SessionMessagesResponse']
export type SessionDestroyResponse = components['schemas']['internal_api.SessionDestroyResponse']
export type ClaudeOptions = components['schemas']['stromboli_internal_types.ClaudeOptions']
export type PodmanOptions = components['schemas']['stromboli_internal_types.PodmanOptions']
export type JobStatus = components['schemas']['stromboli_internal_job.Status']

/**
 * API result type for handling responses
 */
interface ApiResult<T> {
  data?: T
  error?: unknown
  response: { status: number }
}

export interface StromboliClientOptions {
  /** Base URL of the Stromboli API (e.g., 'http://localhost:8585') */
  baseUrl: string
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number
}

/**
 * Simplified run request for common use cases
 */
export interface SimpleRunRequest {
  prompt: string
  model?: 'sonnet' | 'opus' | 'haiku'
  workdir?: string
  sessionId?: string
  resume?: boolean
  timeout?: string
  memory?: string
  maxBudgetUsd?: number
  systemPrompt?: string
  appendSystemPrompt?: string
  allowedTools?: string[]
  disallowedTools?: string[]
  webhookUrl?: string
}

/**
 * Convert simple request to full API request
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
      max_budget_usd: request.maxBudgetUsd,
      system_prompt: request.systemPrompt,
      append_system_prompt: request.appendSystemPrompt,
      allowed_tools: request.allowedTools,
      disallowed_tools: request.disallowedTools,
    },
    podman: {
      timeout: request.timeout,
      memory: request.memory,
    },
  }
}

/**
 * Main Stromboli client class
 */
export class StromboliClient {
  private readonly api: StromboliApiClient
  /** Request timeout in milliseconds */
  readonly timeout: number

  constructor(options: StromboliClientOptions | string) {
    const opts = typeof options === 'string' ? { baseUrl: options } : options
    this.api = createStromboliClient(opts.baseUrl)
    this.timeout = opts.timeout ?? 30000
  }

  /**
   * Run a synchronous Claude session
   */
  async run(request: SimpleRunRequest | RunRequest): Promise<RunResponse> {
    const apiRequest = 'claude' in request ? request : toApiRequest(request)

    const { data, error, response } = (await this.api.POST('/run', {
      body: apiRequest,
    })) as ApiResult<RunResponse>

    if (error || !data) {
      throw StromboliError.fromResponse(response.status, error)
    }

    return data
  }

  /**
   * Start an asynchronous Claude session
   */
  async runAsync(request: SimpleRunRequest | RunRequest): Promise<AsyncRunResponse> {
    const apiRequest = 'claude' in request ? request : toApiRequest(request)

    const { data, error, response } = (await this.api.POST('/run/async', {
      body: apiRequest,
    })) as ApiResult<AsyncRunResponse>

    if (error || !data) {
      throw StromboliError.fromResponse(response.status, error)
    }

    return data
  }

  /**
   * Get job status and result
   */
  async getJob(jobId: string): Promise<JobResponse> {
    const { data, error, response } = (await this.api.GET('/jobs/{id}', {
      params: { path: { id: jobId } },
    })) as ApiResult<JobResponse>

    if (error || !data) {
      throw StromboliError.fromResponse(response.status, error)
    }

    return data
  }

  /**
   * List all jobs
   */
  async listJobs(): Promise<JobListResponse> {
    const { data, error, response } = (await this.api.GET('/jobs')) as ApiResult<JobListResponse>

    if (error || !data) {
      throw StromboliError.fromResponse(response.status, error)
    }

    return data
  }

  /**
   * Cancel a running job
   */
  async cancelJob(jobId: string): Promise<void> {
    const { error, response } = (await this.api.DELETE('/jobs/{id}', {
      params: { path: { id: jobId } },
    })) as ApiResult<unknown>

    if (error) {
      throw StromboliError.fromResponse(response.status, error)
    }
  }

  /**
   * Check API health status
   */
  async health(): Promise<HealthResponse> {
    const { data, error, response } = (await this.api.GET('/health')) as ApiResult<HealthResponse>

    if (error || !data) {
      throw StromboliError.fromResponse(response.status, error)
    }

    return data
  }

  /**
   * List all sessions
   */
  async listSessions(): Promise<SessionListResponse> {
    const { data, error, response } = (await this.api.GET(
      '/sessions'
    )) as ApiResult<SessionListResponse>

    if (error || !data) {
      throw StromboliError.fromResponse(response.status, error)
    }

    return data
  }

  /**
   * Delete a session
   */
  async deleteSession(sessionId: string): Promise<SessionDestroyResponse> {
    const { data, error, response } = (await this.api.DELETE('/sessions/{id}', {
      params: { path: { id: sessionId } },
    })) as ApiResult<SessionDestroyResponse>

    if (error || !data) {
      throw StromboliError.fromResponse(response.status, error)
    }

    return data
  }

  /**
   * Get session messages
   */
  async getSessionMessages(
    sessionId: string,
    options?: { offset?: number; limit?: number }
  ): Promise<SessionMessagesResponse> {
    const { data, error, response } = (await this.api.GET('/sessions/{id}/messages', {
      params: {
        path: { id: sessionId },
        query: options,
      },
    })) as ApiResult<SessionMessagesResponse>

    if (error || !data) {
      throw StromboliError.fromResponse(response.status, error)
    }

    return data
  }

  /**
   * Check Claude configuration status
   */
  async claudeStatus(): Promise<components['schemas']['internal_api.ClaudeStatusResponse']> {
    const { data, error, response } = (await this.api.GET('/claude/status')) as ApiResult<
      components['schemas']['internal_api.ClaudeStatusResponse']
    >

    if (error || !data) {
      throw StromboliError.fromResponse(response.status, error)
    }

    return data
  }
}
