import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const body = await request.json()
  if (![body.name, body.email, body.message].every((value) => typeof value === 'string' && value.trim())) return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 })
  await prisma.contactMessage.create({ data: { name: body.name.trim(), email: body.email.trim(), message: body.message.trim() } })
  return NextResponse.json({ ok: true })
}
