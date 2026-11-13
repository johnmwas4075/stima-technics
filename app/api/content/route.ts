import { NextResponse } from 'next/server'
import { getSiteContent } from '@/lib/content'
export async function GET() { return NextResponse.json({ data: await getSiteContent() }, { headers: { 'Cache-Control': 'no-store' } }) }
