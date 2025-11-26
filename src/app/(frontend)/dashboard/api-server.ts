import { getPayload } from 'payload'
import config from '@/payload.config'

export async function getAppointmentsData() {
  const payload = await getPayload({ config })
  try {
    const appointments = await payload.find({
      collection: 'appointments',
      limit: 1000,
      depth: 2, // populate relationships (pet -> owner, services)
      sort: '-date',
    })

    const translateStatus: Record<string,string> = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      completed: 'Completado',
      canceled: 'Cancelado',
    }

    return appointments.docs.map((doc: any) => {
      const pet = doc.pet && typeof doc.pet === 'object' ? doc.pet : null
      const owner = pet && pet.owner && typeof pet.owner === 'object' ? pet.owner : null
      const services = Array.isArray(doc.services) ? doc.services : []
      const firstService = services[0] && typeof services[0] === 'object' ? services[0].title : undefined

      // date is stored as ISO date string, time as ISO timestamp representing time of day
      const fecha = doc.date // keep original ISO date string (YYYY-MM-DDTHH:mm:ss.sssZ)
      const hora = doc.time ? formatTime(doc.time) : ''
      const estado = translateStatus[doc.status] || 'Pendiente'
      return {
        id: doc.id?.toString?.() ?? doc.id,
        fecha,
        hora,
        estado,
        nombre: pet?.name ?? 'Mascota',
        tipo: translateSpecies(pet?.species),
        servicio: firstService || `${services.length} servicio(s)`,
        total: services.length.toString(),
        dueño: owner ? `${owner.firstName} ${owner.lastName}` : '',
        safeId: doc.safeId,
        raw: doc,
      }
    })
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return []
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

function translateSpecies(spec?: string) {
  if (!spec) return ''
  const map: Record<string,string> = { dog: 'Perro', cat: 'Gato' }
  return map[spec] || spec
}

export async function getOwnersData() {
  const payload = await getPayload({ config })
  
  try {
    const owners = await payload.find({
      collection: 'owners',
      limit: 1000,
    })
    return owners.docs
  } catch (error) {
    console.error('Error fetching owners:', error)
    return []
  }
}

export async function getPetsData() {
  const payload = await getPayload({ config })
  
  try {
    const pets = await payload.find({
      collection: 'pets',
      limit: 1000,
    })
    return pets.docs
  } catch (error) {
    console.error('Error fetching pets:', error)
    return []
  }
}

export async function getBusinessHoursData() {
  const payload = await getPayload({ config })
  
  try {
    const hours = await payload.find({
      collection: 'business-hours' as any,
      limit: 1000,
    })
    return hours.docs
  } catch (error) {
    console.error('Error fetching business hours:', error)
    return []
  }
}