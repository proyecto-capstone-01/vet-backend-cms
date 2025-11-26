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

  // Parse and validate the requested slot BEFORE any writes
  const dateISO = new Date(data.date).toISOString()
  const timeStr: string = data.time // expected HH:mm
  const timeDate = hhmmToDate(timeStr)

  const isAvailable = await validateSlot(payload, dateISO, timeDate)
  if (!isAvailable) {
    return new Response('Selected time is not available', { status: 409, headers: corsHeaders(origin) })
  }

  const ownerData = {
    rut: cleanRut(data.rut),
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email ?? undefined,
    phoneNumber: data.phone,
  }

  // From here on, we may create data. Track what is newly created so we can roll back on any failure.
  let createdOwnerId: string | null = null
  let createdPetId: string | null = null

  try {
    // Find or create owner (do NOT update existing here to avoid side-effects on failure)
    const ownerRes = await upsertOwner(payload, ownerData)
    const owner = ownerRes.doc as any
    if (ownerRes.created) createdOwnerId = owner.id

    // Find or create pet
    const petRes = await upsertPet(payload, {
      owner: owner.id,
      name: data.petName,
      species: data.petType,
      sex: data.petSex,
    })
    const pet = petRes.doc as any
    if (petRes.created) createdPetId = pet.id

    // Re-validate right before booking to reduce race conditions
    const stillAvailable = await validateSlot(payload, dateISO, timeDate)
    if (!stillAvailable) {
      // Throw an object we can catch to return 409 after cleanup
      throw { status: 409, message: 'Selected time is not available' }
    }

    // Create appointment
    const appointment = await payload.create({
      collection: 'appointments',
      data: {
        date: dateISO,
        time: timeDate.toISOString(),
        services: data.services,
        comment: data.comentario || null,
        pet: pet.id,
        status: 'pending',
        safeId: 'apt-' + Math.random().toString(36).substr(2, 9),
      },
    })

    return new Response(JSON.stringify({ safeId: (appointment as any).safeId, id: appointment.id }), {
      status: 201,
      headers: corsHeaders(origin),
    })
  } catch (e: any) {
    // Best-effort rollback of newly created docs
    try {
      if (createdPetId) {
        await payload.delete({ collection: 'pets', id: createdPetId })
      }
    } catch {}
    try {
      if (createdOwnerId) {
        await payload.delete({ collection: 'owners', id: createdOwnerId })
      }
    } catch {}

    const status = typeof e?.status === 'number' ? e.status : 500
    const message = e?.message ?? 'Error creating appointment'
    return new Response(message, { status, headers: corsHeaders(origin) })
  }
}

export const GET = async (request: Request) => {
  const origin = request.headers.get('origin') ?? ''
  const payload = await getPayload({ config: configPromise })
  try {
    const res = await payload.find({ collection: 'appointments', limit: 1000, depth: 2 })
    const translateStatus: Record<string,string> = { pending: 'Pendiente', confirmed: 'Confirmado', completed: 'Completado', canceled: 'Cancelado' }
    const speciesMap: Record<string,string> = { dog: 'Perro', cat: 'Gato' }
    const out = res.docs.map((doc: any) => {
      const pet = typeof doc.pet === 'object' ? doc.pet : null
      const owner = pet && typeof pet.owner === 'object' ? pet.owner : null
      const services = Array.isArray(doc.services) ? doc.services : []
      const firstServiceTitle = services[0] && typeof services[0] === 'object' ? services[0].title : undefined
      return {
        id: doc.id?.toString?.() ?? doc.id,
        fecha: doc.date,
        hora: doc.time ? formatTime(doc.time) : '',
        estado: translateStatus[doc.status] || 'Pendiente',
        nombre: pet?.name || 'Mascota',
        tipo: speciesMap[pet?.species || ''] || pet?.species || '',
        servicio: firstServiceTitle || `${services.length} servicio(s)`,
        total: services.length.toString(),
        dueno: owner ? `${owner.firstName} ${owner.lastName}` : '',
        safeId: doc.safeId,
      }
    })
    return new Response(JSON.stringify(out), { status: 200, headers: corsHeaders(origin) })
  } catch (e: any) {
    return new Response('Error fetching appointments', { status: 500, headers: corsHeaders(origin) })
  }
}

function formatTime(iso: string) {
  try {
    const d = new Date(iso)
    const hh = String(d.getUTCHours()).padStart(2,'0')
    const mm = String(d.getUTCMinutes()).padStart(2,'0')
    return `${hh}:${mm}`
  } catch { return '' }
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

async function upsertOwner(payload: any, ownerData: any): Promise<{ doc: any; created: boolean }> {
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
    // Do not update existing owner in this flow to avoid side-effects when booking fails
    return { doc: existing, created: false }
  }
  const created = await payload.create({ collection: 'owners', data: ownerData })
  return { doc: created, created: true }
}

async function upsertPet(payload: any, petData: any): Promise<{ doc: any; created: boolean }> {
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
  if (res.total > 0) return { doc: res.docs[0], created: false }
  const created = await payload.create({ collection: 'pets', data: petData })
  return { doc: created, created: true }
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

  // Minutes since midnight in UTC for requested and bounds
  const reqMins = timeDate.getUTCHours() * 60 + timeDate.getUTCMinutes()
  const openDate = new Date(h.startTime)
  const closeDate = new Date(h.endTime)
  const openMins = openDate.getUTCHours() * 60 + openDate.getUTCMinutes()
  const closeMins = closeDate.getUTCHours() * 60 + closeDate.getUTCMinutes()

  if (!(reqMins >= openMins && reqMins < closeMins)) return false

  // Ensure 30-min block alignment
  if (reqMins % 30 !== 0) return false

  const timeStr = `${String(timeDate.getUTCHours()).padStart(2,'0')}:${String(timeDate.getUTCMinutes()).padStart(2,'0')}`

  // Blocked slot
  const blocks = await payload.find({ collection: 'blocked-slots', where: { date: { equals: dateOnly } }, limit: 100 })
  const isBlocked = blocks.docs.some((b: any) => {
    const bt = new Date(b.time)
    const bStr = `${String(bt.getUTCHours()).padStart(2,'0')}:${String(bt.getUTCMinutes()).padStart(2,'0')}`
    return bStr === timeStr
  })
  if (isBlocked) return false

  // Already booked
  const appts = await payload.find({ collection: 'appointments', where: { date: { equals: dateOnly } }, limit: 1000 })
  const taken = appts.docs.some((a: any) => {
    const at = new Date(a.time)
    const aStr = `${String(at.getUTCHours()).padStart(2,'0')}:${String(at.getUTCMinutes()).padStart(2,'0')}`
    return aStr === timeStr
  })
  if (taken) return false

  return true
}

const cleanRut = (rut: string) => {
  return rut.replace(/\./g, '').replace(/-/g, '').toUpperCase()
}