/**
 * Stromboli TypeScript SDK Client
 *
 * High-level wrapper around the generated API client
 */

import { createStromboliClient, type StromboliApiClient } from './generated/api'
import { StromboliError } from './errors'

export interface StromboliClientOptions {
  /** Base URL of the Stromboli API (e.g., 'http://localhost:8585') */
  baseUrl: string
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number
}

export interface RunRequest {
  prompt: string
  model?: 'sonnet' | 'opus' | 'haiku'
  workspace?: string
  sessionId?: string
  resume?: boolean
  timeout?: string
  memory?: string
  maxBudgetUsd?: number
  systemPrompt?: string
  appendSystemPrompt?: string
  allowedTools?: string[]
  disallowedTools?: string[]
}

export interface RunResponse {
  result: string
  sessionId: string
}

export interface AsyncRunResponse {
  id: string
}

export interface Job {
  id: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  result?: string
  error?: string
  sessionId?: string
}

export interface HealthResponse {
  status: string
  version: string
  podman: boolean
  claude: boolean
}

export interface Session {
  id: string
}

/**
 * Main Stromboli client class
 */
export class StromboliClient {
  private readonly api: StromboliApiClient
  private readonly timeout: number

  constructor(options: StromboliClientOptions | string) {
    const opts = typeof options === 'string' ? { baseUrl: options } : options
    this.api = createStromboliClient(opts.baseUrl)
    this.timeout = opts.timeout ?? 30000
  }

  /**
   * Run a synchronous Claude session
   */
  async run(request: RunRequest): Promise<RunResponse> {
    const { data, error, response } = await this.api.POST('/run', {
      body: {
        prompt: request.prompt,
        model: request.model,
        workspace: request.workspace,
        session_id: request.sessionId,
        resume: request.resume,
        timeout: request.timeout,
        memory: request.memory,
        max_budget_usd: request.maxBudgetUsd,
        system_prompt: request.systemPrompt,
        append_system_prompt: request.appendSystemPrompt,
        allowed_tools: request.allowedTools,
        disallowed_tools: request.disallowedTools,
      },
    })

    if (error || !data) {
      throw StromboliError.fromResponse(response.status, error)
    }

    return {
      result: data.result ?? '',
      sessionId: data.session_id ?? '',
    }
  }

  /**
   * Start an asynchronous Claude session
   */
  async runAsync(request: RunRequest): Promise<AsyncRunResponse> {
    const { data, error, response } = await this.api.POST('/run/async', {
      body: {
        prompt: request.prompt,
        model: request.model,
        workspace: request.workspace,
        session_id: request.sessionId,
        resume: request.resume,
        timeout: request.timeout,
        memory: request.memory,
        max_budget_usd: request.maxBudgetUsd,
        system_prompt: request.systemPrompt,
        append_system_prompt: request.appendSystemPrompt,
        allowed_tools: request.allowedTools,
        disallowed_tools: request.disallowedTools,
      },
    })

    if (error || !data) {
      throw StromboliError.fromResponse(response.status, error)
    }

    return {
      id: data.id ?? '',
    }
  }

  /**
   * Get job status and result
   */
  async getJob(jobId: string): Promise<Job> {
    const { data, error, response } = await this.api.GET('/jobs/{id}', {
      params: { path: { id: jobId } },
    })

    if (error || !data) {
      throw StromboliError.fromResponse(response.status, error)
    }

    return {
      id: data.id ?? '',
      status: (data.status as Job['status']) ?? 'pending',
      result: data.result,
      error: data.error,
      sessionId: data.session_id,
    }
  }

  /**
   * List all jobs
   */
  async listJobs(): Promise<Job[]> {
    const { data, error, response } = await this.api.GET('/jobs')

    if (error || !data) {
      throw StromboliError.fromResponse(response.status, error)
    }

    return (data.jobs ?? []).map((job) => ({
      id: job.id ?? '',
      status: (job.status as Job['status']) ?? 'pending',
      result: job.result,
      error: job.error,
      sessionId: job.session_id,
    }))
  }

  /**
   * Cancel a running job
   */
  async cancelJob(jobId: string): Promise<void> {
    const { error, response } = await this.api.DELETE('/jobs/{id}', {
      params: { path: { id: jobId } },
    })

    if (error) {
      throw StromboliError.fromResponse(response.status, error)
    }
  }

  /**
   * Check API health status
   */
  async health(): Promise<HealthResponse> {
    const { data, error, response } = await this.api.GET('/health')

    if (error || !data) {
      throw StromboliError.fromResponse(response.status, error)
    }

    return {
      status: data.status ?? 'unknown',
      version: data.version ?? 'unknown',
      podman: data.podman ?? false,
      claude: data.claude ?? false,
    }
  }

  /**
   * List all sessions
   */
  async listSessions(): Promise<Session[]> {
    const { data, error, response } = await this.api.GET('/sessions')

    if (error || !data) {
      throw StromboliError.fromResponse(response.status, error)
    }

    return (data.sessions ?? []).map((s) => ({
      id: typeof s === 'string' ? s : (s.id ?? ''),
    }))
  }

  /**
   * Delete a session
   */
  async deleteSession(sessionId: string): Promise<void> {
    const { error, response } = await this.api.DELETE('/sessions/{id}', {
      params: { path: { id: sessionId } },
    })

    if (error) {
      throw StromboliError.fromResponse(response.status, error)
    }
  }

  /**
   * Get session messages
   */
  async getSessionMessages(
    sessionId: string,
    options?: { offset?: number; limit?: number }
  ): Promise<unknown[]> {
    const { data, error, response } = await this.api.GET('/sessions/{id}/messages', {
      params: {
        path: { id: sessionId },
        query: { offset: options?.offset, limit: options?.limit },
      },
    })

    if (error || !data) {
      throw StromboliError.fromResponse(response.status, error)
    }

    return data.messages ?? []
  }
}
