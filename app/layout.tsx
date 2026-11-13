import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ContentProvider } from '@/components/content-provider'
import { logoUrl } from '@/lib/site-data'

export const metadata: Metadata = { title: { default: 'Stima Technics | Electrical Engineering & Contracting', template: '%s | Stima Technics' }, description: 'Stima Technics delivers dependable electrical contracting, engineering, solar, security, and maintenance solutions across Kenya.', generator: 'Stima Technics', icons: { icon: [{ url: logoUrl, type: 'image/png' }], apple: [{ url: logoUrl, type: 'image/png' }] } }
export const viewport: Viewport = { colorScheme: 'light', themeColor: '#0759a5', width: 'device-width', initialScale: 1 }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" className="bg-background"><body><ContentProvider>{children}</ContentProvider>{process.env.NODE_ENV === 'production' && <Analytics />}</body></html> }
