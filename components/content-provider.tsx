'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { SiteContentData } from '@/lib/content'

const ContentContext = createContext<SiteContentData>({})
const RefreshContentContext = createContext<() => Promise<void>>(async () => undefined)
export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContentData>({})
  const refresh = async () => {
    const response = await fetch('/api/content', { cache: 'no-store' })
    if (!response.ok) throw new Error('Unable to load saved site content.')
    const result = await response.json()
    setContent(result.data ?? {})
  }
  useEffect(() => { refresh().catch(() => undefined) }, [])
  return <RefreshContentContext.Provider value={refresh}><ContentContext.Provider value={content}>{children}</ContentContext.Provider></RefreshContentContext.Provider>
}
export const useSiteContent = () => useContext(ContentContext)
export const useRefreshSiteContent = () => useContext(RefreshContentContext)
