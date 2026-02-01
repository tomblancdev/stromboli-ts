/**
 * MSW Server Setup
 *
 * Configures Mock Service Worker for Node.js/Bun test environments.
 * Import this in your test setup to enable API mocking.
 *
 * @module tests/mocks/server
 */

import { setupServer } from 'msw/node'
import { handlers, resetJobStore } from './handlers'

/**
 * MSW server instance for intercepting HTTP requests in tests.
 *
 * @example
 * ```typescript
 * import { beforeAll, afterAll, afterEach } from 'bun:test'
 * import { server } from '../mocks/server'
 *
 * beforeAll(() => server.listen())
 * afterEach(() => server.resetHandlers())
 * afterAll(() => server.close())
 * ```
 */
export const server = setupServer(...handlers)

/**
 * Start the mock server with default handlers.
 * Call this in `beforeAll` hook.
 */
export function startServer(): void {
  server.listen({ onUnhandledRequest: 'error' })
}

/**
 * Reset handlers and state between tests.
 * Call this in `afterEach` hook.
 */
export function resetServer(): void {
  server.resetHandlers()
  resetJobStore()
}

/**
 * Stop the mock server.
 * Call this in `afterAll` hook.
 */
export function stopServer(): void {
  server.close()
}

// Re-export for convenience
export { handlers, createHandlers, MOCK_BASE_URL, jobStore, resetJobStore } from './handlers'
export * from './factories'
