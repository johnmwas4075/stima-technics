import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { createAdminSession } from '@/lib/auth'

export async function POST(request: Request) {
  const { email, password } = await request.json()
  const allowedEmail = process.env.ADMIN_EMAIL
  const configuredPassword = process.env.ADMIN_PASSWORD
  if (!allowedEmail || !configuredPassword) return NextResponse.json({ error: 'Admin credentials are not configured.' }, { status: 503 })
  const passwordMatches = configuredPassword.startsWith('$2') ? await bcrypt.compare(password ?? '', configuredPassword) : password === configuredPassword
  if (email?.toLowerCase() !== allowedEmail.toLowerCase() || !passwordMatches) return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
  await createAdminSession(allowedEmail)
  return NextResponse.json({ ok: true })
}
