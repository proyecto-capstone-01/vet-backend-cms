'use client'

import { useBusinessHours } from '@/hooks/useBusinessHours'
import { GenericDataTable } from '@/components/DataTable'
import { StatCard } from '@/components/StatCard'
import { Button } from '@/components/ui/button'
import type { ColumnDef } from '@tanstack/react-table'

interface HorasContentProps {
  initialData: any[]
}

export default function HorasContent({ initialData }: HorasContentProps) {
  const { data, loading, handleDelete } = useBusinessHours(initialData)

  const columns: ColumnDef<any, any>[] = [
    { accessorKey: 'dia', header: 'Día' },
    { accessorKey: 'horario_apertura', header: 'Apertura' },
    { accessorKey: 'horario_cierre', header: 'Cierre' },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }: any) => (
        <Button 
          size="sm" 
          variant="destructive"
          onClick={() => handleDelete(row.original.id)}
          disabled={loading}
        >
          Eliminar
        </Button>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <StatCard title="Total Horarios" value={data.length} description={''} />
      <GenericDataTable 
        columns={columns as ColumnDef<unknown, any>[]}
        data={data}
        title="Horarios de Atención"
      />
    </div>
  )
}