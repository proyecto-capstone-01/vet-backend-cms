import { DateTime } from 'luxon'

export const TZ = 'America/Santiago'

// Parse a date-only string (YYYY-MM-DD) as midnight in the target timezone
export function parseLocalDate(dateStr: string): DateTime {
  return DateTime.fromISO(dateStr, { zone: TZ }).startOf('day')
}

// Parse an HH:mm clock string
export function parseHHmm(hhmm: string): { hour: number; minute: number } {
  const [h, m] = hhmm.split(':').map(Number)
  return { hour: h, minute: m }
}

// Combine a date (YYYY-MM-DD) and HH:mm into a DateTime in the target timezone
export function combineLocalDateTime(dateStr: string, hhmm: string): DateTime {
  const { hour, minute } = parseHHmm(hhmm)
  return DateTime.fromISO(dateStr, { zone: TZ }).set({ hour, minute, second: 0, millisecond: 0 })
}

// Convert stored time-only ISO (epoch based) to HH:mm (assumes original hours/minutes represent local clock value)
export function isoTimeToHHmm(iso: string): string {
  try {
    const dt = DateTime.fromISO(iso, { zone: 'utc' })
    return dt.toFormat('HH:mm')
  } catch { return '' }
}

// Create storage ISO for a time-only HH:mm using an Epoch anchor (1970-01-01) in UTC
export function hhmmToStoredISO(hhmm: string): string {
  const { hour, minute } = parseHHmm(hhmm)
  return DateTime.utc(1970, 1, 1, hour, minute, 0, 0).toISO({ suppressMilliseconds: true }) || `1970-01-01T${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}:00.000Z`
}

export function weekdaySlug(dt: DateTime): string {
  const map = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']
  return map[dt.weekday - 1]
}

// Generate half-hour slot strings between two stored ISO times (open/close)
export function generateHalfHourSlots(openISO: string, closeISO: string): string[] {
  const open = DateTime.fromISO(openISO, { zone: 'utc' })
  const close = DateTime.fromISO(closeISO, { zone: 'utc' })
  const out: string[] = []
  let cur = open
  while (cur < close) {
    out.push(cur.toFormat('HH:mm'))
    cur = cur.plus({ minutes: 30 })
  }
  return out
}

// Generate half-hour slot strings between two stored ISO times (open/close), aware of a specific local date for DST correctness
export function generateHalfHourSlotsForDate(localDateISO: string, openISO: string, closeISO: string): string[] {
  const date = DateTime.fromISO(localDateISO, { zone: TZ })
  const openUTC = DateTime.fromISO(openISO, { zone: 'utc' })
  const closeUTC = DateTime.fromISO(closeISO, { zone: 'utc' })
  // Map hours/minutes to the local date preserving clock times
  let cur = date.set({ hour: openUTC.hour, minute: openUTC.minute, second: 0, millisecond: 0 })
  const end = date.set({ hour: closeUTC.hour, minute: closeUTC.minute, second: 0, millisecond: 0 })
  const out: string[] = []
  while (cur < end) {
    out.push(cur.toFormat('HH:mm'))
    cur = cur.plus({ minutes: 30 })
  }
  return out
}

// Normalize a date-only string coming from client; returns YYYY-MM-DD
export function normalizeDateOnly(dateStr: string): string {
  // Accept either YYYY-MM-DD or full ISO
  if (dateStr.includes('T')) {
    const dt = DateTime.fromISO(dateStr, { zone: TZ })
    return dt.toFormat('yyyy-MM-dd')
  }
  return dateStr
}
