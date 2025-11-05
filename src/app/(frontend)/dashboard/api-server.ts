import { getPayload } from 'payload'
import config from '@/payload.config'

export async function getAppointmentsData() {
  const payload = await getPayload({ config })
  
  try {
    const appointments = await payload.find({
      collection: 'appointments',
      limit: 1000,
    })
    return appointments.docs
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return []
  }
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