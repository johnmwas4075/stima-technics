import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const saved = await prisma.adminCredential.findUnique({ where: { id: 1 } })
  return NextResponse.json({ email: saved?.email ?? session.email })
}

export async function PUT(request: Request) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const confirmEmail = typeof body.confirmEmail === 'string' ? body.confirmEmail.trim().toLowerCase() : ''
  const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : ''
  const newPassword = typeof body.newPassword === 'string' ? body.newPassword : ''
  const confirmPassword = typeof body.confirmPassword === 'string' ? body.confirmPassword : ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
  if (email !== confirmEmail) return NextResponse.json({ error: 'The new email addresses do not match.' }, { status: 400 })
  if (!currentPassword) return NextResponse.json({ error: 'Enter your current password to save profile changes.' }, { status: 400 })
  if (newPassword && newPassword.length < 12) return NextResponse.json({ error: 'A new password must be at least 12 characters.' }, { status: 400 })
  if (newPassword !== confirmPassword) return NextResponse.json({ error: 'The new passwords do not match.' }, { status: 400 })

  const saved = await prisma.adminCredential.findUnique({ where: { id: 1 } })
  const environmentPassword = process.env.ADMIN_PASSWORD
  const currentPasswordMatches = saved
    ? await bcrypt.compare(currentPassword, saved.passwordHash)
    : environmentPassword
      ? environmentPassword.startsWith('$2') ? await bcrypt.compare(currentPassword, environmentPassword) : currentPassword === environmentPassword
      : false
  if (!currentPasswordMatches) return NextResponse.json({ error: 'Your current password is incorrect.' }, { status: 401 })

  const passwordHash = newPassword ? await bcrypt.hash(newPassword, 12) : saved?.passwordHash ?? await bcrypt.hash(currentPassword, 12)
  try {
    await prisma.adminCredential.upsert({ where: { id: 1 }, create: { id: 1, email, passwordHash }, update: { email, passwordHash } })
    await prisma.$transaction([
      prisma.adminSession.update({ where: { id: session.id }, data: { email } }),
      prisma.adminSession.deleteMany({ where: { id: { not: session.id } } }),
    ])
  } catch {
    return NextResponse.json({ error: 'Unable to save these login details. That email may already be in use.' }, { status: 409 })
  }
  return NextResponse.json({ ok: true, email })
}
