export type paths = {
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
                        "application/json": {
                            [key: string]: unknown;
                        };
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
         * @description Returns all available Podman secrets that can be injected into agents
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
                        "application/json": components["schemas"]["internal_api.SecretsListResponse"];
                    };
                };
                /** @description Internal Server Error */
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
        post?: never;
        delete?: never;
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
             * @description Claude's output (when successful)
             * @example Here is my analysis...
             */
            output?: string;
            /**
             * @description Session ID for conversation continuation
             * @example sess-abc123def456
             */
            session_id?: string;
            /**
             * @description Execution status: completed, error
             * @example completed
             */
            status?: string;
        };
        /** @description List of available secrets that can be injected into agents */
        "internal_api.SecretsListResponse": {
            error?: string;
            /**
             * @example [
             *       "github-token",
             *       "gitlab-token"
             *     ]
             */
            secrets?: string[];
        };
        /** @description Result of session destruction */
        "internal_api.SessionDestroyResponse": {
            error?: string;
            /** @example sess-abc123 */
            session_id?: string;
            /** @example true */
            success?: boolean;
        };
        /** @description List of existing sessions */
        "internal_api.SessionListResponse": {
            error?: string;
            /**
             * @example [
             *       "sess-abc123",
             *       "sess-def456"
             *     ]
             */
            sessions?: string[];
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
             * @description Maximum dollar amount for API calls
             * @example 5
             */
            max_budget_usd?: number;
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
        /** @description Podman container mount configuration */
        "stromboli_internal_types.PodmanOptions": {
            /**
             * @description CPU shares (relative weight, default 1024)
             * @example 512
             */
            cpu_shares?: number;
            /**
             * @description CPU limit (e.g., "0.5", "2")
             * @example 1
             */
            cpus?: string;
            /**
             * @description Container image override (must match allowed patterns)
             * @example python:3.12
             */
            image?: string;
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
