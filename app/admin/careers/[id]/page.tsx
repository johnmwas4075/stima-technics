import Link from 'next/link'
import { ArrowLeft, CalendarDays, Clock3, PenLine } from 'lucide-react'
import { notFound } from 'next/navigation'
import { AdminJobEditForm } from '@/components/admin-job-edit-form'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function displayDate(value: Date | null, includeTime = false) {
  if (!value) return 'Not set'
  return new Intl.DateTimeFormat('en-KE', { dateStyle: 'medium', ...(includeTime ? { timeStyle: 'short' as const } : {}), timeZone: 'Africa/Nairobi' }).format(value)
}

export default async function AdminJobDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const position = await prisma.jobPosition.findUnique({ where: { id }, select: { id: true, title: true, responsibilities: true, qualifications: true, createdAt: true, postedOn: true, publishOn: true, closesOn: true, isOpen: true } })
  if (!position) notFound()
  const scheduled = Boolean(position.publishOn && position.publishOn > new Date())
  const expired = Boolean(position.closesOn && position.closesOn < new Date())

  return <main className="job-admin-page"><div className="job-admin-shell">
    <Link className="job-admin-back" href="/admin?tab=careers"><ArrowLeft size={16}/> Back to career postings</Link>
    <header className="job-admin-heading"><div><p className="eyebrow">Admin · Careers</p><h1>{position.title}</h1></div><span className={`job-admin-status${scheduled ? ' scheduled' : ''}`}>{scheduled ? 'Scheduled' : position.isOpen ? 'Posted' : 'Closed'}</span></header>
    <section className="job-admin-meta"><div><PenLine size={17}/><span><small>Written</small><strong>{displayDate(position.createdAt)}</strong></span></div><div><CalendarDays size={17}/><span><small>Posted / publishes</small><strong>{displayDate(position.publishOn ?? position.postedOn, Boolean(position.publishOn))}</strong></span></div><div><Clock3 size={17}/><span><small>Expiry</small><strong>{displayDate(position.closesOn)}</strong></span></div></section>
    <div className="job-admin-sections"><section><p className="eyebrow">Role details</p><h2>Roles and responsibilities</h2><p>{position.responsibilities || 'No responsibilities have been added.'}</p></section><section><p className="eyebrow">Candidate requirements</p><h2>Qualifications</h2><p>{position.qualifications || 'No qualifications have been added.'}</p></section></div>
    {expired ? <p className="job-expired-note">This job has expired, so its details can no longer be edited.</p> : <AdminJobEditForm job={{ id: position.id, title: position.title, responsibilities: position.responsibilities, qualifications: position.qualifications, closesOn: position.closesOn?.toISOString() ?? null, publishOn: position.publishOn?.toISOString() ?? null }} />}
  </div></main>
}
