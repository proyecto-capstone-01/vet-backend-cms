import { getBusinessHoursData } from '../api-server'
import HorasContent from './horas-content'

export default async function HorasPage() {
  const initialHours = await getBusinessHoursData()

  return <HorasContent initialData={initialHours} />
}