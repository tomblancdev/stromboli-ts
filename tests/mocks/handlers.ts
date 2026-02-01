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
  createErrorResponse,
  createHealthResponse,
  createJobId,
  createJobListResponse,
  createJobResponse,
  createRunResponse,
  createSessionDestroyResponse,
  createSessionListResponse,
  createSessionMessagesResponse,
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
      return HttpResponse.json({
        configured: true,
      })
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
