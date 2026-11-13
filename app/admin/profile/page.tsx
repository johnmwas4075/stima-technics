'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function AdminProfilePage() {
  const [currentEmail, setCurrentEmail] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/auth/profile').then(async (response) => {
      if (!response.ok) throw new Error('Unable to load your profile.')
      const result = await response.json()
      setCurrentEmail(result.email)
      setNewEmail(result.email)
    }).catch(() => setError('Unable to load your profile.'))
  }, [])

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(''); setMessage('')
    if (newEmail.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) { setError('The new email addresses do not match.'); return }
    if (newPassword !== confirmPassword) { setError('The new passwords do not match.'); return }
    setSaving(true)
    try {
      const response = await fetch('/api/auth/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: newEmail, confirmEmail, currentPassword, newPassword, confirmPassword }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Unable to update your profile.')
      setCurrentEmail(result.email); setNewEmail(result.email); setConfirmEmail(''); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); setMessage('Your login details have been updated.')
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to update your profile.') }
    finally { setSaving(false) }
  }

  return <main className="admin-page"><aside className="admin-sidebar"><a className="admin-brand" href="/"><strong>STIMA</strong><span>ADMIN PANEL</span></a><nav>
    <Link className="admin-profile-nav-link" href="/admin">Content management</Link>
    <Link className="admin-profile-nav-link" href="/admin/analytics">Analytics</Link>
    <Link className="admin-profile-nav-link active" href="/admin/profile">Profile &amp; login details</Link>
  </nav><a className="admin-view-site" href="/" target="_blank" rel="noreferrer">View public website ↗</a></aside>
    <section className="admin-content"><div className="admin-profile-page"><div className="admin-profile-shell"><header><p className="eyebrow">Account settings</p><h1>Admin profile</h1><p>Update the email and password used to sign in.</p></header><form className="admin-profile-card" onSubmit={submit}>
      <label className="admin-field"><span>Current email</span><input type="email" autoComplete="username" readOnly value={currentEmail} /></label>
      <label className="admin-field"><span>Change email</span><input type="email" autoComplete="off" required value={newEmail} onChange={(event) => setNewEmail(event.target.value)} /></label>
      <label className="admin-field"><span>Confirm new email</span><input type="email" autoComplete="off" required value={confirmEmail} onChange={(event) => setConfirmEmail(event.target.value)} /></label>
      <div className="admin-profile-divider"><strong>Change password</strong><span>Leave both new password fields blank to keep your current password.</span></div>
      <label className="admin-field"><span>Current password</span><input type="password" autoComplete="current-password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></label>
      <label className="admin-field"><span>New password</span><input type="password" autoComplete="new-password" minLength={12} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /><small>Use at least 12 characters.</small></label>
      <label className="admin-field"><span>Confirm new password</span><input type="password" autoComplete="new-password" minLength={12} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></label>
      {error && <p className="admin-error" role="alert">{error}</p>}{message && <p className="job-edit-success" role="status">{message}</p>}<button className="admin-save" disabled={saving}>{saving ? 'Saving…' : 'Save login details'}</button>
    </form></div></div></section>
  </main>
}
