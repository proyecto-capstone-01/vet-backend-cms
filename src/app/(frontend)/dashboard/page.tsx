import { getAppointmentsData } from './api-server'
import DashboardContent from './dashboard-content'

export default async function DashboardPage() {
  const initialAppointments = await getAppointmentsData()

  return <DashboardContent initialData={initialAppointments} />
}