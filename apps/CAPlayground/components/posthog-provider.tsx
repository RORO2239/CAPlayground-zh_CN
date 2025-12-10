'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
      const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST
      
      if (process.env.NODE_ENV === 'development') {
        console.log('PostHog disabled in development')
        return
      }
      
      if (!posthogKey || !posthogHost) {
        return
      }
      
      try {
        posthog.init(posthogKey, {
          api_host: posthogHost,
          defaults: '2025-05-24',
          capture_exceptions: true,
          debug: false,
          loaded: (posthog) => {
            console.log('PostHog loaded')
          }
        })
      } catch (error) {
        console.warn('Failed to initialize PostHog:', error)
      }
    }
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
