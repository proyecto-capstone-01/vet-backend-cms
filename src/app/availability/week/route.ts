import { getPayload } from 'payload'
import config from '@payload-config'
import { startOfWeek, addDays, format, addMinutes, isSameDay } from 'date-fns'

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

function toTime(dateStr?: string | null) {
  return dateStr ? new Date(dateStr) : undefined
}

function generateSlots(open: Date, close: Date) {
  const slots: string[] = []
  let cur = new Date(open)
  while (cur < close) {
    slots.push(format(cur, 'HH:mm'))
    cur = addMinutes(cur, 30)
  }
  return slots
}

export async function GET(request: Request) {
  const origin = request.headers.get('origin') ?? ''
  const payload = await getPayload({ config })
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })

  const [hours, closedDays, blockedSlots, appointments] = await Promise.all([
    payload.find({ collection: 'hours' as any, limit: 1000 }),
    payload.find({ collection: 'closed-days' as any, limit: 1000 }),
    payload.find({ collection: 'blocked-slots' as any, limit: 1000 }),
    payload.find({ collection: 'appointments', where: { date: { greater_than_equal: weekStart.toISOString().split('T')[0] } as any }, limit: 1000 }),
  ])

  const results: Record<string, { hour: string; availability: boolean }[]> = {}
  for (let i = 0; i < 7; i++) {
    const date = addDays(weekStart, i)
    const key = format(date, 'yyyy-MM-dd')
    const dow = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'][i]
    const h = (hours.docs as any[]).find((x: any) => x.dayOfWeek === dow)
    const closed = (closedDays.docs as any[]).some((d: any) => isSameDay(new Date(d.date), date))
    const blocked = new Set(
      (blockedSlots.docs as any[])
        .filter((b: any) => isSameDay(new Date(b.date), date))
        .map((b: any) => format(new Date(b.time), 'HH:mm')),
    )
    const booked = new Set(
      (appointments.docs as any[])
        .filter((a: any) => isSameDay(new Date(a.date), date))
        .map((a: any) => format(new Date(a.time), 'HH:mm')),
    )

    let daySlots: { hour: string; availability: boolean }[] = []
    if (h && !closed) {
      const open = toTime(h.startTime)
      const close = toTime(h.endTime)
      if (open && close) {
        const gen = generateSlots(open, close)
        daySlots = gen.map((s) => ({ hour: s, availability: !blocked.has(s) && !booked.has(s) }))
      }
    }
    results[key] = daySlots
  }

  return Response.json(results, { headers: corsHeaders(origin) })
}
