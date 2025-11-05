'use client'

import { useOwners } from '@/hooks/useOwners'
import { GenericDataTable } from '@/components/DataTable'
import { StatCard } from '@/components/StatCard'
import { Button } from '@/components/ui/button'
import type { ColumnDef } from '@tanstack/react-table'

interface ClientesContentProps {
  initialData: any[]
}

export default function ClientesContent({ initialData }: ClientesContentProps) {
  const { data, loading, handleDelete } = useOwners(initialData)

  const columns: ColumnDef<any, any>[] = [
    { accessorKey: 'firstName', header: 'Nombre' },
    { accessorKey: 'lastName', header: 'Apellido' },
    { accessorKey: 'rut', header: 'Rut' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'phoneNumber', header: 'Teléfono' },
    { accessorKey: 'address', header: 'Dirección' },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => handleDelete(row.original?.id)}
          disabled={loading}
        >
          Eliminar
        </Button>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <StatCard title="Total Clientes" value={data.length} description={''} />
      <GenericDataTable 
        columns={columns}
        data={data}
        title="Lista de Clientes"
      />
    </div>
  )
}