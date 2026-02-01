import { describe, expect, it } from 'bun:test'
import { StromboliError } from '../../src/errors'

describe('StromboliError', () => {
  it('should create an error with basic properties', () => {
    const error = new StromboliError('Test error', 'TEST_CODE', 500)

    expect(error.message).toBe('Test error')
    expect(error.code).toBe('TEST_CODE')
    expect(error.status).toBe(500)
    expect(error.name).toBe('StromboliError')
  })

  it('should create an error without status', () => {
    const error = new StromboliError('Test error', 'TEST_CODE')

    expect(error.message).toBe('Test error')
    expect(error.code).toBe('TEST_CODE')
    expect(error.status).toBeUndefined()
  })

  it('should create an error with cause', () => {
    const cause = new Error('Original error')
    const error = new StromboliError('Wrapped error', 'WRAP_CODE', 500, cause)

    expect(error.cause).toBe(cause)
  })

  describe('fromResponse', () => {
    it('should create error from response with error field', () => {
      const error = StromboliError.fromResponse(400, { error: 'Bad request' })

      expect(error.message).toBe('Bad request')
      expect(error.code).toBe('HTTP_ERROR')
      expect(error.status).toBe(400)
    })

    it('should create error from response without error field', () => {
      const error = StromboliError.fromResponse(500, null)

      expect(error.message).toBe('HTTP 500')
      expect(error.code).toBe('HTTP_ERROR')
      expect(error.status).toBe(500)
    })
  })

  describe('networkError', () => {
    it('should create a network error', () => {
      const cause = new Error('Connection refused')
      const error = StromboliError.networkError(cause)

      expect(error.message).toBe('Network request failed')
      expect(error.code).toBe('NETWORK_ERROR')
      expect(error.cause).toBe(cause)
    })
  })

  describe('timeoutError', () => {
    it('should create a timeout error', () => {
      const error = StromboliError.timeoutError(5000)

      expect(error.message).toBe('Request timed out after 5000ms')
      expect(error.code).toBe('TIMEOUT_ERROR')
    })
  })
})
