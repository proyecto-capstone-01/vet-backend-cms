import { getPayload } from 'payload'
import config from '@payload-config'
import AnalyticsClient from './content'
import type { Appointment, Owner, Product } from '@/payload-types'

export default async function Analytics() {
  const payload = await getPayload({ config })

  // Fetch server-side using Payload. Use English field names from new schema.
  const [appointmentsRes, ownersRes, productsRes] = await Promise.all([
    payload.find({ collection: 'appointments', limit: 1000, sort: '-date', depth: 2 }),
    payload.find({ collection: 'owners', limit: 1000 }),
    payload.find({ collection: 'products', limit: 1000 }),
  ])

  const appointments = (appointmentsRes.docs ?? []) as Appointment[]
  const owners = (ownersRes.docs ?? []) as Owner[]
  const products = (productsRes.docs ?? []) as Product[]

  return (
    <AnalyticsClient appointments={appointments} owners={owners} products={products} />
  )
}
