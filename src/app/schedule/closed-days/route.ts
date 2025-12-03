import { getPayload } from 'payload'
import config from '@/payload.config'
import { normalizeDateOnly } from '@/lib/timezone'

export async function POST(request: Request) {
  const payload = await getPayload({ config })
  const { date, reason } = await request.json()
  if (!date) return new Response('Missing date', { status: 400 })
  try {
    const dateOnly = normalizeDateOnly(date)
    const exists = await payload.find({ collection: 'closed-days' as any, where: { date: { equals: dateOnly } }, limit: 1 })
    if (exists.docs.length > 0) return new Response('Already closed', { status: 200 })
    await payload.create({ collection: 'closed-days' as any, data: { date: dateOnly, reason } as any })
    return new Response('OK')
  } catch (e: any) {
    return new Response(e?.message ?? 'Error', { status: 500 })
  }
}
