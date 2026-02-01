import { loader } from 'fumadocs-core/source'
import { createMDXSource } from 'fumadocs-mdx'
import type { InferPageType } from 'fumadocs-core/source'
import { docs, meta } from '../.source'

export const source = loader({
  baseUrl: '/docs',
  source: createMDXSource(docs, meta),
})

export type Page = InferPageType<typeof source>
