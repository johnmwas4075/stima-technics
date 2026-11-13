import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { getSiteContent, saveSiteContent } from '@/lib/content'
export async function GET() { if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); return NextResponse.json({ data: await getSiteContent() }) }
export async function PUT(request: Request) { if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); const data = await request.json(); if (!data || typeof data !== 'object' || Array.isArray(data)) return NextResponse.json({ error: 'Invalid content.' }, { status: 400 }); await saveSiteContent(data); return NextResponse.json({ ok: true }) }
