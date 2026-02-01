/**
 * Stromboli SDK Error Handling
 *
 * Custom error types for the Stromboli TypeScript SDK.
 *
 * @module errors
 */

/**
 * Custom error class for Stromboli SDK errors.
 *
 * All errors thrown by the SDK are instances of this class,
 * making it easy to catch and handle Stromboli-specific errors.
 *
 * @example
 * ```typescript
 * import { StromboliClient, StromboliError } from 'stromboli-ts'
 *
 * const client = new StromboliClient('http://localhost:8585')
 *
 * try {
 *   await client.run({ prompt: 'Hello' })
 * } catch (error) {
 *   if (error instanceof StromboliError) {
 *     console.error(`Stromboli error [${error.code}]: ${error.message}`)
 *     console.error(`HTTP status: ${error.status}`)
 *
 *     // Handle specific error codes
 *     switch (error.code) {
 *       case 'HTTP_ERROR':
 *         console.error('API returned an error')
 *         break
 *       case 'NETWORK_ERROR':
 *         console.error('Could not reach the server')
 *         break
 *       case 'TIMEOUT_ERROR':
 *         console.error('Request timed out')
 *         break
 *     }
 *   } else {
 *     throw error // Re-throw unknown errors
 *   }
 * }
 * ```
 */
export class StromboliError extends Error {
  /**
   * Error name, always 'StromboliError'.
   * @readonly
   */
  override readonly name = 'StromboliError'

  /**
   * Create a new StromboliError.
   *
   * @param message - Human-readable error message
   * @param code - Error code for programmatic handling
   * @param status - HTTP status code (if applicable)
   * @param cause - Original error or response body that caused this error
   *
   * @example
   * ```typescript
   * throw new StromboliError(
   *   'Job not found',
   *   'NOT_FOUND',
   *   404,
   *   { error: 'job-abc123 does not exist' }
   * )
   * ```
   */
  constructor(
    message: string,
    /**
     * Error code for programmatic handling.
     *
     * Common codes:
     * - `HTTP_ERROR` - API returned an error response
     * - `NETWORK_ERROR` - Could not reach the server
     * - `TIMEOUT_ERROR` - Request timed out
     *
     * @readonly
     */
    public readonly code: string,
    /**
     * HTTP status code from the API response.
     * Only set for HTTP errors, undefined for network/timeout errors.
     *
     * Common status codes:
     * - `400` - Bad request (invalid parameters)
     * - `401` - Unauthorized (invalid/missing credentials)
     * - `404` - Not found (job/session doesn't exist)
     * - `500` - Internal server error
     * - `503` - Service unavailable
     *
     * @readonly
     */
    public readonly status?: number,
    /**
     * Original error or response body that caused this error.
     * Useful for debugging and logging.
     *
     * @readonly
     */
    public readonly cause?: unknown
  ) {
    super(message)

    // Maintains proper stack trace for where error was thrown (V8 engines)
    if ('captureStackTrace' in Error) {
      ;(
        Error as unknown as { captureStackTrace: (err: Error, ctor: unknown) => void }
      ).captureStackTrace(this, StromboliError)
    }
  }

  /**
   * Create an error from an HTTP response.
   *
   * Extracts the error message from the response body if available,
   * otherwise uses a generic message with the status code.
   *
   * @param status - HTTP status code
   * @param body - Response body (may contain `error` field)
   * @returns A new StromboliError instance
   *
   * @example
   * ```typescript
   * // With error message in body
   * const error = StromboliError.fromResponse(404, { error: 'Job not found' })
   * // error.message === 'Job not found'
   * // error.code === 'HTTP_ERROR'
   * // error.status === 404
   *
   * // Without error message
   * const error = StromboliError.fromResponse(500, null)
   * // error.message === 'HTTP 500'
   * ```
   */
  static fromResponse(status: number, body: unknown): StromboliError {
    const message =
      typeof body === 'object' && body !== null && 'error' in body
        ? String((body as { error: unknown }).error)
        : `HTTP ${status}`

    return new StromboliError(message, 'HTTP_ERROR', status, body)
  }

  /**
   * Create a network error.
   *
   * Used when the request fails due to network issues (DNS failure,
   * connection refused, etc.) before receiving any HTTP response.
   *
   * @param cause - The original network error
   * @returns A new StromboliError instance
   *
   * @example
   * ```typescript
   * try {
   *   await fetch('http://unreachable:8585')
   * } catch (networkError) {
   *   throw StromboliError.networkError(networkError)
   * }
   * ```
   */
  static networkError(cause: unknown): StromboliError {
    return new StromboliError('Network request failed', 'NETWORK_ERROR', undefined, cause)
  }

  /**
   * Create a timeout error.
   *
   * Used when a request exceeds the configured timeout duration.
   *
   * @param timeout - The timeout duration in milliseconds
   * @returns A new StromboliError instance
   *
   * @example
   * ```typescript
   * // When a request takes too long
   * throw StromboliError.timeoutError(30000)
   * // error.message === 'Request timed out after 30000ms'
   * // error.code === 'TIMEOUT_ERROR'
   * ```
   */
  static timeoutError(timeout: number): StromboliError {
    return new StromboliError(`Request timed out after ${timeout}ms`, 'TIMEOUT_ERROR')
  }

  /**
   * Create an aborted error.
   *
   * Used when a request is cancelled by the user via AbortSignal.
   *
   * @returns A new StromboliError instance
   *
   * @example
   * ```typescript
   * const controller = new AbortController()
   * controller.abort()
   *
   * // Later in the code
   * if (signal.aborted) {
   *   throw StromboliError.abortedError()
   * }
   * // error.message === 'Request was aborted'
   * // error.code === 'ABORTED'
   * ```
   */
  static abortedError(): StromboliError {
    return new StromboliError('Request was aborted', 'ABORTED')
  }
}
