import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const positions = await prisma.jobPosition.findMany({ where: { isOpen: true }, orderBy: { postedOn: 'desc' } })
  return NextResponse.json({ positions })
}

export async function POST(request: Request) {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  if (!body.title?.trim()) return NextResponse.json({ error: 'A position title is required.' }, { status: 400 })
  const position = await prisma.jobPosition.create({ data: { title: body.title.trim(), responsibilities: body.responsibilities?.trim() || '', postedOn: body.postedOn ? new Date(body.postedOn) : new Date(), closesOn: body.closesOn ? new Date(body.closesOn) : null } })
  return NextResponse.json({ position })
}
