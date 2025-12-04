import { getAppointmentsData } from '../api-server'
import HorasContent from './horas-content'


export default async function HorasPage() {
  const initialAppointments = await getAppointmentsData()

  return <HorasContent initialData={initialAppointments} />
}