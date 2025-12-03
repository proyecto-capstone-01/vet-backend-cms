'use client'
import type { ColumnDef } from '@tanstack/react-table'
import { GenericDataTable } from '@/components/DataTable'
import type { Product } from '@/payload-types'
import { IframeSheet } from '@/components/IframeSheet'

export default function ClientComponent({ items, }: { items: Product[] }) {
  const columns: ColumnDef<any, any>[] = [
    { header: 'ID', accessorKey: 'id' },
    { header: 'Nombre', accessorKey: 'name' },
    { header: 'Descripción', accessorKey: 'description',
      cell: ({ row }) => row.original.description ? row.original.description : 'N/A',
    },
    { header: 'Precio', accessorKey: 'price',
      cell: ({ row }) => row.original.price === null ? 'N/A' : `${row.original.price.toLocaleString("es-CL", { currency: "CLP", style: "currency" })}`,
    },
    { header: 'Descuento', accessorKey: 'discount',
      cell: ({ row }) => row.original.discount === null ? 'N/A' : `${row.original.discount}%`,
    },
    { header: 'Sin stock', accessorKey: 'outOfStock',
      cell: ({ row }) => row.original.outOfStock !== undefined ? (row.original.outOfStock ? 'Sí' : 'No') : 'N/A',
    },
    { header: 'Fecha de Creación', accessorKey: 'createdAt',
      cell: ({ row }) => row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString('es-CL') : 'N/A',
    },
    { id: 'acciones', header: 'Acciones',
      cell: ({ row }) => (
        <IframeSheet
          src={`/admin/collections/products/${row.original.id}`}
          buttonText="Editar"
          title="Editando Producto"
          buttonVariant="outline"
          buttonSize="sm"
        />
      ),
    },
  ]

  return (
    <>
      <GenericDataTable
        columns={columns}
        data={items}
        pageSizeOptions={[5, 10, 20]}
      />
    </>
  )
}