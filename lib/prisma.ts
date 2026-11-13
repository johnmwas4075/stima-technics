import { PrismaClient } from '@/generated/prisma'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }
const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL is not configured. Add the PostgreSQL connection string to .env.local and restart the development server.')

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ datasources: { db: { url: databaseUrl } } })
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
