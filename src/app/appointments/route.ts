import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { format } from 'date-fns'

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

/*
Expected payload:
{
  "rut": "12345678K",
  "firstName": "John",
  "lastName": "Doe",
  "email": "email@example.com",
  "phone": "+56912345678",
  "petName": "Fido",
  "petType": "Dog",
  "petSex": "Male",
  "fecha": "2024-07-15",
  "hora": "10:30",
  "servicios": ["consultation", "vaccination"],
  "comentario": "Please be gentle"
}
 */
export const POST = async (request: Request) => {
  const origin = request.headers.get('origin') ?? ''
  const payload = await getPayload({ config: configPromise })
  const data = await request.json()

  // Basic validation
  const required = ['rut','firstName','lastName','phone','petName','petType','petSex','date','time','services']
  const missing = required.filter((k) => data[k] === undefined || data[k] === null || data[k] === '')
  if (missing.length) {
    return new Response(`Missing: ${missing.join(', ')}`, { status: 400, headers: corsHeaders(origin) })
  }

  const ownerData = {
    rut: cleanRut(data.rut),
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email ?? undefined,
    phoneNumber: data.phone,
  }

  // Upsert owner by rut OR email OR phoneNumber
  const owner = await upsertOwner(payload, ownerData)

  // Upsert pet by owner + (name + species + sex)
  const pet = await upsertPet(payload, {
    owner: owner.id,
    name: data.petName,
    species: data.petType,
    sex: data.petSex,
  })

  // Validate requested slot
  const dateISO = new Date(data.date).toISOString()
  const timeStr: string = data.time // expected HH:mm
  const timeDate = hhmmToDate(timeStr)

  const isAvailable = await validateSlot(payload, dateISO, timeDate)
  if (!isAvailable) {
    return new Response('Selected time is not available', { status: 409, headers: corsHeaders(origin) })
  }

  // Create appointment
  try {
    const appointment = await payload.create({
      collection: 'appointments',
      data: {
        date: dateISO,
        time: timeDate.toISOString(),
        services: data.services,
        comment: data.comentario || null,
        pet: (pet as any).id,
        status: 'pending',
      },
    })

    return new Response(JSON.stringify({ safeId: (appointment as any).safeId, id: appointment.id }), {
      status: 201,
      headers: corsHeaders(origin),
    })
  } catch (e: any) {
    return new Response(e?.message ?? 'Error creating appointment', { status: 500, headers: corsHeaders(origin) })
  }
}

function hhmmToDate(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number)
  const d = new Date(0)
  d.setUTCHours(h)
  d.setUTCMinutes(m)
  d.setUTCSeconds(0)
  d.setUTCMilliseconds(0)
  return d
}

async function upsertOwner(payload: any, ownerData: any) {
  const where: any = { or: [] as any[] }
  if (ownerData.rut) where.or.push({ rut: { equals: ownerData.rut } })
  if (ownerData.email) where.or.push({ email: { equals: ownerData.email } })
  if (ownerData.phoneNumber) where.or.push({ phoneNumber: { equals: ownerData.phoneNumber } })

  let existing: any = null
  if (where.or.length) {
    const res = await payload.find({ collection: 'owners', where, limit: 1 })
    existing = res.total ? res.docs[0] : null
  }

  if (existing) {
    return await payload.update({ collection: 'owners', id: existing.id, data: ownerData })
  }
  return await payload.create({ collection: 'owners', data: ownerData })
}

async function upsertPet(payload: any, petData: any) {
  const res = await payload.find({
    collection: 'pets',
    where: {
      and: [
        { owner: { equals: petData.owner } },
        { name: { equals: petData.name } },
        { species: { equals: petData.species } },
        { sex: { equals: petData.sex } },
      ],
    },
    limit: 1,
  })
  if (res.total > 0) return res.docs[0]
  return await payload.create({ collection: 'pets', data: petData })
}

async function validateSlot(payload: any, dateISO: string, timeDate: Date) {
  const dateOnly = dateISO.split('T')[0]
  const date = new Date(dateISO)

  // Closed days
  const closed = await payload.find({ collection: 'closed-days', where: { date: { equals: dateOnly } }, limit: 1 })
  if (closed.total > 0) return false

  // Hours for weekday
  const dow = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][date.getDay()]
  const hours = await payload.find({ collection: 'hours', where: { dayOfWeek: { equals: dow } }, limit: 1 })
  if (hours.total === 0) return false
  const h = hours.docs[0] as any
  const open = new Date(h.startTime)
  const close = new Date(h.endTime)
  if (!(timeDate >= open && timeDate < close)) return false

  // Ensure 30-min block alignment
  const mins = timeDate.getUTCMinutes()
  if (mins % 30 !== 0) return false

  // Blocked slot
  const blocks = await payload.find({ collection: 'blocked-slots', where: { date: { equals: dateOnly } }, limit: 100 })
  const timeStr = format(timeDate, 'HH:mm')
  const isBlocked = blocks.docs.some((b: any) => format(new Date(b.time), 'HH:mm') === timeStr)
  if (isBlocked) return false

  // Already booked
  const appts = await payload.find({ collection: 'appointments', where: { date: { equals: dateOnly } }, limit: 1000 })
  const taken = appts.docs.some((a: any) => format(new Date(a.time), 'HH:mm') === timeStr)
  if (taken) return false

  return true
}

const cleanRut = (rut: string) => {
  return rut.replace(/\./g, '').replace(/-/g, '').toUpperCase()
}