/**
 * Auto-generated API client for Stromboli
 * DO NOT EDIT - Run `make generate` to regenerate
 */

import createClient from 'openapi-fetch'
import type { paths } from './types'

export type StromboliApiClient = ReturnType<typeof createClient<paths>>

export function createStromboliClient(baseUrl: string): StromboliApiClient {
  return createClient<paths>({ baseUrl })
}
