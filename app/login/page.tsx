'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError('')
    const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) })
    if (response.ok) window.location.assign('/admin'); else { const result = await response.json().catch(() => null); setError(result?.error || 'Unable to sign in. Please try again.') }
    setLoading(false)
  }
  return <main className="login-page"><form className="login-card" onSubmit={submit}><p className="eyebrow">Stima Technics</p><h1>Admin sign in</h1><label>Email<input name="email" type="email" required /></label><label>Password<input name="password" type="password" required /></label>{error && <p className="admin-error">{error}</p>}<button className="admin-save" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button></form></main>
}
