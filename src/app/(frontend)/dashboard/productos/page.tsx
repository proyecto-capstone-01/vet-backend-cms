import type { Product } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'
import ClientComponent from '@/app/(frontend)/dashboard/productos/content'
import { IframeSheet } from '@/components/IframeSheet'


export default async function Products() {
  const payload = await getPayload({ config })

  const inventoryItems = await payload.find({
    collection: 'products',
    depth: 2,
    limit: 1000,
  })

  return (
    <div className="p-6">
      <div className="">
        <IframeSheet
          src="/admin/collections/products/create"
          buttonText="Agregar Nuevo Producto"
          title="Agregar Nuevo Producto al Inventario"
          buttonVariant="default"
          buttonSize="lg"
        />
      </div>
      <ClientComponent items={inventoryItems.docs as Product[]} />
    </div>
  )
}
