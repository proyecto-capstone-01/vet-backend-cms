import { GenericDataTable } from '@/components/DataTable'
import type { Product } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'



/*
{

    "id": 27,
    "name": "Example 2",
    "description": "Example description product 2",
    "price": 9990,
    "discount": null,
    "outOfStock": true,
    "images": [],
    "updatedAt": "2025-11-29T23:00:04.783Z",
    "createdAt": "2025-11-29T23:59:59.741Z"

}
 */
export default async function Products() {
  const payload = await getPayload({ config })

  //const page = searchParams.page ? parseInt(searchParams.page as string, 10) : 1


  const inventoryItems = await payload.find({
    collection: 'products',
    depth: 2,
    limit: 1000,
  })

  const columns = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Nombre', accessorKey: 'name' },
    { header: 'Descripción', accessorKey: 'description' },
    { header: 'Precio', accessorKey: 'price' },
    { header: 'Descuento', accessorKey: 'discount' },
    { header: 'Sin stock', accessorKey: 'outOfStock' },
    { header: 'Fecha de Creación', accessorKey: 'createdAt' },
  ]


  return (
    <div className="p-6">
      <GenericDataTable
        columns={columns}
        data={inventoryItems.docs as Product[]}
        pageSizeOptions={[5, 10, 20]}
      />
    </div>
  )
}
