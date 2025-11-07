import { getPetsData } from '../api-server'
import MascotasContent from './mascotas-content'

export default async function MascotasPage() {
  const initialPets = await getPetsData()

  return <MascotasContent initialData={initialPets} />
}