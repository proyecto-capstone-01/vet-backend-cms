import { getAppointmentsData } from './api-server'
import DashboardContent from './dashboard-content'
import { ejemplo } from './data'

export default async function DashboardPage() {
  const initialAppointments = await getAppointmentsData()

  return <DashboardContent initialData={ejemplo} /> // Use ejemplo data for initialData
}