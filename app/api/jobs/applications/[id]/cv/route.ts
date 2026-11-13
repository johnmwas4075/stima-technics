import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await getAdminSession()) return new NextResponse('Unauthorized', { status: 401 })
  const { id } = await params
  const application = await prisma.jobApplication.findUnique({ where: { id }, select: { cvUrl: true } })
  const match = application?.cvUrl?.match(/^data:application\/pdf;base64,(.+)$/)
  if (!match) return new NextResponse('CV not found', { status: 404 })
  return new NextResponse(Buffer.from(match[1], 'base64'), { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'inline; filename="applicant-cv.pdf"', 'Cache-Control': 'private, no-store' } })
}
