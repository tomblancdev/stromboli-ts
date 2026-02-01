/**
 * MSW Request Handlers
 *
 * Intercepts HTTP requests to the Stromboli API and returns mock responses.
 * Uses factories to generate realistic test data.
 *
 * @module tests/mocks/handlers
 */

import { http, HttpResponse } from 'msw'
import {
  createAsyncRunResponse,
  createClaudeStatusResponse,
  createErrorResponse,
  createHealthResponse,
  createJobId,
  createJobListResponse,
  createJobResponse,
  createRunResponse,
  createSecretsListResponse,
  createSessionDestroyResponse,
  createSessionListResponse,
  createSessionMessagesResponse,
  createTokenResponse,
  createValidateResponse,
} from './factories'

/**
 * Default base URL for the mock API.
 */
export const MOCK_BASE_URL = 'http://localhost:8585'

/**
 * Storage for jobs created during tests.
 * Allows tests to track job state.
 */
export const jobStore = new Map<string, ReturnType<typeof createJobResponse>>()

/**
 * Reset the job store between tests.
 */
export function resetJobStore(): void {
  jobStore.clear()
}

/**
 * Create MSW handlers for all Stromboli API endpoints.
 *
 * @param baseUrl - The base URL for the API (default: http://localhost:8585)
 * @returns Array of MSW request handlers
 */
export function createHandlers(baseUrl = MOCK_BASE_URL) {
  return [
    // ========================================================================
    // Health Endpoints
    // ========================================================================

    /**
     * GET /health - Health check
     */
    http.get(`${baseUrl}/health`, () => {
      return HttpResponse.json(createHealthResponse())
    }),

    /**
     * GET /claude/status - Claude configuration status
     */
    http.get(`${baseUrl}/claude/status`, () => {
      return HttpResponse.json(createClaudeStatusResponse())
    }),

    /**
     * GET /secrets - List available secrets
     */
    http.get(`${baseUrl}/secrets`, () => {
      return HttpResponse.json(createSecretsListResponse())
    }),

    // ========================================================================
    // Auth Endpoints
    // ========================================================================

    /**
     * POST /auth/token - Generate JWT tokens
     */
    http.post(`${baseUrl}/auth/token`, async ({ request }) => {
      const body = (await request.json()) as { client_id?: string }

      if (!body?.client_id) {
        return HttpResponse.json(createErrorResponse('client_id is required'), { status: 400 })
      }

      return HttpResponse.json(createTokenResponse())
    }),

    /**
     * POST /auth/refresh - Refresh access token
     */
    http.post(`${baseUrl}/auth/refresh`, async ({ request }) => {
      const body = (await request.json()) as { refresh_token?: string }

      if (!body?.refresh_token) {
        return HttpResponse.json(createErrorResponse('refresh_token is required'), { status: 400 })
      }

      return HttpResponse.json(createTokenResponse())
    }),

    /**
     * GET /auth/validate - Validate JWT token
     */
    http.get(`${baseUrl}/auth/validate`, ({ request }) => {
      const authHeader = request.headers.get('Authorization')

      if (!authHeader?.startsWith('Bearer ')) {
        return HttpResponse.json(createErrorResponse('Unauthorized'), { status: 401 })
      }

      return HttpResponse.json(createValidateResponse())
    }),

    /**
     * POST /auth/logout - Invalidate token
     */
    http.post(`${baseUrl}/auth/logout`, () => {
      return HttpResponse.json({ success: true, message: 'Logged out' })
    }),

    // ========================================================================
    // Run Endpoints
    // ========================================================================

    /**
     * POST /run - Synchronous Claude execution
     */
    http.post(`${baseUrl}/run`, async ({ request }) => {
      const body = (await request.json()) as { prompt?: string }

      if (!body?.prompt) {
        return HttpResponse.json(createErrorResponse('prompt is required'), { status: 400 })
      }

      return HttpResponse.json(createRunResponse())
    }),

    /**
     * GET /run/stream - Streaming Claude execution
     */
    http.get(`${baseUrl}/run/stream`, ({ request }) => {
      const url = new URL(request.url)
      const prompt = url.searchParams.get('prompt')

      if (!prompt) {
        return new HttpResponse('error: prompt is required\n', {
          status: 400,
          headers: { 'Content-Type': 'text/event-stream' },
        })
      }

      // Return a mock SSE stream
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        start(controller) {
          const messages = [
            'data: Hello! ',
            'data: This is ',
            'data: a streamed ',
            'data: response.',
            'data: [DONE]',
          ]

          let i = 0
          const interval = setInterval(() => {
            if (i < messages.length) {
              controller.enqueue(encoder.encode(`${messages[i]}\n`))
              i++
            } else {
              clearInterval(interval)
              controller.close()
            }
          }, 10)
        },
      })

      return new HttpResponse(stream, {
        headers: { 'Content-Type': 'text/event-stream' },
      })
    }),

    /**
     * POST /run/async - Asynchronous Claude execution
     */
    http.post(`${baseUrl}/run/async`, async ({ request }) => {
      const body = (await request.json()) as { prompt?: string }

      if (!body?.prompt) {
        return HttpResponse.json(createErrorResponse('prompt is required'), { status: 400 })
      }

      const jobId = createJobId()
      const response = createAsyncRunResponse({ job_id: jobId })

      // Store the job for later retrieval
      jobStore.set(
        jobId,
        createJobResponse({
          id: jobId,
          status: 'pending',
        })
      )

      return HttpResponse.json(response, { status: 202 })
    }),

    // ========================================================================
    // Job Endpoints
    // ========================================================================

    /**
     * GET /jobs - List all jobs
     */
    http.get(`${baseUrl}/jobs`, () => {
      // Return stored jobs if any, otherwise generate new ones
      if (jobStore.size > 0) {
        return HttpResponse.json({
          jobs: Array.from(jobStore.values()),
        })
      }
      return HttpResponse.json(createJobListResponse())
    }),

    /**
     * GET /jobs/:id - Get job status
     */
    http.get(`${baseUrl}/jobs/:id`, ({ params }) => {
      const { id } = params as { id: string }

      // Check if job exists in store
      const storedJob = jobStore.get(id)
      if (storedJob) {
        return HttpResponse.json(storedJob)
      }

      // Return 404 for unknown jobs
      return HttpResponse.json(createErrorResponse(`Job ${id} not found`), { status: 404 })
    }),

    /**
     * DELETE /jobs/:id - Cancel a job
     */
    http.delete(`${baseUrl}/jobs/:id`, ({ params }) => {
      const { id } = params as { id: string }

      const storedJob = jobStore.get(id)
      if (storedJob) {
        storedJob.status = 'cancelled'
        return HttpResponse.json(storedJob)
      }

      return HttpResponse.json(createErrorResponse(`Job ${id} not found`), { status: 404 })
    }),

    // ========================================================================
    // Session Endpoints
    // ========================================================================

    /**
     * GET /sessions - List all sessions
     */
    http.get(`${baseUrl}/sessions`, () => {
      return HttpResponse.json(createSessionListResponse())
    }),

    /**
     * DELETE /sessions/:id - Destroy a session
     */
    http.delete(`${baseUrl}/sessions/:id`, ({ params }) => {
      const { id } = params as { id: string }
      return HttpResponse.json(
        createSessionDestroyResponse({
          session_id: id,
        })
      )
    }),

    /**
     * GET /sessions/:id/messages - Get session messages
     */
    http.get(`${baseUrl}/sessions/:id/messages`, ({ request, params }) => {
      const url = new URL(request.url)
      const limit = Number.parseInt(url.searchParams.get('limit') ?? '50', 10)
      const offset = Number.parseInt(url.searchParams.get('offset') ?? '0', 10)

      const { id } = params as { id: string }

      return HttpResponse.json(
        createSessionMessagesResponse(5, {
          limit,
          offset,
        })
      )
    }),
  ]
}

/**
 * Default handlers for standard test scenarios.
 */
export const handlers = createHandlers()
