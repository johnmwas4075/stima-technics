import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params; const body = await request.json()
  const application = await prisma.jobApplication.update({ where: { id }, data: { status: typeof body.status === 'string' ? body.status : undefined } })
  if (body.interview) await prisma.interviewResponse.upsert({ where: { applicationId: id }, create: { applicationId: id, outcome: body.interview.outcome || 'PENDING', notes: body.interview.notes || null, scheduledFor: body.interview.scheduledFor ? new Date(body.interview.scheduledFor) : null }, update: { outcome: body.interview.outcome || 'PENDING', notes: body.interview.notes || null, scheduledFor: body.interview.scheduledFor ? new Date(body.interview.scheduledFor) : null } })
  return NextResponse.json({ application })
}
