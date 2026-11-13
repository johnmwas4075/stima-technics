export function parseJobExpiry(value: unknown): Date | null {
  if (typeof value !== 'string') return null
  const dateOnly = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (dateOnly) {
    const year = Number(dateOnly[1]); const month = Number(dateOnly[2]); const day = Number(dateOnly[3])
    const check = new Date(Date.UTC(year, month - 1, day))
    if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) return null
    return new Date(`${value.trim()}T23:59:59.999+03:00`)
  }
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function parseJobPublishDate(value: unknown): Date | null {
  if (value === undefined || value === null || value === '') return null
  if (typeof value !== 'string') return null
  const localDateTime = value.trim().match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})$/)
  const parsed = new Date(localDateTime ? `${localDateTime[1]}:00+03:00` : value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}
