import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    const payload = await getPayload({ config: await configPromise })
    
    const updatedAppointment = await payload.update({
      collection: 'appointments',
      id,
      data: body,
    })

    return Response.json(updatedAppointment)
  } catch (error) {
    console.error('Error updating appointment:', error)
    return Response.json(
      { message: 'Error al actualizar cita' },
      { status: 500 }
    )
  }
}