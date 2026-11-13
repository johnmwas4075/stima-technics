'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Analytics = { configured: boolean; period?: string; pageviews?: number; visitors?: number; pageviews7d?: number; pages?: { url: string; views: number }[]; error?: string }

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/analytics').then((response) => response.json()).then(setData).catch(() => setData({ configured: true, error: 'Could not connect to PostHog.' })).finally(() => setLoading(false))
  }, [])

  return <main className="admin-page"><aside className="admin-sidebar"><a className="admin-brand" href="/"><strong>STIMA</strong><span>ADMIN PANEL</span></a><nav>
    <Link className="admin-profile-nav-link" href="/admin">Content management</Link>
    <Link className="admin-profile-nav-link active" href="/admin/analytics">Analytics</Link>
    <Link className="admin-profile-nav-link" href="/admin/profile">Profile &amp; login details</Link>
  </nav><a className="admin-view-site" href="/" target="_blank" rel="noreferrer">View public website ↗</a></aside>
    <section className="admin-content"><div className="admin-profile-page"><div className="admin-profile-shell admin-analytics-shell"><header><p className="eyebrow">Website performance</p><h1>Analytics</h1><p>Visitor activity recorded by PostHog.</p></header>
      {loading ? <p className="admin-empty">Loading analytics…</p> : !data?.configured ? <div className="admin-card"><h2>Connect PostHog</h2><p>Set <code>NEXT_PUBLIC_POSTHOG_KEY</code> and optionally <code>NEXT_PUBLIC_POSTHOG_HOST</code> to start collecting page views. For this dashboard, also set <code>POSTHOG_PERSONAL_API_KEY</code> and <code>POSTHOG_PROJECT_ID</code>. Restart the app after updating environment variables.</p></div> : data.error ? <p className="admin-error" role="alert">{data.error}</p> : <>
        <p className="admin-analytics-period">{data.period}</p><div className="admin-analytics-stats"><article><span>Page views</span><strong>{Number(data.pageviews || 0).toLocaleString()}</strong></article><article><span>Unique visitors</span><strong>{Number(data.visitors || 0).toLocaleString()}</strong></article><article><span>Page views · last 7 days</span><strong>{Number(data.pageviews7d || 0).toLocaleString()}</strong></article></div>
        <section className="admin-card admin-analytics-pages"><h2>Most visited pages</h2>{data.pages?.length ? <div>{data.pages.map((page, index) => <article key={`${page.url}-${index}`}><span title={page.url}>{page.url || '(unknown page)'}</span><strong>{page.views.toLocaleString()}</strong></article>)}</div> : <p className="admin-empty">No page views have been recorded in this period yet.</p>}</section>
      </>}
    </div></div></section>
  </main>
}
