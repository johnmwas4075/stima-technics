import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const body = await request.json()
  const required = ['name', 'email', 'phone', 'service', 'location', 'projectType', 'message']
  if (!required.every((key) => typeof body[key] === 'string' && body[key].trim())) return NextResponse.json({ error: 'Complete all required fields.' }, { status: 400 })
  await prisma.quoteRequest.create({ data: { name: body.name.trim(), company: body.company?.trim() || null, email: body.email.trim(), phone: body.phone.trim(), service: body.service.trim(), location: body.location.trim(), projectType: body.projectType.trim(), message: body.message.trim() } })
  return NextResponse.json({ ok: true })
}
