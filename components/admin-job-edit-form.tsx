'use client'

import { useState } from 'react'

type JobDraft = { id: string; title: string; responsibilities: string; qualifications: string; closesOn: string; publishOn: string }

function localInputValues(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return { date: '', dateTime: '' }
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'Africa/Nairobi', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(date).map((part) => [part.type, part.value]))
  return { date: `${parts.year}-${parts.month}-${parts.day}`, dateTime: `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}` }
}

export function AdminJobEditForm({ job }: { job: { id: string; title: string; responsibilities: string; qualifications: string; closesOn: string | null; publishOn: string | null } }) {
  const expiry = job.closesOn ? localInputValues(job.closesOn).date : ''
  const publish = job.publishOn ? localInputValues(job.publishOn).dateTime : ''
  const [draft, setDraft] = useState<JobDraft>({ id: job.id, title: job.title, responsibilities: job.responsibilities, qualifications: job.qualifications, closesOn: expiry, publishOn: publish })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const update = (key: keyof JobDraft, value: string) => setDraft((current) => ({ ...current, [key]: value }))
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true); setMessage('')
    try {
      const response = await fetch(`/api/jobs/${draft.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: draft.title, responsibilities: draft.responsibilities, qualifications: draft.qualifications, closesOn: draft.closesOn, publishOn: draft.publishOn }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Unable to update the job.')
      setMessage('Job details saved.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to update the job.')
    } finally { setSaving(false) }
  }

  return <form className="job-admin-edit-form" onSubmit={submit}>
    <h2>Edit job posting</h2>
    <label className="admin-field"><span>Job title</span><input required value={draft.title} onChange={(event) => update('title', event.target.value)} /></label>
    <label className="admin-field"><span>Roles and responsibilities</span><textarea required value={draft.responsibilities} onChange={(event) => update('responsibilities', event.target.value)} /></label>
    <label className="admin-field"><span>Requirements and qualifications</span><textarea value={draft.qualifications} onChange={(event) => update('qualifications', event.target.value)} /></label>
    <div className="admin-grid two"><label className="admin-field"><span>Publish date and time</span><input type="datetime-local" value={draft.publishOn} onChange={(event) => update('publishOn', event.target.value)} /></label><label className="admin-field"><span>Expiry date (required)</span><input type="date" required value={draft.closesOn} onChange={(event) => update('closesOn', event.target.value)} /></label></div>
    <button className="admin-save" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save job changes'}</button>
    {message && <p className={message === 'Job details saved.' ? 'job-edit-success' : 'admin-error'} role="status">{message}</p>}
  </form>
}
