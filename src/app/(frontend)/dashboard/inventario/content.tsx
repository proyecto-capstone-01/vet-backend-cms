'use client'
import type { ColumnDef } from '@tanstack/react-table'
import { GenericDataTable } from '@/components/DataTable'
import type { Inventory } from '@/payload-types'
import { IframeSheet } from '@/components/IframeSheet'

export default function ClientComponent({ items, }: { items: Inventory[] }) {
  const columns: ColumnDef<any, any>[] = [
    { header: 'SKU', accessorKey: 'sku' },
    { header: 'Nombre', accessorKey: 'name' },
    { header: 'Descripción', accessorKey: 'description',
    cell: ({ row }) => row.original.description ? row.original.description : 'N/A',
    },
    { header: 'Categoría', accessorKey: 'category',
    cell: ({ row }) => row.original.category ? row.original.category : 'N/A',
    },
    { header: 'Costo Unitario', accessorKey: 'unitCost',
    cell: ({ row }) => row.original.unitCost ? `${row.original.unitCost.toLocaleString("es-CL", { currency: "CLP", style: "currency" })}` : 'N/A',
    },
    { header: 'Cantidad', accessorKey: 'quantity',
    cell: ({ row }) => row.original.quantity !== undefined ? row.original.quantity : 'N/A',
    },
    { header: 'Proveedor', accessorKey: 'supplier',
    cell: ({ row }) => row.original.supplier ? row.original.supplier : 'N/A',
    },
    { header: 'Ubicación', accessorKey: 'location',
    cell: ({ row }) => row.original.location ? row.original.location : 'N/A',
      },
    { header: 'Estado', accessorKey: 'status',
    cell: ({ row }) => row.original.status ? row.original.status : 'N/A',
    },
    { id: 'acciones', header: 'Acciones',
      cell: ({ row }) => (
        <IframeSheet
          src={`/admin/collections/inventory/${row.original.id}`}
          buttonText="Editar"
          title="Editando Inventario"
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