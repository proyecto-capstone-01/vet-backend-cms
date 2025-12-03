'use client'

import { useOwners } from '@/hooks/useOwners'
import { GenericDataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import type { ColumnDef } from '@tanstack/react-table'
import { formatRUT } from '@/lib/utils'
import Link from 'next/link'

interface ClientesContentProps {
  initialData: any[]
}

export default function ClientesContent({ initialData }: ClientesContentProps) {
  const { data, loading, handleDelete } = useOwners(initialData)

  const columns: ColumnDef<any, any>[] = [
    { accessorKey: 'firstName', header: 'Nombre' },
    { accessorKey: 'lastName', header: 'Apellido' },
    { accessorKey: 'rut', header: 'Rut',
    cell: ({ row }) => {
      const rut = row.original?.rut
      return rut ? formatRUT(rut) : 'N/A'
    }
    },
    { accessorKey: 'email', header: 'Email',
    cell: ({ row }) => {
      const email = row.original?.email
      return email ? email : 'N/A'
    }
    },
    { accessorKey: 'phoneNumber', header: 'Teléfono' },
    { accessorKey: 'address', header: 'Dirección',
    cell: ({ row }) => {
      const address = row.original?.address
      return address ? address : 'N/A'
    }
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="outline"
          disabled={loading}
          asChild
        >
          <Link
            href={`/dashboard/clientes/${row.original?.id}`}
          >
            Historial
          </Link>
        </Button>
      )
    }
  ]

  return (
    <div className="p-6 space-y-6">
      <GenericDataTable 
        columns={columns}
        data={data}
        title="Registro de Clientes"
      />
    </div>
  )
}