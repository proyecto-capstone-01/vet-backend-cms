'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { usePets } from '@/hooks/usePets'
import { GenericDataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface MascotasContentProps {
  initialData: any[]
}

export default function MascotasContent({ initialData }: MascotasContentProps) {
  const { data, loading, handleDelete } = usePets(initialData)

  const columns: ColumnDef<any, any>[] = [
    { accessorKey: 'name', header: 'Nombre' },
    {
      accessorKey: 'microchipNumber',
      header: 'Microchip',
      cell: ({ row }) => row.original?.microchipNumber ?? 'N/A',
    },
    {
      accessorKey: 'species',
      header: 'Especie',
      cell: ({ row }) =>
        row.original?.species === 'dog'
          ? 'Perro'
          : row.original?.species === 'cat'
            ? 'Gato'
            : 'N/A',
    },
    { accessorKey: 'breed', header: 'Raza', cell: ({ row }) => row.original?.breed ?? 'N/A' },
    {
      accessorKey: 'sex',
      header: 'Sexo',
      cell: ({ row }) =>
        row.original?.sex === 'male' ? 'Macho' : row.original?.sex === 'female' ? 'Hembra' : 'N/A',
    },
    { accessorKey: 'color', header: 'Color', cell: ({ row }) => row.original?.color ?? 'N/A' },
    {
      id: 'owner',
      header: 'Dueño',
      accessorFn: (row) =>
        `${(row as any).owner?.firstName ?? ''} ${(row as any).owner?.lastName ?? ''}`.trim(),
    },
    {
      id: 'size',
      header: 'Peso',
      cell: ({ row }) => {
        const weight = (row.original as any).weight
        return weight ? `${weight} kg` : 'N/A'
      },
    },
    {
      id: 'height',
      header: 'Altura',
      cell: ({ row }) => {
        const height = (row.original as any).height
        return height ? `${height} cm` : 'N/A'
      },
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
            href={`/dashboard/mascotas/${row.original?.id}`}
          >
            Historial
          </Link>
        </Button>
      ),
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <GenericDataTable columns={columns} data={data} title="Registro de Mascotas" />
    </div>
  )
}
