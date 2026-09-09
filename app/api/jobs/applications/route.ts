import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const body = await request.json()
  if (![body.positionId, body.name, body.email, body.phone].every((value) => typeof value === 'string' && value.trim())) return NextResponse.json({ error: 'Choose a role and complete your contact details.' }, { status: 400 })
  const position = await prisma.jobPosition.findFirst({ where: { id: body.positionId, isOpen: true } })
  if (!position) return NextResponse.json({ error: 'This role is no longer accepting applications.' }, { status: 400 })
  const application = await prisma.jobApplication.create({ data: { positionId: position.id, name: body.name.trim(), email: body.email.trim(), phone: body.phone.trim(), cvUrl: body.cvUrl?.trim() || null, coverLetter: body.coverLetter?.trim() || null } })
  return NextResponse.json({ application: { id: application.id } })
}

export async function GET() {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const applications = await prisma.jobApplication.findMany({ include: { position: true, interviewResponse: true }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ applications })
}
