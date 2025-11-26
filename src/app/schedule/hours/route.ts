import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: Request) {
  const payload = await getPayload({ config })
  const body = await request.json().catch(() => ({}))
  const { dayOfWeek, startTime, endTime } = body || {}

  if (!dayOfWeek || !startTime || !endTime) {
    return new Response('Missing fields', { status: 400 })
  }
  try {
    // Upsert: one per dayOfWeek
    const existing = await payload.find({ collection: 'hours' as any, where: { dayOfWeek: { equals: dayOfWeek } }, limit: 1 })
    if (existing.docs.length > 0) {
      const id = existing.docs[0].id as string
      await payload.update({ collection: 'hours' as any, id, data: { dayOfWeek, startTime, endTime }, overrideAccess: true })
    } else {
      await payload.create({ collection: 'hours' as any, data: { dayOfWeek, startTime, endTime }, overrideAccess: true })
    }
    return new Response('OK')
  } catch (e: any) {
    return new Response(e?.message ?? 'Error', { status: 500 })
  }
}
