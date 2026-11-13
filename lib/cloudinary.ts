import { createHash, randomUUID } from 'node:crypto'

export async function uploadApplicantCv(file: File): Promise<string> {
  const configuredUrl = process.env.CV_CLOUDINARY_URL
  if (!configuredUrl) throw new Error('CV storage is not configured.')

  const cloudinaryUrl = new URL(configuredUrl)
  const cloudName = cloudinaryUrl.hostname
  const apiKey = decodeURIComponent(cloudinaryUrl.username)
  const apiSecret = decodeURIComponent(cloudinaryUrl.password)
  if (cloudinaryUrl.protocol !== 'cloudinary:' || !cloudName || !apiKey || !apiSecret) throw new Error('CV storage configuration is invalid.')

  const timestamp = Math.floor(Date.now() / 1000).toString()
  const folder = 'stima_technics/cvs'
  const publicId = `cv-${randomUUID()}.pdf`
  const signatureSource = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
  const signature = createHash('sha1').update(signatureSource).digest('hex')
  const form = new FormData()
  form.set('file', new Blob([await file.arrayBuffer()], { type: 'application/pdf' }), publicId)
  form.set('api_key', apiKey)
  form.set('timestamp', timestamp)
  form.set('folder', folder)
  form.set('public_id', publicId)
  form.set('signature', signature)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, { method: 'POST', body: form })
  const result = await response.json() as { secure_url?: string; error?: { message?: string } }
  if (!response.ok || !result.secure_url) {
    console.error('Cloudinary CV upload failed:', result.error?.message || response.status)
    throw new Error('CV upload failed.')
  }
  return result.secure_url
}
