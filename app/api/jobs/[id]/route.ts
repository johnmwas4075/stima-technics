import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params; const body = await request.json()
  const position = await prisma.jobPosition.update({ where: { id }, data: { title: body.title?.trim(), responsibilities: body.responsibilities?.trim(), postedOn: body.postedOn ? new Date(body.postedOn) : undefined, closesOn: body.closesOn === '' ? null : body.closesOn ? new Date(body.closesOn) : undefined, isOpen: typeof body.isOpen === 'boolean' ? body.isOpen : undefined } })
  return NextResponse.json({ position })
}
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) { if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); const { id } = await params; await prisma.jobPosition.delete({ where: { id } }); return NextResponse.json({ ok: true }) }
