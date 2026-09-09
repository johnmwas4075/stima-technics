import { createHmac, randomBytes } from 'crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

const cookieName = 'stima_admin_session'
const sessionLifetimeMs = 1000 * 60 * 60 * 24 * 7
const hash = (value: string) => {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not configured.')
  return createHmac('sha256', secret).update(value).digest('hex')
}

export async function createAdminSession(email: string) {
  const token = randomBytes(32).toString('base64url')
  const expiresAt = new Date(Date.now() + sessionLifetimeMs)
  await prisma.adminSession.create({ data: { email, tokenHash: hash(token), expiresAt } })
  const store = await cookies()
  store.set(cookieName, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', expires: expiresAt, path: '/' })
}

export async function getAdminSession() {
  const token = (await cookies()).get(cookieName)?.value
  if (!token) return null
  const session = await prisma.adminSession.findUnique({ where: { tokenHash: hash(token) } })
  if (!session || session.expiresAt < new Date()) return null
  return session
}

export async function requireAdmin() {
  const session = await getAdminSession()
  if (!session) redirect('/login')
  return session
}

export async function clearAdminSession() {
  const store = await cookies()
  const token = store.get(cookieName)?.value
  if (token) await prisma.adminSession.deleteMany({ where: { tokenHash: hash(token) } })
  store.delete(cookieName)
}
