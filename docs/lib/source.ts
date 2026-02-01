import { loader } from 'fumadocs-core/source'
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server'
import type { InferPageType } from 'fumadocs-core/source'
import { docs, meta } from '@/.source/server'

export const source = loader(toFumadocsSource(docs, meta), {
  baseUrl: '/docs',
})

export type Page = InferPageType<typeof source>
