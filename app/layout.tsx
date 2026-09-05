import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = { title: { default: 'Stima Technics | Electrical Engineering & Contracting', template: '%s | Stima Technics' }, description: 'Stima Technics delivers dependable electrical contracting, engineering, solar, security, and maintenance solutions across Kenya.', generator: 'Stima Technics' }
export const viewport: Viewport = { colorScheme: 'light', themeColor: '#0759a5', width: 'device-width', initialScale: 1 }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" className="bg-background"><body>{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html> }
