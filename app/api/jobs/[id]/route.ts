import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { parseJobExpiry, parseJobPublishDate } from '@/lib/job-dates'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params; const body = await request.json()
  const current = await prisma.jobPosition.findUnique({ where: { id } })
  if (!current) return NextResponse.json({ error: 'Job not found.' }, { status: 404 })
  if (current.closesOn && current.closesOn < new Date()) return NextResponse.json({ error: 'This job has expired and can no longer be edited.' }, { status: 409 })
  const closesOn = body.closesOn === undefined ? current.closesOn : parseJobExpiry(body.closesOn)
  if (!closesOn) return NextResponse.json({ error: 'An expiry date is required.' }, { status: 400 })
  const publishOn = body.publishOn === undefined ? current.publishOn : parseJobPublishDate(body.publishOn)
  if (body.publishOn && !publishOn) return NextResponse.json({ error: 'Invalid publish date.' }, { status: 400 })
  if (closesOn <= (publishOn ?? new Date())) return NextResponse.json({ error: 'The expiry date must be after the post date.' }, { status: 400 })
  const position = await prisma.jobPosition.update({ where: { id }, data: { title: body.title?.trim(), responsibilities: body.responsibilities?.trim(), qualifications: body.qualifications?.trim(), postedOn: body.postedOn ? new Date(body.postedOn) : body.publishOn !== undefined ? publishOn ?? new Date() : undefined, publishOn: body.publishOn === undefined ? undefined : publishOn, closesOn, isOpen: typeof body.isOpen === 'boolean' ? body.isOpen : undefined } })
  return NextResponse.json({ position })
}
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) { if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); const { id } = await params; await prisma.jobPosition.delete({ where: { id } }); return NextResponse.json({ ok: true }) }
