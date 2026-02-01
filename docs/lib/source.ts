import { loader } from 'fumadocs-core/source'
import { docs, meta } from 'fumadocs-mdx:collections/server'
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server'

export const source = loader(toFumadocsSource(docs, meta), {
  baseUrl: '/docs',
})
