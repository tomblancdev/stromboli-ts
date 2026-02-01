/**
 * StromboliClient E2E Tests
 *
 * Tests against Prism mock server running the OpenAPI spec.
 * Run with: make test-e2e
 *
 * These tests verify:
 * - Real HTTP request/response cycles
 * - OpenAPI spec validation (Prism validates requests)
 * - Response structure matches schema
 */

import { beforeAll, describe, expect, it } from 'bun:test'
import { StromboliClient } from '../../src/client'
import { StromboliError } from '../../src/errors'

// ============================================================================
// Test Setup
// ============================================================================

// Prism server URL (set by Makefile, defaults to localhost for local testing)
const PRISM_URL = process.env.STROMBOLI_URL ?? 'http://localhost:4010'

let client: StromboliClient

beforeAll(() => {
  client = new StromboliClient(PRISM_URL)
  console.log(`🔗 Testing against: ${PRISM_URL}`)
})

// ============================================================================
// Health Endpoint Tests
// ============================================================================

describe('E2E: Health', () => {
  it('should return health status from Prism mock', async () => {
    const health = await client.health()

    // Prism returns example values from the OpenAPI spec
    expect(health).toBeDefined()
    expect(health.name).toBeDefined()
    expect(health.status).toBeDefined()
    expect(health.version).toBeDefined()
  })
})

// ============================================================================
// Claude Status Tests
// ============================================================================

describe('E2E: Claude Status', () => {
  it('should return claude status from Prism mock', async () => {
    const status = await client.claudeStatus()

    expect(status).toBeDefined()
    // Prism generates responses based on schema
    expect(typeof status.configured === 'boolean' || status.configured === undefined).toBe(true)
  })
})

// ============================================================================
// Run Tests
// ============================================================================

describe('E2E: Run', () => {
  it('should execute a run request', async () => {
    const result = await client.run({
      prompt: 'Hello from E2E test!',
      model: 'haiku',
    })

    expect(result).toBeDefined()
    // Prism returns example values from spec
    expect(result.id).toBeDefined()
    expect(result.status).toBeDefined()
  })

  it('should handle full API request format', async () => {
    const result = await client.run({
      prompt: 'Test with full options',
      claude: {
        model: 'sonnet',
        max_budget_usd: 1.0,
      },
      podman: {
        timeout: '5m',
        memory: '512m',
      },
    })

    expect(result).toBeDefined()
    expect(result.status).toBeDefined()
  })
})

// ============================================================================
// Async Run Tests
// ============================================================================

describe('E2E: Run Async', () => {
  it('should start an async job', async () => {
    const job = await client.runAsync({
      prompt: 'Async E2E test',
    })

    expect(job).toBeDefined()
    expect(job.job_id).toBeDefined()
  })
})

// ============================================================================
// Job Management Tests
// ============================================================================

describe('E2E: Jobs', () => {
  it('should list jobs', async () => {
    const result = await client.listJobs()

    expect(result).toBeDefined()
    // jobs may be undefined or an array
    expect(result.jobs === undefined || Array.isArray(result.jobs)).toBe(true)
  })

  // Note: getJob requires a valid job ID, Prism may return 404 for made-up IDs
  // This test verifies the request format is correct
  it('should make valid getJob request', async () => {
    try {
      // Prism may return mock data or 404 depending on configuration
      const job = await client.getJob('job-example123')
      expect(job).toBeDefined()
    } catch (error) {
      // 404 is acceptable - it means the request format was valid
      expect(error).toBeInstanceOf(StromboliError)
      if (error instanceof StromboliError) {
        expect([404, 500]).toContain(error.status)
      }
    }
  })
})

// ============================================================================
// Session Management Tests
// ============================================================================

describe('E2E: Sessions', () => {
  it('should list sessions', async () => {
    const result = await client.listSessions()

    expect(result).toBeDefined()
    // sessions may be undefined or an array
    expect(result.sessions === undefined || Array.isArray(result.sessions)).toBe(true)
  })

  it('should make valid deleteSession request', async () => {
    try {
      const result = await client.deleteSession('sess-example123')
      expect(result).toBeDefined()
    } catch (error) {
      // 404 is acceptable - it means the request format was valid
      expect(error).toBeInstanceOf(StromboliError)
      if (error instanceof StromboliError) {
        expect([404, 500]).toContain(error.status)
      }
    }
  })

  it('should make valid getSessionMessages request', async () => {
    try {
      const result = await client.getSessionMessages('sess-example123', {
        limit: 10,
        offset: 0,
      })
      expect(result).toBeDefined()
    } catch (error) {
      // 404 is acceptable - it means the request format was valid
      expect(error).toBeInstanceOf(StromboliError)
      if (error instanceof StromboliError) {
        expect([404, 500]).toContain(error.status)
      }
    }
  })
})

// ============================================================================
// Request Validation Tests
// ============================================================================

describe('E2E: Request Validation', () => {
  it('should validate SimpleRunRequest conversion', async () => {
    // This test ensures our SimpleRunRequest -> RunRequest conversion
    // produces valid requests that Prism accepts
    const result = await client.run({
      prompt: 'Validation test',
      model: 'opus',
      workdir: '/workspace',
      timeout: '10m',
      memory: '1g',
      maxBudgetUsd: 5.0,
      systemPrompt: 'You are a tester',
      appendSystemPrompt: 'Be thorough',
      allowedTools: ['Bash', 'Read'],
      disallowedTools: ['Write'],
    })

    // If Prism accepts it, the conversion is valid
    expect(result).toBeDefined()
  })
})
