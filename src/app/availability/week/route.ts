import { getPayload } from 'payload'
import config from '@payload-config'
import { DateTime } from 'luxon'
import { TZ, isoTimeToHHmm, weekdaySlug, generateHalfHourSlotsForDate } from '@/lib/timezone'

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SITE_URL ?? '',
  'http://localhost:3000',
  'http://localhost:4321',
]

function corsHeaders(origin: string) {
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : '*'
  return new Headers({
    'Access-Control-Allow-Origin': allowOrigin,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  })
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin') ?? ''
  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin),
  })
}

export async function GET(request: Request) {
  const origin = request.headers.get('origin') ?? ''
  const payload = await getPayload({ config })
  const today = DateTime.now().setZone(TZ)
  // Compute Monday start of week
  const weekStart = today.minus({ days: today.weekday - 1 }).startOf('day')

  const [hours, closedDays, blockedSlots, appointments] = await Promise.all([
    payload.find({ collection: 'hours' as any, limit: 1000 }),
    payload.find({ collection: 'closed-days' as any, limit: 1000 }),
    payload.find({ collection: 'blocked-slots' as any, limit: 1000 }),
    payload.find({ collection: 'appointments', where: { date: { greater_than_equal: weekStart.toFormat('yyyy-MM-dd') } as any }, limit: 1000 }),
  ])
  const results: Record<string, { hour: string; availability: boolean }[]> = {}
  for (let i = 0; i < 7; i++) {
    const date = weekStart.plus({ days: i })
    const key = date.toFormat('yyyy-MM-dd')
    const dowSlugVal = weekdaySlug(date)
    const h = (hours.docs as any[]).find((x: any) => x.dayOfWeek === dowSlugVal)
    const closed = (closedDays.docs as any[]).some((d: any) => DateTime.fromISO(d.date, { zone: TZ }).toFormat('yyyy-MM-dd') === key)
    const blockedSet = new Set(
      (blockedSlots.docs as any[])
        .filter((b: any) => DateTime.fromISO(b.date, { zone: TZ }).toFormat('yyyy-MM-dd') === key)
        .map((b: any) => isoTimeToHHmm(b.time))
    )
    const bookedSet = new Set(
      (appointments.docs as any[])
        .filter((a: any) => DateTime.fromISO(a.date, { zone: TZ }).toFormat('yyyy-MM-dd') === key)
        .map((a: any) => isoTimeToHHmm(a.time))
    )
    let daySlots: { hour: string; availability: boolean }[] = []
    if (h && !closed) {
      const openISO = h.startTime
      const closeISO = h.endTime
      if (openISO && closeISO) {
        const gen = generateHalfHourSlotsForDate(date.toISO()!, openISO, closeISO)
        daySlots = gen.map((s) => ({ hour: s, availability: !blockedSet.has(s) && !bookedSet.has(s) }))
      }
    }
    results[key] = daySlots
  }
  return Response.json(results, { headers: corsHeaders(origin) })
}
