/**
 * StromboliClient Unit Tests
 *
 * Tests all client methods using MSW to mock API responses.
 */

import { afterAll, afterEach, beforeAll, describe, expect, it } from 'bun:test'
import { http, HttpResponse } from 'msw'
import { type SimpleRunRequest, StromboliClient } from '../../src/client'
import { StromboliError } from '../../src/errors'
import {
  MOCK_BASE_URL,
  createErrorResponse,
  createHealthResponse,
  createJobListResponse,
  createJobResponse,
  createRunResponse,
  createSessionDestroyResponse,
  createSessionListResponse,
  createSessionMessagesResponse,
  jobStore,
  resetServer,
  server,
  startServer,
  stopServer,
} from '../mocks/server'

// ============================================================================
// Test Setup
// ============================================================================

beforeAll(() => startServer())
afterEach(() => resetServer())
afterAll(() => stopServer())

// Helper to create client
function createClient(): StromboliClient {
  return new StromboliClient(MOCK_BASE_URL)
}

// ============================================================================
// Constructor Tests
// ============================================================================

describe('StromboliClient', () => {
  describe('constructor', () => {
    it('should accept a URL string', () => {
      const client = new StromboliClient('http://localhost:8585')
      expect(client.timeout).toBe(30000) // Default timeout
    })

    it('should accept options object', () => {
      const client = new StromboliClient({
        baseUrl: 'http://localhost:8585',
        timeout: 60000,
      })
      expect(client.timeout).toBe(60000)
    })

    it('should use default timeout when not specified', () => {
      const client = new StromboliClient({ baseUrl: 'http://localhost:8585' })
      expect(client.timeout).toBe(30000)
    })
  })

  // ==========================================================================
  // Health Check Tests
  // ==========================================================================

  describe('health', () => {
    it('should return health status', async () => {
      const client = createClient()
      const health = await client.health()

      expect(health.name).toBe('stromboli')
      expect(health.status).toBe('ok')
      expect(health.version).toBeDefined()
      expect(health.components).toBeDefined()
      expect(health.components?.length).toBeGreaterThan(0)
    })

    it('should throw StromboliError on API error', async () => {
      server.use(
        http.get(`${MOCK_BASE_URL}/health`, () => {
          return HttpResponse.json(createErrorResponse('Service unavailable'), { status: 503 })
        })
      )

      const client = createClient()

      await expect(client.health()).rejects.toThrow(StromboliError)
      await expect(client.health()).rejects.toMatchObject({
        code: 'HTTP_ERROR',
        status: 503,
      })
    })
  })

  // ==========================================================================
  // Claude Status Tests
  // ==========================================================================

  describe('claudeStatus', () => {
    it('should return claude configuration status', async () => {
      const client = createClient()
      const status = await client.claudeStatus()

      expect(status.configured).toBe(true)
    })
  })

  // ==========================================================================
  // Run Tests
  // ==========================================================================

  describe('run', () => {
    it('should execute a simple run request', async () => {
      const client = createClient()
      const request: SimpleRunRequest = {
        prompt: 'Hello!',
        model: 'haiku',
      }

      const result = await client.run(request)

      expect(result.status).toBe('completed')
      expect(result.output).toBeDefined()
      expect(result.session_id).toBeDefined()
      expect(result.id).toBeDefined()
    })

    it('should execute a full API request', async () => {
      const client = createClient()
      const result = await client.run({
        prompt: 'Hello!',
        claude: {
          model: 'sonnet',
          max_budget_usd: 1.0,
        },
        podman: {
          timeout: '5m',
          memory: '512m',
        },
      })

      expect(result.status).toBe('completed')
      expect(result.output).toBeDefined()
    })

    it('should throw StromboliError when prompt is missing', async () => {
      server.use(
        http.post(`${MOCK_BASE_URL}/run`, () => {
          return HttpResponse.json(createErrorResponse('prompt is required'), { status: 400 })
        })
      )

      const client = createClient()

      await expect(client.run({ prompt: '' })).rejects.toThrow(StromboliError)
      await expect(client.run({ prompt: '' })).rejects.toMatchObject({
        code: 'HTTP_ERROR',
        status: 400,
        message: 'prompt is required',
      })
    })

    it('should convert SimpleRunRequest to API format', async () => {
      let capturedBody: unknown

      server.use(
        http.post(`${MOCK_BASE_URL}/run`, async ({ request }) => {
          capturedBody = await request.json()
          return HttpResponse.json(createRunResponse())
        })
      )

      const client = createClient()
      await client.run({
        prompt: 'Test prompt',
        model: 'opus',
        workdir: '/workspace',
        sessionId: 'sess-123',
        resume: true,
        timeout: '10m',
        memory: '1g',
        maxBudgetUsd: 5.0,
        systemPrompt: 'You are a tester',
        appendSystemPrompt: 'Be thorough',
        allowedTools: ['Bash', 'Read'],
        disallowedTools: ['Write'],
        webhookUrl: 'https://example.com/webhook',
      })

      expect(capturedBody).toMatchObject({
        prompt: 'Test prompt',
        workdir: '/workspace',
        webhook_url: 'https://example.com/webhook',
        claude: {
          model: 'opus',
          session_id: 'sess-123',
          resume: true,
          max_budget_usd: 5.0,
          system_prompt: 'You are a tester',
          append_system_prompt: 'Be thorough',
          allowed_tools: ['Bash', 'Read'],
          disallowed_tools: ['Write'],
        },
        podman: {
          timeout: '10m',
          memory: '1g',
        },
      })
    })
  })

  // ==========================================================================
  // Run Async Tests
  // ==========================================================================

  describe('runAsync', () => {
    it('should start an async job', async () => {
      const client = createClient()
      const result = await client.runAsync({
        prompt: 'Long running task',
      })

      expect(result.job_id).toBeDefined()
      expect(result.job_id).toMatch(/^job-/)
    })

    it('should store job for later retrieval', async () => {
      const client = createClient()
      const result = await client.runAsync({
        prompt: 'Task to track',
      })

      const jobId = result.job_id ?? ''
      expect(jobId).not.toBe('')
      expect(jobStore.has(jobId)).toBe(true)
      expect(jobStore.get(jobId)?.status).toBe('pending')
    })

    it('should throw StromboliError on error', async () => {
      server.use(
        http.post(`${MOCK_BASE_URL}/run/async`, () => {
          return HttpResponse.json(createErrorResponse('prompt is required'), { status: 400 })
        })
      )

      const client = createClient()

      await expect(client.runAsync({ prompt: '' })).rejects.toThrow(StromboliError)
    })
  })

  // ==========================================================================
  // Job Management Tests
  // ==========================================================================

  describe('getJob', () => {
    it('should get job status', async () => {
      // First create a job
      const client = createClient()
      const result = await client.runAsync({ prompt: 'Test' })
      const jobId = result.job_id ?? ''
      expect(jobId).not.toBe('')

      const job = await client.getJob(jobId)

      expect(job.id).toBe(jobId)
      expect(job.status).toBeDefined()
    })

    it('should throw StromboliError for unknown job', async () => {
      const client = createClient()

      await expect(client.getJob('job-nonexistent')).rejects.toThrow(StromboliError)
      await expect(client.getJob('job-nonexistent')).rejects.toMatchObject({
        code: 'HTTP_ERROR',
        status: 404,
      })
    })
  })

  describe('listJobs', () => {
    it('should list all jobs', async () => {
      const client = createClient()

      // Create some jobs first
      await client.runAsync({ prompt: 'Job 1' })
      await client.runAsync({ prompt: 'Job 2' })

      const { jobs } = await client.listJobs()

      expect(jobs).toBeDefined()
      expect(jobs?.length).toBeGreaterThanOrEqual(2)
    })

    it('should return empty list when no jobs', async () => {
      server.use(
        http.get(`${MOCK_BASE_URL}/jobs`, () => {
          return HttpResponse.json({ jobs: [] })
        })
      )

      const client = createClient()
      const { jobs } = await client.listJobs()

      expect(jobs).toEqual([])
    })
  })

  describe('cancelJob', () => {
    it('should cancel a job', async () => {
      const client = createClient()
      const result = await client.runAsync({ prompt: 'To cancel' })
      const jobId = result.job_id ?? ''
      expect(jobId).not.toBe('')

      await client.cancelJob(jobId)

      // Verify job is cancelled
      const job = await client.getJob(jobId)
      expect(job.status).toBe('cancelled')
    })

    it('should throw StromboliError for unknown job', async () => {
      const client = createClient()

      await expect(client.cancelJob('job-nonexistent')).rejects.toThrow(StromboliError)
    })
  })

  // ==========================================================================
  // Session Management Tests
  // ==========================================================================

  describe('listSessions', () => {
    it('should list all sessions', async () => {
      const client = createClient()
      const { sessions } = await client.listSessions()

      expect(sessions).toBeDefined()
      expect(Array.isArray(sessions)).toBe(true)
      expect(sessions?.length).toBeGreaterThan(0)
      expect(sessions?.[0]).toMatch(/^sess-/)
    })
  })

  describe('deleteSession', () => {
    it('should delete a session', async () => {
      const client = createClient()
      const result = await client.deleteSession('sess-abc123')

      expect(result.success).toBe(true)
      expect(result.session_id).toBe('sess-abc123')
    })

    it('should throw StromboliError on failure', async () => {
      server.use(
        http.delete(`${MOCK_BASE_URL}/sessions/:id`, () => {
          return HttpResponse.json(createErrorResponse('Session not found'), { status: 404 })
        })
      )

      const client = createClient()

      await expect(client.deleteSession('sess-nonexistent')).rejects.toThrow(StromboliError)
    })
  })

  describe('getSessionMessages', () => {
    it('should get session messages', async () => {
      const client = createClient()
      const result = await client.getSessionMessages('sess-abc123')

      expect(result.messages).toBeDefined()
      expect(Array.isArray(result.messages)).toBe(true)
      expect(result.total).toBeDefined()
      expect(result.limit).toBeDefined()
      expect(result.offset).toBeDefined()
    })

    it('should support pagination options', async () => {
      let capturedQuery: { limit?: number; offset?: number } = {}

      server.use(
        http.get(`${MOCK_BASE_URL}/sessions/:id/messages`, ({ request }) => {
          const url = new URL(request.url)
          capturedQuery = {
            limit: Number.parseInt(url.searchParams.get('limit') ?? '50', 10),
            offset: Number.parseInt(url.searchParams.get('offset') ?? '0', 10),
          }
          return HttpResponse.json(
            createSessionMessagesResponse(5, {
              limit: capturedQuery.limit,
              offset: capturedQuery.offset,
            })
          )
        })
      )

      const client = createClient()
      const result = await client.getSessionMessages('sess-abc123', {
        limit: 10,
        offset: 20,
      })

      expect(result.limit).toBe(10)
      expect(result.offset).toBe(20)
    })

    it('should throw StromboliError on failure', async () => {
      server.use(
        http.get(`${MOCK_BASE_URL}/sessions/:id/messages`, () => {
          return HttpResponse.json(createErrorResponse('Session not found'), { status: 404 })
        })
      )

      const client = createClient()

      await expect(client.getSessionMessages('sess-nonexistent')).rejects.toThrow(StromboliError)
    })
  })

  // ==========================================================================
  // Error Handling Tests
  // ==========================================================================

  describe('error handling', () => {
    it('should throw NETWORK_ERROR on connection failure', async () => {
      server.use(
        http.get(`${MOCK_BASE_URL}/health`, () => {
          return HttpResponse.error()
        })
      )

      const client = createClient()

      await expect(client.health()).rejects.toMatchObject({
        code: 'NETWORK_ERROR',
      })
    })

    it('should throw TIMEOUT_ERROR when request exceeds timeout', async () => {
      server.use(
        http.get(`${MOCK_BASE_URL}/health`, async () => {
          // Wait longer than the timeout
          await new Promise((r) => setTimeout(r, 200))
          return HttpResponse.json(createHealthResponse())
        })
      )

      const client = new StromboliClient({
        baseUrl: MOCK_BASE_URL,
        timeout: 50, // Very short timeout
      })

      await expect(client.health()).rejects.toMatchObject({
        code: 'TIMEOUT_ERROR',
      })
    })

    it('should retry on 5xx errors', async () => {
      let attempts = 0

      server.use(
        http.get(`${MOCK_BASE_URL}/health`, () => {
          attempts++
          if (attempts < 3) {
            return HttpResponse.json(createErrorResponse('Server error'), { status: 500 })
          }
          return HttpResponse.json(createHealthResponse())
        })
      )

      const client = new StromboliClient({
        baseUrl: MOCK_BASE_URL,
        retries: 3,
        retryDelay: 10, // Fast retries for tests
      })

      const result = await client.health()
      expect(result.status).toBe('ok')
      expect(attempts).toBe(3)
    })

    it('should not retry on 4xx errors', async () => {
      let attempts = 0

      server.use(
        http.get(`${MOCK_BASE_URL}/health`, () => {
          attempts++
          return HttpResponse.json(createErrorResponse('Bad request'), { status: 400 })
        })
      )

      const client = new StromboliClient({
        baseUrl: MOCK_BASE_URL,
        retries: 3,
        retryDelay: 10,
      })

      await expect(client.health()).rejects.toMatchObject({
        code: 'HTTP_ERROR',
        status: 400,
      })
      expect(attempts).toBe(1) // No retries
    })

    it('should respect max retries', async () => {
      let attempts = 0

      server.use(
        http.get(`${MOCK_BASE_URL}/health`, () => {
          attempts++
          return HttpResponse.json(createErrorResponse('Server error'), { status: 500 })
        })
      )

      const client = new StromboliClient({
        baseUrl: MOCK_BASE_URL,
        retries: 2,
        retryDelay: 10,
      })

      await expect(client.health()).rejects.toMatchObject({
        code: 'HTTP_ERROR',
        status: 500,
      })
      expect(attempts).toBe(3) // Initial + 2 retries
    })

    it('should call onError interceptor', async () => {
      let capturedError: StromboliError | undefined

      server.use(
        http.get(`${MOCK_BASE_URL}/health`, () => {
          return HttpResponse.json(createErrorResponse('Server error'), { status: 500 })
        })
      )

      const client = new StromboliClient({
        baseUrl: MOCK_BASE_URL,
        onError: (err) => {
          capturedError = err
        },
      })

      await expect(client.health()).rejects.toThrow()
      expect(capturedError).toBeDefined()
      expect(capturedError?.code).toBe('HTTP_ERROR')
    })
  })

  // ==========================================================================
  // Secrets Tests
  // ==========================================================================

  describe('listSecrets', () => {
    it('should return list of secrets', async () => {
      const client = createClient()
      const { secrets } = await client.listSecrets()

      expect(secrets).toBeDefined()
      expect(Array.isArray(secrets)).toBe(true)
      expect(secrets?.length).toBeGreaterThan(0)
    })
  })

  // ==========================================================================
  // Authentication Tests
  // ==========================================================================

  describe('authentication', () => {
    it('should authenticate and store token', async () => {
      const client = createClient()
      const result = await client.authenticate('my-client-id')

      expect(result.access_token).toBeDefined()
      expect(result.refresh_token).toBeDefined()
      expect(result.token_type).toBe('Bearer')
      expect(client.getAuthToken()).toBe(result.access_token)
    })

    it('should set auth token manually', () => {
      const client = createClient()
      client.setAuthToken('manual-token')
      expect(client.getAuthToken()).toBe('manual-token')
    })

    it('should refresh token', async () => {
      const client = createClient()
      const initial = await client.authenticate('my-client-id')
      const refreshed = await client.refreshToken(initial.refresh_token ?? '')

      expect(refreshed.access_token).toBeDefined()
      expect(client.getAuthToken()).toBe(refreshed.access_token)
    })

    it('should clear token on logout', async () => {
      const client = createClient()
      await client.authenticate('my-client-id')
      expect(client.getAuthToken()).toBeDefined()

      await client.logout()
      expect(client.getAuthToken()).toBeUndefined()
    })
  })

  // ==========================================================================
  // waitForJob Tests
  // ==========================================================================

  describe('waitForJob', () => {
    it('should poll until job completes', async () => {
      let pollCount = 0

      server.use(
        http.get(`${MOCK_BASE_URL}/jobs/:id`, ({ params }) => {
          pollCount++
          const status = pollCount >= 3 ? 'completed' : 'running'
          return HttpResponse.json(
            createJobResponse({
              id: params.id as string,
              status,
            })
          )
        })
      )

      const client = createClient()
      const result = await client.waitForJob('job-test', {
        pollInterval: 10, // Fast polling for tests
      })

      expect(result.status).toBe('completed')
      expect(pollCount).toBe(3)
    })

    it('should call onStatusChange callback', async () => {
      const statusChanges: string[] = []
      let pollCount = 0

      server.use(
        http.get(`${MOCK_BASE_URL}/jobs/:id`, ({ params }) => {
          pollCount++
          const status = pollCount >= 2 ? 'completed' : 'running'
          return HttpResponse.json(
            createJobResponse({
              id: params.id as string,
              status,
            })
          )
        })
      )

      const client = createClient()
      await client.waitForJob('job-test', {
        pollInterval: 10,
        onStatusChange: (status) => statusChanges.push(status),
      })

      expect(statusChanges).toEqual(['running', 'completed'])
    })

    it('should timeout after maxWaitTime', async () => {
      server.use(
        http.get(`${MOCK_BASE_URL}/jobs/:id`, ({ params }) => {
          return HttpResponse.json(
            createJobResponse({
              id: params.id as string,
              status: 'running', // Never completes
            })
          )
        })
      )

      const client = createClient()

      await expect(
        client.waitForJob('job-test', {
          pollInterval: 10,
          maxWaitTime: 50, // Very short timeout
        })
      ).rejects.toMatchObject({
        code: 'TIMEOUT_ERROR',
      })
    })
  })

  // ==========================================================================
  // Streaming Tests
  // ==========================================================================

  describe('stream', () => {
    it('should yield stream events', async () => {
      const client = createClient()
      const events: { type: string; data?: string }[] = []

      for await (const event of client.stream({ prompt: 'Hello' })) {
        events.push(event)
        if (event.type === 'done') break
      }

      expect(events.length).toBeGreaterThan(0)
      expect(events[events.length - 1].type).toBe('done')
    })
  })
})
