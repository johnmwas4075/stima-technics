'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { SiteContentData } from '@/lib/content'

const ContentContext = createContext<SiteContentData>({})
export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContentData>({})
  useEffect(() => { fetch('/api/content').then((response) => response.ok ? response.json() : null).then((result) => result && setContent(result.data)).catch(() => undefined) }, [])
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
}
export const useSiteContent = () => useContext(ContentContext)
