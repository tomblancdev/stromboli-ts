# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2-alpha] - 2025-02-01

### Added

- **Authentication with auto-injection**: Auth tokens are now automatically injected
  into all API requests via middleware. Use `authenticate()`, `refreshToken()`, and
  `logout()` methods.
- **`isAuthenticated()` helper**: Check if client has an auth token set without
  making a network request.
- **Request cancellation**: Pass an `AbortSignal` via the `signal` option in
  `run()` and `runAsync()` to cancel in-flight requests.
- **Streaming with idle timeout**: `stream()` now accepts `StreamOptions` with
  `connectionTimeout` and `idleTimeout` for better timeout control.
- **Custom retry delay functions**: `retryDelay` option now accepts a function
  for custom strategies like exponential backoff with jitter.
- **Debug logging**: Pass a `debug` callback to client options to receive internal
  SDK events for debugging and diagnostics.
- **Request ID tracking**: All requests now include an `X-Request-ID` header for
  correlation with server logs.
- **`waitForJob()` helper**: Poll for async job completion with configurable
  interval and timeout.
- **`listSecrets()` method**: List available Podman secrets for injection.
- **`isCompatible()` function**: Check if API version is compatible with SDK.
- **New type exports**:
  - `StreamEvent` (discriminated union)
  - `StreamContentEvent`, `StreamToolUseEvent`, `StreamToolResultEvent`,
    `StreamErrorEvent`, `StreamDoneEvent`
  - `StreamOptions`
  - `InterceptorResponse`
  - `RetryDelayFn`

### Changed

- **`StreamEvent` is now a discriminated union**: TypeScript can now properly
  narrow event types. Use `event.type` to access type-specific properties without
  optional chaining.
- **`retryDelay` accepts function**: In addition to a number, you can now pass
  a function like `(attempt, base) => base * 2 ** (attempt - 1) + jitter`.
- **Improved timeout handling for streams**: Streams now use dual timeouts -
  connection timeout for initial connection, and idle timeout between chunks.
- **`onResponse` interceptor receives `InterceptorResponse`**: Properly typed
  response object instead of using Response with type casting.

### Fixed

- **Auth token auto-injection**: Tokens set via `authenticate()` or `setAuthToken()`
  are now automatically included in all subsequent requests.
- **Type declarations emitted in build**: `dist/index.d.ts` is now properly generated.
- **E2E workflow path corrected**: CI now correctly runs E2E tests.
- **CI coverage enforcement**: Coverage job now fails if line coverage drops below 80%.

## [0.1.0] - 2025-01-31

### Added

- Initial SDK release
- `StromboliClient` with full API support
- Sync (`run`) and async (`runAsync`) execution
- Streaming output via `stream()` async generator
- Session management (`listSessions`, `deleteSession`, `getSessionMessages`)
- Job management (`getJob`, `listJobs`, `cancelJob`)
- Health checks (`health`, `claudeStatus`)
- Authentication (`authenticate`, `refreshToken`, `validateToken`, `logout`)
- Retry logic with configurable backoff
- Request/response interceptors
- Error handling with `StromboliError`
- Full TypeScript support with generated types
- MSW-based test mocking

[0.1.2-alpha]: https://github.com/tomblancdev/stromboli-ts/compare/v0.1.0...v0.1.2-alpha
[0.1.0]: https://github.com/tomblancdev/stromboli-ts/releases/tag/v0.1.0
