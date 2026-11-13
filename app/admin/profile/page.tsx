'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function AdminProfilePage() {
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetch('/api/auth/profile').then(async (response) => { if (response.ok) setEmail((await response.json()).email) }).catch(() => setError('Unable to load your profile.')) }, [])

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(''); setMessage('')
    if (newPassword && newPassword !== confirmPassword) { setError('The new passwords do not match.'); return }
    setSaving(true)
    try {
      const response = await fetch('/api/auth/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, currentPassword, newPassword }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Unable to update your profile.')
      setEmail(result.email); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); setMessage('Your login details have been updated.')
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to update your profile.') }
    finally { setSaving(false) }
  }

  return <main className="admin-profile-page"><div className="admin-profile-shell"><Link href="/admin" className="admin-profile-back">← Back to admin</Link><header><p className="eyebrow">Account settings</p><h1>Admin profile</h1><p>Update the email and password used to sign in.</p></header><form className="admin-profile-card" onSubmit={submit}><label className="admin-field"><span>Admin email</span><input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} /></label><label className="admin-field"><span>Current password</span><input type="password" autoComplete="current-password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></label><div className="admin-profile-divider"><strong>Change password</strong><span>Leave these fields empty to keep your current password.</span></div><label className="admin-field"><span>New password</span><input type="password" autoComplete="new-password" minLength={12} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /><small>Use at least 12 characters.</small></label><label className="admin-field"><span>Confirm new password</span><input type="password" autoComplete="new-password" minLength={12} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></label>{error && <p className="admin-error" role="alert">{error}</p>}{message && <p className="job-edit-success" role="status">{message}</p>}<button className="admin-save" disabled={saving}>{saving ? 'Saving…' : 'Save login details'}</button></form></div></main>
}
