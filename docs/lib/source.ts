import { docs, meta } from '@/.source/server'
import { loader } from 'fumadocs-core/source'
import type { InferPageType } from 'fumadocs-core/source'
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server'

export const source = loader(toFumadocsSource(docs, meta), {
  baseUrl: '/docs',
})

export type Page = InferPageType<typeof source>
