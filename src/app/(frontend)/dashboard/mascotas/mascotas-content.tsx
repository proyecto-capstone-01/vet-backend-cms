'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { usePets } from '@/hooks/usePets'
import { GenericDataTable } from '@/components/DataTable'
import { StatCard } from '@/components/StatCard'
import { Button } from '@/components/ui/button'

interface MascotasContentProps {
  initialData: any[]
}

export default function MascotasContent({ initialData }: MascotasContentProps) {
  const { data, loading, handleDelete } = usePets(initialData)
  const columns: ColumnDef<any, any>[] = [
    { accessorKey: 'name', header: 'Nombre' },
    { accessorKey: 'microchipNumber', header: 'Microchip' },
    { accessorKey: 'species', header: 'Especie' },
    { accessorKey: 'breed', header: 'Raza' },
    {
      id: 'dateOfBirth',
      header: 'Fecha de nacimiento',
      accessorFn: (row) =>
        (row as any).dateOfBirth
          ? new Date((row as any).dateOfBirth).toLocaleDateString()
          : ''
    },
    { accessorKey: 'sex', header: 'Sexo' },
    { accessorKey: 'color', header: 'Color' },
    {
      id: 'owner',
      header: 'Dueño',
      accessorFn: (row) =>
        (row as any).owner?.nameRutCombination ??
        `${(row as any).owner?.firstName ?? ''} ${(row as any).owner?.lastName ?? ''}`.trim()
    },
    {
      id: 'size',
      header: 'Peso / Altura',
      accessorFn: (row) =>
        `${(row as any).weight ?? ''}${(row as any).weight ? ' kg' : ''} / ${(row as any).height ?? ''}${(row as any).height ? ' cm' : ''}`
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => handleDelete((row.original as any).id)}
          disabled={loading}
        >
          Eliminar
        </Button>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <StatCard title="Total Mascotas" value={data.length} description={''} />
      <GenericDataTable 
        columns={columns}
        data={data}
        title="Lista de Mascotas"
      />
    </div>
  )
}