import { getPayload } from 'payload'
import config from '@/payload.config'
import { hhmmToStoredISO, isoTimeToHHmm, normalizeDateOnly } from '@/lib/timezone'

export async function POST(request: Request) {
  const payload = await getPayload({ config })
  const { date, time } = await request.json()
  if (!date || !time) return new Response('Missing fields', { status: 400 })
  try {
    const dateOnly = normalizeDateOnly(date).split('T')[0]
    const found = await payload.find({ collection: 'blocked-slots' as any, where: { date: { equals: dateOnly } }, limit: 100 })
    const exists = found.docs.find((d: any) => isoTimeToHHmm(d.time) === time)
    if (!exists) {
      await payload.create({ collection: 'blocked-slots' as any, data: { date: dateOnly, time: hhmmToStoredISO(time) }, overrideAccess: true })
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
    const dateOnly = normalizeDateOnly(date).split('T')[0]
    const toDelete = await payload.find({
      collection: 'blocked-slots' as any,
      where: { date: { equals: dateOnly } },
      limit: 100,
    })
    const target = toDelete.docs.find((d: any) => isoTimeToHHmm(d.time) === time)
    if (target) {
      await payload.delete({ collection: 'blocked-slots' as any, id: target.id as string, overrideAccess: true })
    }
    return new Response('OK')
  } catch (e: any) {
    return new Response(e?.message ?? 'Error', { status: 500 })
  }
}
