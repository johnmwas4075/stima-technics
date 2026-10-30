import { createHash } from 'crypto'
import { NextResponse } from 'next/server'

const folder = 'stima_technics'

function config() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!cloudName || !apiKey || !apiSecret) throw new Error('Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to .env.local.')
  return { cloudName, apiKey, apiSecret }
}

function signature(params: Record<string, string>, secret: string) {
  const source = Object.entries(params).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}=${value}`).join('&')
  return createHash('sha1').update(`${source}${secret}`).digest('hex')
}

export async function GET() {
  try {
    const { cloudName, apiKey, apiSecret } = config()
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?prefix=${folder}/&max_results=100`, { headers: { Authorization: `Basic ${auth}` }, cache: 'no-store' })
    const data = await response.json()
    if (!response.ok) return NextResponse.json({ error: data.error?.message || 'Cloudinary could not load the media library.' }, { status: response.status })
    return NextResponse.json({ images: data.resources.map((image: { public_id: string; secure_url: string; width: number; height: number; created_at: string }) => ({ publicId: image.public_id, url: image.secure_url, width: image.width, height: image.height, createdAt: image.created_at })) })
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to load Cloudinary images.' }, { status: 500 }) }
}

export async function POST(request: Request) {
  try {
    const { cloudName, apiKey, apiSecret } = config()
    const form = await request.formData()
    const file = form.get('file')
    if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: 'Select an image to upload.' }, { status: 400 })
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const replacePublicId = form.get('replacePublicId')?.toString().trim()
    const signable: Record<string, string> = replacePublicId ? { folder, public_id: replacePublicId.replace(`${folder}/`, ''), overwrite: 'true', timestamp } : { folder, timestamp }
    const body = new FormData()
    body.append('file', file)
    Object.entries(signable).forEach(([key, value]) => body.append(key, value))
    body.append('api_key', apiKey)
    body.append('signature', signature(signable, apiSecret))
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body })
    const data = await response.json()
    if (!response.ok) return NextResponse.json({ error: data.error?.message || 'Image upload failed.' }, { status: response.status })
    return NextResponse.json({ image: { publicId: data.public_id, url: data.secure_url, width: data.width, height: data.height, createdAt: data.created_at } })
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to upload image.' }, { status: 500 }) }
}

export async function DELETE(request: Request) {
  try {
    const { cloudName, apiKey, apiSecret } = config()
    const { publicId } = await request.json()
    if (typeof publicId !== 'string' || !publicId.startsWith(`${folder}/`)) return NextResponse.json({ error: 'Only images in the stima_technics folder can be deleted.' }, { status: 400 })
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const params = { public_id: publicId, timestamp }
    const body = new URLSearchParams({ ...params, api_key: apiKey, signature: signature(params, apiSecret) })
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })
    const data = await response.json()
    if (!response.ok) return NextResponse.json({ error: data.error?.message || 'Image deletion failed.' }, { status: response.status })
    return NextResponse.json({ result: data.result })
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to delete image.' }, { status: 500 }) }
}
