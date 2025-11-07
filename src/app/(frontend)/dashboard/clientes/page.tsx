import { getOwnersData } from '../api-server'
import ClientesContent from './clientes-content'

export default async function ClientesPage() {
  const initialOwners = await getOwnersData()

  return <ClientesContent initialData={initialOwners} />
}