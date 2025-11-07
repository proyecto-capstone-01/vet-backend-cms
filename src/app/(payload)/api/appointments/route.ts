import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config: await configPromise })
    
    const appointments = await payload.find({
      collection: 'appointments',
      sort: '-createdAt',
      limit: 100,
    })

    return Response.json(appointments.docs || appointments)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return Response.json(
      { message: 'Error al obtener citas' },
      { status: 500 }
    )
  }
}