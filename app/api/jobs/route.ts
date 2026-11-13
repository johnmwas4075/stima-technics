import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { parseJobExpiry, parseJobPublishDate } from '@/lib/job-dates'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const admin = await getAdminSession()
  const positions = await prisma.jobPosition.findMany({ where: admin ? { isOpen: true } : { isOpen: true, AND: [{ OR: [{ publishOn: null }, { publishOn: { lte: new Date() } }] }, { OR: [{ closesOn: null }, { closesOn: { gte: new Date() } }] }] }, select: { id: true, title: true, responsibilities: true, qualifications: true, postedOn: true, closesOn: true, publishOn: true, createdAt: true }, orderBy: { postedOn: 'desc' } })
  return NextResponse.json({ positions })
}

export async function POST(request: Request) {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  if (!body.title?.trim()) return NextResponse.json({ error: 'A position title is required.' }, { status: 400 })
  const publishOn = parseJobPublishDate(body.publishOn)
  if (body.publishOn && !publishOn) return NextResponse.json({ error: 'Invalid publish date.' }, { status: 400 })
  const closesOn = parseJobExpiry(body.closesOn)
  if (!closesOn) return NextResponse.json({ error: 'An expiry date is required.' }, { status: 400 })
  if (closesOn <= (publishOn ?? new Date())) return NextResponse.json({ error: 'The expiry date must be after the post date.' }, { status: 400 })
  const position = await prisma.jobPosition.create({ data: { title: body.title.trim(), responsibilities: body.responsibilities?.trim() || '', qualifications: body.qualifications?.trim() || '', postedOn: publishOn ?? new Date(), publishOn, closesOn } })
  return NextResponse.json({ position })
}
