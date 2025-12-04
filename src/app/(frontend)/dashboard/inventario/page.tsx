import type { Inventory } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'
import ClientComponent from '@/app/(frontend)/dashboard/inventario/content'
import { IframeSheet } from '@/components/IframeSheet'


export default async function Inventory() {
  const payload = await getPayload({ config })

  const inventoryItems = await payload.find({
    collection: 'inventory',
    depth: 1,
    limit: 1000,
  })

  return (
    <div className="p-6">
      <div className="">
        <IframeSheet
          src="/admin/collections/inventory/create"
          buttonText="Agregar Nuevo Ítem"
          title="Agregar Nuevo Ítem al Inventario"
          buttonVariant="default"
          buttonSize="lg"
        />
      </div>
      <ClientComponent items={inventoryItems.docs as Inventory[]} />
    </div>
  )
}

