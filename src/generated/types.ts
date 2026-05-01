export type paths = {
    "/agents": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List persistent agents */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["stromboli_internal_agent.Snapshot"][];
                    };
                };
            };
        };
        put?: never;
        /**
         * Spawn a persistent agent
         * @description Launches a long-lived Claude container with stream-json I/O.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            /** @description Agent configuration */
            requestBody: {
                content: {
                    "application/json": components["schemas"]["stromboli_internal_agent.CreateRequest"];
                };
            };
            responses: {
                /** @description Created */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.CreateAgentResponse"];
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.errorBody"];
                    };
                };
                /** @description Spawn failed */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.errorBody"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agents/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get persistent agent */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Agent ID */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["stromboli_internal_agent.Snapshot"];
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.errorBody"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        /** Stop a persistent agent */
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Agent ID */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description No Content */
                204: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content?: never;
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "*/*": components["schemas"]["internal_api.errorBody"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agents/{id}/send": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Send a turn to a persistent agent */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Agent ID */
                    id: string;
                };
                cookie?: never;
            };
            /** @description Prompt */
            requestBody: {
                content: {
                    "application/json": components["schemas"]["internal_api.SendAgentRequest"];
                };
            };
            responses: {
                /** @description Accepted */
                202: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.SendAgentResponse"];
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.errorBody"];
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.errorBody"];
                    };
                };
                /** @description Turn already in progress */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.errorBody"];
                    };
                };
                /** @description Agent has exited */
                410: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.errorBody"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agents/{id}/stream": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Stream a persistent agent's events (SSE) */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Agent ID */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description SSE stream of agent.Event objects */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/event-stream": string;
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/event-stream": components["schemas"]["internal_api.errorBody"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Logout (invalidate token)
         * @description Invalidates a JWT token by adding it to the blacklist
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.LogoutResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.ErrorResponse"];
                    };
                };
                /** @description Service Unavailable */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Refresh access token
         * @description Generate a new access token using a valid refresh token
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            /** @description Refresh request */
            requestBody: {
                content: {
                    "application/json": components["schemas"]["internal_api.RefreshRequest"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.TokenResponse"];
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.ErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/token": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Generate JWT tokens
         * @description Generate new JWT access and refresh tokens using API credentials
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            /** @description Token request */
            requestBody: {
                content: {
                    "application/json": components["schemas"]["internal_api.TokenRequest"];
                };
            };
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.TokenResponse"];
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.ErrorResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/validate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Validate JWT token
         * @description Validate a JWT token and return its claims
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.ValidateResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/claude/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Claude status
         * @description Checks if Claude credentials are configured
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.ClaudeStatusResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Health check
         * @description Returns the health status of the API with component checks
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.HealthResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/images": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List images
         * @description Returns all local container images sorted by compatibility rank. Images with rank 1-2 are verified compatible, rank 3 is standard glibc (compatible), rank 4 is incompatible (Alpine/musl).
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List of images (empty array if none exist) */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.ImagesListResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/images/{name}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Inspect image
         * @description Returns detailed information about a specific container image including all labels and compatibility information.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /**
                     * @description Image name with optional tag
                     * @example python:3.12-slim
                     */
                    name: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Image details */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.ImageDetailResponse"];
                    };
                };
                /** @description Invalid image name */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.ErrorResponse"];
                    };
                };
                /** @description Image not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.ErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/images/pull": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Pull image
         * @description Pulls a container image from a registry. This operation may take some time for large images.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            /** @description Pull request */
            requestBody: {
                content: {
                    "application/json": components["schemas"]["internal_api.ImagePullRequest"];
                };
            };
            responses: {
                /** @description Image pulled successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.ImagePullResponse"];
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.ErrorResponse"];
                    };
                };
                /** @description Pull failed */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.ErrorResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/images/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Search images
         * @description Searches container registries for images matching the query. Returns results from Docker Hub and other configured registries.
         */
        get: {
            parameters: {
                query: {
                    /**
                     * @description Search query
                     * @example python
                     */
                    q: string;
                    /**
                     * @description Maximum number of results (default 25, max 100)
                     * @example 10
                     */
                    limit?: number;
                    /**
                     * @description Don't truncate output (show full descriptions)
                     * @example true
                     */
                    no_trunc?: boolean;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Search results */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.ImageSearchResponse"];
                    };
                };
                /** @description Invalid request (missing query) */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.ErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.ErrorResponse"];
                    };
                };
                /** @description Registry search failed */
                502: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/jobs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List jobs
         * @description Returns all async jobs
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.JobListResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/jobs/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get job status
         * @description Returns the status and result of an async job
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Job ID */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.JobResponse"];
                    };
                };
                /** @description Job not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.RunResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        /**
         * Cancel job
         * @description Cancels a pending or running job
         */
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Job ID */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.JobCancelResponse"];
                    };
                };
                /** @description Job not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.RunResponse"];
                    };
                };
                /** @description Job cannot be cancelled */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.RunResponse"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/run": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Run Claude
         * @description Executes Claude Code in an isolated Podman container
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: components["requestBodies"]["internal_api.RunRequest"];
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.RunResponse"];
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.RunResponse"];
                    };
                };
                /** @description Execution failed */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.RunResponse"];
                    };
                };
                /** @description Claude not configured */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.RunResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/run/async": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Run Claude async
         * @description Starts Claude Code execution asynchronously and returns a job ID
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: components["requestBodies"]["internal_api.RunRequest"];
            responses: {
                /** @description Accepted */
                202: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.AsyncRunResponse"];
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.RunResponse"];
                    };
                };
                /** @description Claude not configured */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.RunResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/run/stream": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Stream Claude output
         * @description Executes Claude and streams output in real-time using SSE
         */
        get: {
            parameters: {
                query: {
                    /** @description The prompt to send to Claude */
                    prompt: string;
                    /** @description Working directory inside container */
                    workdir?: string;
                    /** @description Session ID for conversation continuation */
                    session_id?: string;
                };
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Event stream of output lines */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/event-stream": string;
                    };
                };
                /** @description Invalid request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/event-stream": string;
                    };
                };
                /** @description Claude not configured */
                503: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "text/event-stream": string;
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/secrets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List secrets
         * @description Returns metadata for all available Podman secrets that can be injected into agents. Secret values are never returned - only IDs, names, and creation times.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description List of secrets (empty array if none exist) */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.SecretsListResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.SecretsListResponse"];
                    };
                };
            };
        };
        put?: never;
        /**
         * Create secret
         * @description Creates a new Podman secret that can be injected into agents. Secret names must be alphanumeric (with dashes and underscores), max 253 characters. Values are limited to 1MB.
         */
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            /** @description Create secret request */
            requestBody: {
                content: {
                    "application/json": components["schemas"]["internal_api.CreateSecretRequest"];
                };
            };
            responses: {
                /** @description Secret created successfully */
                201: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.CreateSecretResponse"];
                    };
                };
                /** @description Invalid request (missing/invalid name or value) */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.CreateSecretResponse"];
                    };
                };
                /** @description Secret with this name already exists */
                409: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.CreateSecretResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.CreateSecretResponse"];
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/secrets/{name}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get secret metadata
         * @description Returns metadata about a specific Podman secret. For security, the actual secret value is never returned - only the ID, name, and creation time.
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /**
                     * @description Secret name
                     * @example github-token
                     */
                    name: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Secret metadata */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.SecretInfoResponse"];
                    };
                };
                /** @description Invalid secret name */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.ErrorResponse"];
                    };
                };
                /** @description Secret not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.ErrorResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.ErrorResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        /**
         * Delete secret
         * @description Permanently deletes a Podman secret. This action cannot be undone. Secrets currently in use by running containers may cause those containers to fail.
         */
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /**
                     * @description Secret name
                     * @example github-token
                     */
                    name: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Secret deleted successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.DeleteSecretResponse"];
                    };
                };
                /** @description Invalid secret name */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.DeleteSecretResponse"];
                    };
                };
                /** @description Secret not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.DeleteSecretResponse"];
                    };
                };
                /** @description Internal server error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.DeleteSecretResponse"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/sessions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List sessions
         * @description Returns all existing session IDs
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.SessionListResponse"];
                    };
                };
                /** @description Internal Server Error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.SessionListResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/sessions/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Destroy session
         * @description Removes a session and all its stored data
         */
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Session ID */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.SessionDestroyResponse"];
                    };
                };
                /** @description Bad Request */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.SessionDestroyResponse"];
                    };
                };
                /** @description Not Found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.SessionDestroyResponse"];
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/sessions/{id}/messages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List session messages
         * @description Returns paginated conversation history for a session including all messages, tool calls, and results
         */
        get: {
            parameters: {
                query?: {
                    /** @description Offset for pagination (default: 0) */
                    offset?: number;
                    /** @description Number of messages to return (default: 50, max: 200) */
                    limit?: number;
                };
                header?: never;
                path: {
                    /** @description Session ID (UUID) */
                    id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.SessionMessagesResponse"];
                    };
                };
                /** @description Invalid parameters */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.SessionMessagesResponse"];
                    };
                };
                /** @description Session not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.SessionMessagesResponse"];
                    };
                };
                /** @description Internal error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.SessionMessagesResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/sessions/{id}/messages/{message_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get session message
         * @description Returns a specific message from session history by UUID, including full content, tool calls, and results
         */
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    /** @description Session ID (UUID) */
                    id: string;
                    /** @description Message UUID */
                    message_id: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description OK */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.SessionMessageResponse"];
                    };
                };
                /** @description Invalid parameters */
                400: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.SessionMessageResponse"];
                    };
                };
                /** @description Message not found */
                404: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.SessionMessageResponse"];
                    };
                };
                /** @description Internal error */
                500: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": components["schemas"]["internal_api.SessionMessageResponse"];
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
};
export type webhooks = Record<string, never>;
export type components = {
    schemas: {
        /** @description Response from starting an async Claude execution */
        "internal_api.AsyncRunResponse": {
            /** @example job-abc123def456 */
            job_id?: string;
            /** @example 550e8400-e29b-41d4-a716-446655440000 */
            session_id?: string;
        };
        /** @description Claude configuration status */
        "internal_api.ClaudeStatusResponse": {
            /** @example true */
            configured?: boolean;
            /** @example Claude is configured */
            message?: string;
        };
        "internal_api.ComponentHealth": {
            /**
             * @description Error message if status is "error"
             * @example
             */
            error?: string;
            /**
             * @description Name of the component
             * @example podman
             */
            name?: string;
            /**
             * @description Status is "ok" or "error"
             * @example ok
             */
            status?: string;
        };
        /** @description Created agent metadata */
        "internal_api.CreateAgentResponse": {
            created_at?: string;
            exit_error?: string;
            id?: string;
            idle_timeout_disabled?: boolean;
            idle_timeout_seconds?: number;
            last_activity_at?: string;
            session_id?: string;
            status?: components["schemas"]["stromboli_internal_agent.Status"];
            turns_completed?: number;
        };
        /** @description Request to create a new Podman secret */
        "internal_api.CreateSecretRequest": {
            /** @example github-token */
            name: string;
            /** @example ghp_xxxxxxxxxxxx */
            value: string;
        };
        /** @description Result of secret creation */
        "internal_api.CreateSecretResponse": {
            error?: string;
            /** @example github-token */
            name?: string;
            /** @example true */
            success?: boolean;
        };
        /** @description Result of secret deletion */
        "internal_api.DeleteSecretResponse": {
            error?: string;
            /** @example github-token */
            name?: string;
            /** @example true */
            success?: boolean;
        };
        "internal_api.ErrorResponse": {
            error?: string;
        };
        /** @description Health check response */
        "internal_api.HealthResponse": {
            components?: components["schemas"]["internal_api.ComponentHealth"][];
            /** @example stromboli */
            name?: string;
            /** @example ok */
            status?: string;
            /** @example 0.1.4 */
            version?: string;
        };
        /** @description Detailed container image information including labels */
        "internal_api.ImageDetailResponse": {
            /** @example 3 */
            compatibility_rank?: number;
            /** @example true */
            compatible?: boolean;
            /** @example 2024-01-15T10:30:00Z */
            created?: string;
            /** @example Python development image */
            description?: string;
            /** @example false */
            has_claude_cli?: boolean;
            /** @example sha256:abc123def456 */
            id?: string;
            labels?: {
                [key: string]: string;
            };
            /** @example Standard glibc-based (compatible) */
            rank_description?: string;
            /** @example python */
            repository?: string;
            /** @example 125000000 */
            size?: number;
            /** @example 3.12-slim */
            tag?: string;
            /**
             * @example [
             *       "python",
             *       "pip"
             *     ]
             */
            tools?: string[];
        };
        /** @description Container image metadata with compatibility information */
        "internal_api.ImageInfoResponse": {
            /** @example 3 */
            compatibility_rank?: number;
            /** @example true */
            compatible?: boolean;
            /** @example 2024-01-15T10:30:00Z */
            created?: string;
            /** @example Python development image */
            description?: string;
            /** @example false */
            has_claude_cli?: boolean;
            /** @example sha256:abc123def456 */
            id?: string;
            /** @example python */
            repository?: string;
            /** @example 125000000 */
            size?: number;
            /** @example 3.12-slim */
            tag?: string;
            /**
             * @example [
             *       "python",
             *       "pip"
             *     ]
             */
            tools?: string[];
        };
        /** @description Request to pull a container image from a registry */
        "internal_api.ImagePullRequest": {
            /** @example python:3.12-slim */
            image: string;
            /** @example linux/amd64 */
            platform?: string;
            /** @example true */
            quiet?: boolean;
        };
        /** @description Result of image pull operation */
        "internal_api.ImagePullResponse": {
            /** @example python:3.12-slim */
            image?: string;
            /** @example sha256:abc123def456 */
            image_id?: string;
            /** @example true */
            success?: boolean;
        };
        /** @description Search results from container registries */
        "internal_api.ImageSearchResponse": {
            results?: components["schemas"]["internal_api.SearchResultResponse"][];
        };
        /** @description List of local container images sorted by compatibility */
        "internal_api.ImagesListResponse": {
            images?: components["schemas"]["internal_api.ImageInfoResponse"][];
        };
        /** @description Result of a job cancel request */
        "internal_api.JobCancelResponse": {
            /** @example true */
            cancelled?: boolean;
            /** @example job-abc123def456 */
            job_id?: string;
        };
        /** @description List of async jobs */
        "internal_api.JobListResponse": {
            jobs?: components["schemas"]["internal_api.JobResponse"][];
        };
        /** @description Job status and result */
        "internal_api.JobResponse": {
            crash_info?: components["schemas"]["stromboli_internal_job.CrashInfo"];
            /** @example 2024-01-15T10:30:00Z */
            created_at?: string;
            error?: string;
            /** @example job-abc123def456 */
            id?: string;
            /** @example Hello! */
            output?: string;
            /** @example sess-abc123def456 */
            session_id?: string;
            /** @example running */
            status?: components["schemas"]["stromboli_internal_job.Status"];
            structured_output?: Record<string, never>;
            /** @example 2024-01-15T10:31:00Z */
            updated_at?: string;
        };
        "internal_api.LogoutResponse": {
            message?: string;
            success?: boolean;
        };
        "internal_api.RefreshRequest": {
            refresh_token: string;
        };
        /** @description Request to execute Claude Code in an isolated container */
        "internal_api.RunRequest": {
            /** @description Claude configuration - all CLI options exposed */
            claude?: components["schemas"]["stromboli_internal_types.ClaudeOptions"];
            /** @description Podman configuration */
            podman?: components["schemas"]["stromboli_internal_types.PodmanOptions"];
            /**
             * @description Required: the prompt to send to Claude
             * @example Analyze this code and suggest improvements
             */
            prompt: string;
            /**
             * @description Webhook URL to notify when job completes (async only)
             * @example https://example.com/webhook
             */
            webhook_url?: string;
            /**
             * @description Working directory inside the container where Claude will spawn
             *     Use podman.volumes to mount host paths into the container
             * @example /workspace
             */
            workdir?: string;
        };
        /** @description Response from Claude execution */
        "internal_api.RunResponse": {
            /** @description Crash details (when status is "crashed") */
            crash_info?: components["schemas"]["stromboli_internal_job.CrashInfo"];
            /**
             * @description Error message (when failed)
             * @example
             */
            error?: string;
            /**
             * @description Unique run identifier
             * @example run-abc123def456
             */
            id?: string;
            /**
             * @description Claude's raw output (full CLI output, including JSON envelope when output_format=json)
             * @example Here is my analysis...
             */
            output?: string;
            /**
             * @description Session ID for conversation continuation
             * @example sess-abc123def456
             */
            session_id?: string;
            /**
             * @description Execution status: completed, crashed, error
             * @example completed
             */
            status?: string;
            /**
             * @description Extracted structured_output from Claude's JSON envelope (when json_schema is used).
             *     Convenience field so callers don't need to parse the envelope themselves.
             */
            structured_output?: Record<string, never>;
            /**
             * @description Token usage totals + estimated USD cost. Populated best-effort from the
             *     session's JSONL; nil when the session file isn't readable yet or no
             *     assistant message reported usage.
             */
            usage?: components["schemas"]["stromboli_internal_job.Usage"];
        };
        /** @description Search result from a container registry */
        "internal_api.SearchResultResponse": {
            /** @example false */
            automated?: boolean;
            /** @example Python is an interpreted programming language */
            description?: string;
            /** @example docker.io */
            index?: string;
            /** @example python */
            name?: string;
            /** @example true */
            official?: boolean;
            /** @example 8500 */
            stars?: number;
        };
        /** @description Secret metadata (never contains the actual secret value) */
        "internal_api.SecretInfoResponse": {
            /** @example 2024-01-15T10:30:00Z */
            created_at?: string;
            /** @example abc123def456 */
            id?: string;
            /** @example github-token */
            name?: string;
        };
        /** @description List of available secrets that can be injected into agents */
        "internal_api.SecretsListResponse": {
            error?: string;
            secrets?: components["schemas"]["internal_api.SecretInfoResponse"][];
        };
        /** @description Append a prompt to a running agent's stream-json stdin */
        "internal_api.SendAgentRequest": {
            /** @example Tell me about that alert */
            prompt: string;
        };
        /** @description Acknowledgement that a turn has started; output streams via /stream */
        "internal_api.SendAgentResponse": {
            /** @example turn-abc123 */
            turn_id?: string;
        };
        /** @description Result of session destruction */
        "internal_api.SessionDestroyResponse": {
            error?: string;
            /** @example sess-abc123 */
            session_id?: string;
            /** @example true */
            success?: boolean;
        };
        /** @description Metadata about a single session */
        "internal_api.SessionInfo": {
            /** @example sess-abc123 */
            id?: string;
            /**
             * @description Title is set by a UserPromptSubmit hook returning
             *     hookSpecificOutput.sessionTitle (or by /rename in interactive mode).
             *     Empty when no title was ever set for this session.
             * @example Refactor billing service
             */
            title?: string;
        };
        /** @description List of existing sessions with metadata */
        "internal_api.SessionListResponse": {
            error?: string;
            sessions?: components["schemas"]["internal_api.SessionInfo"][];
        };
        /** @description A single message from session history */
        "internal_api.SessionMessageResponse": {
            error?: string;
            message?: components["schemas"]["stromboli_internal_history.Message"];
        };
        /** @description Paginated list of session messages */
        "internal_api.SessionMessagesResponse": {
            has_more?: boolean;
            limit?: number;
            messages?: components["schemas"]["stromboli_internal_history.Message"][];
            offset?: number;
            total?: number;
        };
        "internal_api.TokenRequest": {
            client_id: string;
        };
        "internal_api.TokenResponse": {
            access_token?: string;
            expires_in?: number;
            refresh_token?: string;
            token_type?: string;
        };
        "internal_api.ValidateResponse": {
            expires_at?: number;
            subject?: string;
            valid?: boolean;
        };
        "internal_api.errorBody": {
            error?: string;
        };
        /** @description Configuration for spawning a long-lived Claude agent */
        "stromboli_internal_agent.CreateRequest": {
            /**
             * @description Claude CLI options forwarded to the command builder. Same shape as
             *     RunRequest.claude so callers don't have to learn two schemas — the
             *     field is fully typed in OpenAPI rather than a freeform object.
             */
            claude?: components["schemas"]["stromboli_internal_types.ClaudeOptions"];
            /**
             * @description DisableIdleTimeout opts the agent out of the idle watchdog entirely.
             *     The agent will run until DELETE /agents/{id} or server shutdown — no
             *     auto-stop on inactivity. Use only for service bots where the caller
             *     owns the lifecycle explicitly; an agent with this set CAN'T leak by
             *     being forgotten, so the safety net you'd otherwise have is gone.
             *     Stromboli logs a loud WARN on spawn so the override is visible.
             * @example false
             */
            disable_idle_timeout?: boolean;
            /**
             * @description Idle-timeout override in seconds. Zero means "use the manager default
             *     (DefaultIdleTimeout)". Negative values are rejected at parse time.
             *     Ignored when DisableIdleTimeout is true.
             * @example 1800
             */
            idle_timeout_seconds?: number;
            /**
             * @description Initial prompt sent as the first turn. Optional — callers can also
             *     create an empty agent and use /send for the first interaction.
             * @example You are an on-call assistant.
             */
            prompt?: string;
            /**
             * @description Working directory inside the container.
             * @example /workspace
             */
            workdir?: string;
        };
        "stromboli_internal_agent.Snapshot": {
            created_at?: string;
            exit_error?: string;
            id?: string;
            idle_timeout_disabled?: boolean;
            idle_timeout_seconds?: number;
            last_activity_at?: string;
            session_id?: string;
            status?: components["schemas"]["stromboli_internal_agent.Status"];
            turns_completed?: number;
        };
        /** @enum {string} */
        "stromboli_internal_agent.Status": "starting" | "idle" | "generating" | "exited";
        /** @description A content block (text, tool_use, or tool_result) */
        "stromboli_internal_history.ContentBlock": {
            /**
             * @description Tool result content (for tool_result)
             * @example file1.txt
             *     file2.txt
             */
            content?: string;
            /**
             * @description Tool use ID (for tool_use and tool_result)
             * @example toolu_01G5uAJ4YZ26yyJbXNnG2byM
             */
            id?: string;
            /** @description Tool input (for tool_use) */
            input?: {
                [key: string]: unknown;
            };
            /**
             * @description Whether tool execution errored
             * @example false
             */
            is_error?: boolean;
            /**
             * @description Tool name (for tool_use)
             * @example Bash
             */
            name?: string;
            /**
             * @description Text content (for text blocks)
             * @example I'll help you with that.
             */
            text?: string;
            /**
             * @description Tool use ID reference (for tool_result)
             * @example toolu_01G5uAJ4YZ26yyJbXNnG2byM
             */
            tool_use_id?: string;
            /**
             * @description Block type: text, tool_use, tool_result
             * @example tool_use
             */
            type?: string;
        };
        /** @description A message in the conversation history */
        "stromboli_internal_history.Message": {
            /** @description The actual message content */
            content?: components["schemas"]["stromboli_internal_history.MessageContent"];
            /**
             * @description Working directory at time of message
             * @example /workspace
             */
            cwd?: string;
            /**
             * @description Git branch at time of message
             * @example main
             */
            git_branch?: string;
            /**
             * @description Parent message UUID for threading
             * @example 92242819-b7d1-48d4-b023-6134c3e9f63a
             */
            parent_uuid?: string;
            /**
             * @description Permission mode active for this message
             * @example bypassPermissions
             */
            permission_mode?: string;
            /**
             * @description Session ID this message belongs to
             * @example c7518652-f0ea-436e-9143-327085022abd
             */
            session_id?: string;
            /**
             * @description Timestamp when the message was created
             * @example 2026-01-24T10:06:42.906Z
             */
            timestamp?: string;
            /** @description Tool use result (for tool_result messages) */
            tool_result?: components["schemas"]["stromboli_internal_history.ToolResult"];
            /**
             * @description Message type: user, assistant, queue-operation
             * @example assistant
             */
            type?: components["schemas"]["stromboli_internal_history.MessageType"];
            /**
             * @description Unique identifier for this message
             * @example 40adde19-546a-43e8-ad25-31ef4faa4112
             */
            uuid?: string;
            /**
             * @description Claude Code version
             * @example 2.1.19
             */
            version?: string;
        };
        /** @description Message content with role and content blocks */
        "stromboli_internal_history.MessageContent": {
            /** @description Content blocks (text, tool_use, tool_result) */
            content?: components["schemas"]["stromboli_internal_history.ContentBlock"][];
            /**
             * @description Message ID from API
             * @example msg_017ETE4Wk32ZXAQJp3GXP1Bo
             */
            message_id?: string;
            /**
             * @description Model used (for assistant messages)
             * @example claude-opus-4-5-20251101
             */
            model?: string;
            /**
             * @description Role: user or assistant
             * @example assistant
             */
            role?: string;
            /**
             * @description Stop reason (for assistant messages)
             * @example end_turn
             */
            stop_reason?: string;
            /** @description Token usage */
            usage?: components["schemas"]["stromboli_internal_history.Usage"];
        };
        /** @enum {string} */
        "stromboli_internal_history.MessageType": "user" | "assistant" | "queue-operation";
        /** @description Detailed result of a tool execution */
        "stromboli_internal_history.ToolResult": {
            /**
             * @description Whether execution was interrupted
             * @example false
             */
            interrupted?: boolean;
            /**
             * @description Whether result is an image
             * @example false
             */
            is_image?: boolean;
            /**
             * @description Standard error
             * @example
             */
            stderr?: string;
            /**
             * @description Standard output
             * @example file1.txt
             *     file2.txt
             */
            stdout?: string;
        };
        /** @description Token usage statistics */
        "stromboli_internal_history.Usage": {
            /** @example 336 */
            cache_creation_input_tokens?: number;
            /** @example 18121 */
            cache_read_input_tokens?: number;
            /** @example 150 */
            input_tokens?: number;
            /** @example 42 */
            output_tokens?: number;
        };
        "stromboli_internal_job.CrashInfo": {
            /** @description Exit code (if available) */
            exit_code?: number;
            /** @description Partial output captured before crash */
            partial_output?: string;
            /** @description Human-readable crash reason */
            reason?: string;
            /** @description Signal that killed the process (SIGSEGV, SIGKILL, etc.) */
            signal?: string;
            /** @description Whether the task appeared to complete before crashing */
            task_completed?: boolean;
        };
        /** @enum {string} */
        "stromboli_internal_job.Status": "pending" | "running" | "completed" | "failed" | "crashed" | "cancelled";
        "stromboli_internal_job.Usage": {
            cache_creation_input_tokens?: number;
            cache_read_input_tokens?: number;
            /**
             * @description EstimatedCostUSD is best-effort: tokens × Anthropic's published
             *     per-1M rates, summed across all four buckets. Zero when the model
             *     isn't recognized or no usage was reported.
             */
            estimated_cost_usd?: number;
            input_tokens?: number;
            /**
             * @description Model identifier reported by Claude (e.g. "claude-opus-4-7-20260101").
             *     Empty when the model is unknown — cost estimation skipped in that case.
             */
            model?: string;
            output_tokens?: number;
            total_tokens?: number;
        };
        /** @description All available Claude CLI options for headless execution */
        "stromboli_internal_types.ClaudeOptions": {
            /** @description Additional directories for tool access */
            add_dirs?: string[];
            /**
             * @description Agent for current session
             * @example reviewer
             */
            agent?: string;
            /** @description Custom agents definition (JSON object) */
            agents?: {
                [key: string]: unknown;
            };
            /**
             * @description Enable bypass as an option without enabling by default
             * @example false
             */
            allow_dangerously_skip_permissions?: boolean;
            /**
             * @description Allowed tools with patterns (e.g., "Bash(git:*)")
             * @example [
             *       "Bash(git:*)",
             *       "Read"
             *     ]
             */
            allowed_tools?: string[];
            /**
             * @description Append to default system prompt
             * @example Focus on security best practices
             */
            append_system_prompt?: string;
            /**
             * @description Bedrock service tier when running against AWS Bedrock as the model
             *     backend. Valid values: "default", "flex", "priority". Translates to
             *     ANTHROPIC_BEDROCK_SERVICE_TIER. Ignored when not on Bedrock. (#77)
             * @example priority
             */
            bedrock_service_tier?: string;
            /** @description Beta headers for API requests */
            betas?: string[];
            /**
             * @description Continue most recent conversation in workspace (ignores session_id)
             * @example false
             */
            continue?: boolean;
            /**
             * @description Bypass all permission checks (use in sandboxed environments only)
             * @example true
             */
            dangerously_skip_permissions?: boolean;
            /**
             * @description Debug mode with optional category filter
             * @example api,hooks
             */
            debug?: string;
            /**
             * @description Disable all slash commands/skills
             * @example false
             */
            disable_slash_commands?: boolean;
            /**
             * @description Denied tools
             * @example [
             *       "Write"
             *     ]
             */
            disallowed_tools?: string[];
            /**
             * @description Effort level for thinking/agentic complexity. Valid values per the
             *     upstream CLI reference: low, medium, high, xhigh, max. The accepted
             *     subset depends on the model — Claude rejects unsupported levels at
             *     runtime, so Stromboli does not gate on an enum here.
             * @example high
             */
            effort?: string;
            /**
             * @description Opt into Claude Code's native PowerShell tool on Windows agent hosts.
             *     Translates to CLAUDE_CODE_USE_POWERSHELL_TOOL=1. No-op on non-Windows
             *     containers. (#81)
             * @example false
             */
            enable_powershell_tool?: boolean;
            /**
             * @description Fallback model when default is overloaded
             * @example haiku
             */
            fallback_model?: string;
            /** @description File resources (format: file_id:path) */
            files?: string[];
            /**
             * @description Create new session ID when resuming
             * @example false
             */
            fork_session?: boolean;
            /**
             * @description Include partial message chunks (stream-json only)
             * @example false
             */
            include_partial_messages?: boolean;
            /**
             * @description Input format: text, stream-json
             * @example text
             */
            input_format?: string;
            /**
             * @description JSON Schema for structured output validation
             * @example {"type":"object"}
             */
            json_schema?: string;
            /**
             * @description Maximum dollar amount for API calls (pointer to distinguish 0 from unset)
             * @example 5
             */
            max_budget_usd?: number;
            /**
             * @description Maximum number of agentic turns (0 = unlimited, nil = use CLI default)
             * @example 30
             */
            max_turns?: number;
            /** @description MCP server config files or JSON strings */
            mcp_configs?: string[];
            /**
             * @description Model alias (sonnet, opus, haiku) or full name
             * @example sonnet
             */
            model?: string;
            /**
             * @description Don't save session to disk
             * @example false
             */
            no_persistence?: boolean;
            /**
             * @description Output format: text, json, stream-json
             * @example json
             */
            output_format?: string;
            /**
             * @description Permission mode: acceptEdits, bypassPermissions, default, delegate, dontAsk, plan
             * @example bypassPermissions
             */
            permission_mode?: string;
            /** @description Plugin directories */
            plugin_dirs?: string[];
            /**
             * @description Prompt cache TTL. "" leaves Claude's default; "5m" sets
             *     FORCE_PROMPT_CACHING_5M=1; "1h" sets ENABLE_PROMPT_CACHING_1H=1.
             *     Useful for long-lived agent loops where the same context is re-used
             *     across many turns. (#76)
             * @example 1h
             */
            prompt_caching_ttl?: string;
            /**
             * @description Re-emit user messages on stdout
             * @example false
             */
            replay_user_messages?: boolean;
            /**
             * @description Resume an existing session (requires session_id)
             * @example true
             */
            resume?: boolean;
            /**
             * @description Session ID (UUID) - used for both new and resumed sessions
             * @example 550e8400-e29b-41d4-a716-446655440000
             */
            session_id?: string;
            /**
             * @description Setting sources to load: user, project, local
             * @example [
             *       "user",
             *       "project"
             *     ]
             */
            setting_sources?: string[];
            /** @description Path to settings JSON file or JSON string */
            settings?: string;
            /**
             * @description Only use MCP servers from mcp_configs
             * @example false
             */
            strict_mcp_config?: boolean;
            /**
             * @description Replace default system prompt
             * @example You are a senior Go developer
             */
            system_prompt?: string;
            /**
             * @description Built-in tools ("", "default", or specific names)
             * @example [
             *       "Bash",
             *       "Read",
             *       "Edit"
             *     ]
             */
            tools?: string[];
            /**
             * @description Enable verbose mode
             * @example false
             */
            verbose?: boolean;
        };
        /** @description Runtime environment configuration (single container or compose) */
        "stromboli_internal_types.EnvironmentConfig": {
            /**
             * @description Optional build timeout override for compose (e.g., "15m")
             *     If not specified, uses server default (10m)
             * @example 15m
             */
            build_timeout?: string;
            /**
             * @description Path to compose file (required when type="compose")
             *     Must be an absolute path ending in .yml or .yaml
             * @example /home/user/project/docker-compose.yml
             */
            path?: string;
            /**
             * @description Service name where Claude will run (required when type="compose")
             * @example dev
             */
            service?: string;
            /**
             * @description Type of environment: "" (default single container) or "compose"
             * @example compose
             */
            type?: string;
        };
        /** @description Commands to run at specific container lifecycle stages */
        "stromboli_internal_types.LifecycleHooks": {
            /**
             * @description HooksTimeout is the maximum duration for all hooks combined (e.g., "5m", "30s").
             *     If not specified, hooks run with the container's timeout.
             *     This is useful to prevent long-running hooks from blocking the main command.
             * @example 5m
             */
            hooks_timeout?: string;
            /**
             * @description OnCreateCommand runs after container creation, before Claude starts (first run only).
             *     Each element is a complete shell command string (devcontainer-style).
             *     Example: ["apt-get update && apt-get install -y git", "pip install -r requirements.txt"]
             * @example [
             *       "pip install -r requirements.txt"
             *     ]
             */
            on_create_command?: string[];
            /**
             * @description PostCreate runs after OnCreateCommand completes (first run only).
             *     Each element is a complete shell command string (devcontainer-style).
             * @example [
             *       "npm run setup"
             *     ]
             */
            post_create?: string[];
            /**
             * @description PostStart runs after container starts (every run, including continues).
             *     Each element is a complete shell command string (devcontainer-style).
             * @example [
             *       "redis-server --daemonize yes"
             *     ]
             */
            post_start?: string[];
        };
        /** @description Podman container mount configuration */
        "stromboli_internal_types.PodmanOptions": {
            /**
             * @description CPU shares (relative weight, default 1024; pointer to distinguish 0 from unset)
             * @example 512
             */
            cpu_shares?: number;
            /**
             * @description CPU limit (e.g., "0.5", "2")
             * @example 1
             */
            cpus?: string;
            /**
             * @description Environment specifies a compose-based multi-service environment.
             *     When set, the agent runs inside the specified service of the compose stack
             *     instead of a standalone container.
             */
            environment?: components["schemas"]["stromboli_internal_types.EnvironmentConfig"];
            /**
             * @description Container image override (must match allowed patterns)
             * @example python:3.12
             */
            image?: string;
            /** @description Lifecycle hooks for running commands at specific container events */
            lifecycle?: components["schemas"]["stromboli_internal_types.LifecycleHooks"];
            /**
             * @description Memory limit (e.g., "512m", "1g")
             * @example 512m
             */
            memory?: string;
            /**
             * @description Secrets to inject as environment variables (env_var_name -> podman_secret_name)
             *     The Podman secret must exist beforehand (created via `podman secret create`)
             *     Example: {"GH_TOKEN": "github-token"} mounts secret "github-token" as env var GH_TOKEN
             */
            secrets_env?: {
                [key: string]: string;
            };
            /**
             * @description Container timeout (e.g., "5m", "1h", "30s")
             * @example 5m
             */
            timeout?: string;
            /**
             * @description Volume mounts (host:container or host:container:options format)
             * @example [
             *       "/data:/data:ro"
             *     ]
             */
            volumes?: string[];
        };
    };
    responses: never;
    parameters: never;
    requestBodies: {
        /** @description Run request */
        "internal_api.RunRequest": {
            content: {
                "application/json": components["schemas"]["internal_api.RunRequest"];
            };
        };
    };
    headers: never;
    pathItems: never;
};
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
