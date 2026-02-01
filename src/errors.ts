/**
 * Custom error class for Stromboli SDK errors
 */
export class StromboliError extends Error {
  override readonly name = 'StromboliError'

  constructor(
    message: string,
    public readonly code: string,
    public readonly status?: number,
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
   * Create an error from an HTTP response
   */
  static fromResponse(status: number, body: unknown): StromboliError {
    const message =
      typeof body === 'object' && body !== null && 'error' in body
        ? String((body as { error: unknown }).error)
        : `HTTP ${status}`

    return new StromboliError(message, 'HTTP_ERROR', status, body)
  }

  /**
   * Create a network error
   */
  static networkError(cause: unknown): StromboliError {
    return new StromboliError('Network request failed', 'NETWORK_ERROR', undefined, cause)
  }

  /**
   * Create a timeout error
   */
  static timeoutError(timeout: number): StromboliError {
    return new StromboliError(`Request timed out after ${timeout}ms`, 'TIMEOUT_ERROR')
  }
}
