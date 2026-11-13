import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { createAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const { email, password } = await request.json()
  const savedCredentials = await prisma.adminCredential.findUnique({ where: { id: 1 } })
  const allowedEmail = savedCredentials?.email ?? process.env.ADMIN_EMAIL
  const configuredPassword = process.env.ADMIN_PASSWORD
  if (!allowedEmail || (!savedCredentials && !configuredPassword)) return NextResponse.json({ error: 'Admin credentials are not configured.' }, { status: 503 })
  const passwordMatches = savedCredentials
    ? await bcrypt.compare(password ?? '', savedCredentials.passwordHash)
    : configuredPassword!.startsWith('$2') ? await bcrypt.compare(password ?? '', configuredPassword!) : password === configuredPassword
  if (email?.toLowerCase() !== allowedEmail.toLowerCase() || !passwordMatches) return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
  await createAdminSession(allowedEmail)
  return NextResponse.json({ ok: true })
}
