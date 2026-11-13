import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [messages, quotes] = await Promise.all([prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } }), prisma.quoteRequest.findMany({ orderBy: { createdAt: 'desc' } })])
  return NextResponse.json({ messages: messages.map(({ createdAt, ...item }) => ({ ...item, receivedAt: createdAt.toLocaleString() })), quotes: quotes.map(({ createdAt, ...item }) => ({ ...item, receivedAt: createdAt.toLocaleString() })) })
}
