import './global.css'
import { RootProvider } from 'fumadocs-ui/provider'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Stromboli TypeScript SDK',
  description: 'Official TypeScript SDK for Stromboli - Container orchestration for Claude Code agents',
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  )
}
