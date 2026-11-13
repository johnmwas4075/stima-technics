import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { uploadApplicantCv } from '@/lib/cloudinary'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const form = await request.formData()
  const positionId = String(form.get('positionId') || ''); const name = String(form.get('name') || ''); const email = String(form.get('email') || ''); const phone = String(form.get('phone') || ''); const coverLetter = String(form.get('coverLetter') || '')
  const cv = form.get('cv')
  if (![positionId, name, email, phone].every((value) => value.trim()) || !(cv instanceof File) || !cv.size) return NextResponse.json({ error: 'Choose a role, complete your contact details, and attach a CV.' }, { status: 400 })
  if (cv.type !== 'application/pdf' || !cv.name.toLowerCase().endsWith('.pdf') || cv.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'The CV must be a PDF no larger than 5 MB.' }, { status: 400 })
  const fileBytes = Buffer.from(await cv.arrayBuffer())
  if (fileBytes.subarray(0, 5).toString() !== '%PDF-') return NextResponse.json({ error: 'The uploaded file is not a valid PDF.' }, { status: 400 })
  const position = await prisma.jobPosition.findFirst({ where: { id: positionId, isOpen: true, AND: [{ OR: [{ publishOn: null }, { publishOn: { lte: new Date() } }] }, { OR: [{ closesOn: null }, { closesOn: { gte: new Date() } }] }] } })
  if (!position) return NextResponse.json({ error: 'This role is no longer accepting applications.' }, { status: 400 })
  let cvUrl: string
  try { cvUrl = await uploadApplicantCv(cv) } catch { return NextResponse.json({ error: 'We could not store your CV. Please try again later.' }, { status: 502 }) }
  const application = await prisma.jobApplication.create({ data: { positionId: position.id, name: name.trim(), email: email.trim(), phone: phone.trim(), cvUrl, coverLetter: coverLetter.trim() || null } })
  return NextResponse.json({ application: { id: application.id } })
}

export async function GET() {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const applications = await prisma.jobApplication.findMany({ include: { position: true, interviewResponse: true }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ applications: applications.map(({ cvUrl, ...application }) => ({ ...application, cvUrl: cvUrl?.startsWith('data:application/pdf;base64,') ? `/api/jobs/applications/${application.id}/cv` : cvUrl })) })
}
