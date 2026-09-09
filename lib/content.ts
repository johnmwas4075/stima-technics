import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export type SiteContentData = Record<string, unknown>

export async function getSiteContent(): Promise<SiteContentData> {
  const content = await prisma.siteContent.findUnique({ where: { id: 1 } })
  return (content?.data as SiteContentData | undefined) ?? {}
}

export async function saveSiteContent(data: SiteContentData) {
  return prisma.siteContent.upsert({ where: { id: 1 }, create: { id: 1, data: data as Prisma.InputJsonValue }, update: { data: data as Prisma.InputJsonValue } })
}
