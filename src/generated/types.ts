/**
 * Auto-generated types from OpenAPI spec
 * DO NOT EDIT - Run `make generate` to regenerate
 *
 * This is a placeholder file. Run `make generate` to fetch the actual types
 * from the Stromboli API OpenAPI specification.
 */

// Placeholder types - will be replaced by generated code
export interface paths {
  '/health': {
    get: {
      responses: {
        200: {
          content: {
            'application/json': {
              status?: string
              version?: string
              podman?: boolean
              claude?: boolean
            }
          }
        }
      }
    }
  }
  '/run': {
    post: {
      requestBody: {
        content: {
          'application/json': components['schemas']['RunRequest']
        }
      }
      responses: {
        200: {
          content: {
            'application/json': components['schemas']['RunResponse']
          }
        }
      }
    }
  }
  '/run/async': {
    post: {
      requestBody: {
        content: {
          'application/json': components['schemas']['RunRequest']
        }
      }
      responses: {
        200: {
          content: {
            'application/json': {
              id?: string
            }
          }
        }
      }
    }
  }
  '/jobs': {
    get: {
      responses: {
        200: {
          content: {
            'application/json': {
              jobs?: components['schemas']['Job'][]
            }
          }
        }
      }
    }
  }
  '/jobs/{id}': {
    get: {
      parameters: {
        path: {
          id: string
        }
      }
      responses: {
        200: {
          content: {
            'application/json': components['schemas']['Job']
          }
        }
      }
    }
    delete: {
      parameters: {
        path: {
          id: string
        }
      }
      responses: {
        200: {
          content: {
            'application/json': unknown
          }
        }
      }
    }
  }
  '/sessions': {
    get: {
      responses: {
        200: {
          content: {
            'application/json': {
              sessions?: Array<{ id?: string } | string>
            }
          }
        }
      }
    }
  }
  '/sessions/{id}': {
    delete: {
      parameters: {
        path: {
          id: string
        }
      }
      responses: {
        200: {
          content: {
            'application/json': unknown
          }
        }
      }
    }
  }
  '/sessions/{id}/messages': {
    get: {
      parameters: {
        path: {
          id: string
        }
        query?: {
          offset?: number
          limit?: number
        }
      }
      responses: {
        200: {
          content: {
            'application/json': {
              messages?: unknown[]
            }
          }
        }
      }
    }
  }
}

export interface components {
  schemas: {
    RunRequest: {
      prompt: string
      model?: 'sonnet' | 'opus' | 'haiku'
      workspace?: string
      session_id?: string
      resume?: boolean
      timeout?: string
      memory?: string
      max_budget_usd?: number
      system_prompt?: string
      append_system_prompt?: string
      allowed_tools?: string[]
      disallowed_tools?: string[]
    }
    RunResponse: {
      result?: string
      session_id?: string
    }
    Job: {
      id?: string
      status?: string
      result?: string
      error?: string
      session_id?: string
    }
  }
}
