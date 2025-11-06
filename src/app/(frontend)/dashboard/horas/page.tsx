import { getPayload } from 'payload'
import configPromise from '@payload-config'
import HorasContent from './horas-content'

async function getAppointmentsData() {
  try {
    const payload = await getPayload({ config: await configPromise })
    const appointments = await payload.find({
      collection: 'appointments',
      limit: 1000,
      sort: 'fecha',
    })
    return appointments.docs || appointments
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return []
  }
}

export default async function HorasPage() {
  const initialAppointments = await getAppointmentsData()

  return <HorasContent initialData={initialAppointments} />
}