import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

type QueryResult = { results?: unknown[][] }

async function runQuery(host: string, projectId: string, apiKey: string, query: string) {
  const response = await fetch(`${host.replace(/\/$/, '')}/api/projects/${encodeURIComponent(projectId)}/query/`, {
    method: 'POST', cache: 'no-store',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: { kind: 'HogQLQuery', query } }),
  })
  if (!response.ok) throw new Error('PostHog could not return analytics. Check the project ID, host, and query read permission on the personal API key.')
  return response.json() as Promise<QueryResult>
}

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const apiKey = process.env.POSTHOG_PERSONAL_API_KEY
  const projectId = process.env.POSTHOG_PROJECT_ID
  if (!apiKey || !projectId) return NextResponse.json({ configured: false })

  const host = process.env.POSTHOG_HOST || 'https://us.posthog.com'
  try {
    const [totals, pages] = await Promise.all([
      runQuery(host, projectId, apiKey, "SELECT count() AS pageviews, count(DISTINCT person_id) AS visitors, countIf(timestamp >= now() - INTERVAL 7 DAY) AS pageviews_7d FROM events WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 30 DAY"),
      runQuery(host, projectId, apiKey, "SELECT properties.$current_url AS url, count() AS views FROM events WHERE event = '$pageview' AND timestamp >= now() - INTERVAL 30 DAY GROUP BY url ORDER BY views DESC LIMIT 8"),
    ])
    const [pageviews = 0, visitors = 0, pageviews7d = 0] = totals.results?.[0] ?? []
    return NextResponse.json({ configured: true, period: 'Last 30 days', pageviews, visitors, pageviews7d, pages: (pages.results ?? []).map(([url, views]) => ({ url: String(url ?? ''), views: Number(views ?? 0) })) })
  } catch (error) {
    return NextResponse.json({ configured: true, error: error instanceof Error ? error.message : 'Unable to load analytics.' }, { status: 502 })
  }
}
