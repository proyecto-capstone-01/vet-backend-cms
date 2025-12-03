import { getPayload } from 'payload'
import config from '@/payload.config'
import { isoTimeToHHmm } from '@/lib/timezone'
import type { Appointment } from '@/payload-types'


export async function getAppointmentsData(): Promise<Appointment[]> {
  const payload = await getPayload({ config })

  try {
    const appointments = await payload.find({
      collection: 'appointments',
      limit: 1000,
      depth: 2, // populate relationships (pet -> owner, services)
      sort: ['-date', 'time'],
    })

    return appointments.docs
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return []
  }


  // try {
  //   const appointments = await payload.find({
  //     collection: 'appointments',
  //     limit: 1000,
  //     depth: 2, // populate relationships (pet -> owner, services)
  //     sort: ['-date', 'time'],
  //   })
  //
  //   const translateStatus: Record<string,string> = {
  //     pending: 'Pendiente',
  //     confirmed: 'Confirmado',
  //     completed: 'Completado',
  //     canceled: 'Cancelado',
  //   }
  //
  //   return appointments.docs.map((doc: any) => {
  //     const pet = doc.pet && typeof doc.pet === 'object' ? doc.pet : null
  //     const owner = pet && pet.owner && typeof pet.owner === 'object' ? pet.owner : null
  //     const services = Array.isArray(doc.services) ? doc.services : []
  //     const firstService = services[0] && typeof services[0] === 'object' ? services[0].title : undefined
  //
  //     // date is stored as ISO date string, time as ISO timestamp representing time of day
  //     const fecha = doc.date // keep original ISO date string (YYYY-MM-DDTHH:mm:ss.sssZ)
  //     const hora = doc.time ? formatTime(doc.time) : ''
  //     const estado = translateStatus[doc.status] || 'Pendiente'
  //     return {
  //       id: doc.id?.toString?.() ?? doc.id,
  //       fecha,
  //       hora,
  //       estado,
  //       nombre: pet?.name ?? 'Mascota',
  //       tipo: translateSpecies(pet?.species),
  //       servicio: firstService || `${services.length} servicio(s)`,
  //       total: services.length.toString(),
  //       dueño: owner ? `${owner.firstName} ${owner.lastName}` : '',
  //       safeId: doc.safeId,
  //       raw: doc,
  //     }
  //   })
  // } catch (error) {
  //   console.error('Error fetching appointments:', error)
  //   return []
  // }
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