import { getPayload } from 'payload'
import config from '@/payload.config'

function parseTimeToDate(time: string) {
  const [h, m] = time.split(':').map(Number)
  const d = new Date(0)
  d.setUTCHours(h)
  d.setUTCMinutes(m)
  d.setUTCSeconds(0)
  d.setUTCMilliseconds(0)
  return d
}

export async function POST(request: Request) {
  const payload = await getPayload({ config })
  const { date, time } = await request.json()
  if (!date || !time) return new Response('Missing fields', { status: 400 })
  try {
    const timeDate = parseTimeToDate(time)
    // idempotent: check if exists
    const found = await payload.find({ collection: 'blocked-slots' as any, where: { date: { equals: date.split('T')[0] } }, limit: 100 })
    const exists = found.docs.find((d: any) => {
      const t = new Date(d.time)
      return `${String(t.getUTCHours()).padStart(2,'0')}:${String(t.getUTCMinutes()).padStart(2,'0')}` === time
    })
    if (!exists) {
      await payload.create({ collection: 'blocked-slots' as any, data: { date, time: timeDate }, overrideAccess: true })
    }
    return new Response('OK')
  } catch (e: any) {
    return new Response(e?.message ?? 'Error', { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const payload = await getPayload({ config })
  const { date, time } = await request.json()
  if (!date || !time) return new Response('Missing fields', { status: 400 })
  try {
    const toDelete = await payload.find({
      collection: 'blocked-slots' as any,
      where: { date: { equals: date.split('T')[0] } },
      limit: 100,
    })
    const target = toDelete.docs.find((d: any) => {
      const t = new Date(d.time)
      const hh = String(t.getUTCHours()).padStart(2, '0')
      const mm = String(t.getUTCMinutes()).padStart(2, '0')
      return `${hh}:${mm}` === time
    })
    if (target) {
      await payload.delete({ collection: 'blocked-slots' as any, id: target.id as string, overrideAccess: true })
    }
    return new Response('OK')
  } catch (e: any) {
    return new Response(e?.message ?? 'Error', { status: 500 })
  }
}
