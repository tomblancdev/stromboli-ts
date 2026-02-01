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
})
