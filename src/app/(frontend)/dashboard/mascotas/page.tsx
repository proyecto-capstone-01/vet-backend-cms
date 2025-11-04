'use client'

import { useRouter } from 'next/navigation'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { GenericDataTable } from '@/components/DataTable'

const MASCOTAS = [
  {
    id: 1,
    nombre: 'Rex',
    especie: 'Perro',
    raza: 'Golden Retriever',
    edad: 5,
    peso: '32 kg',
    propietario: 'Juan Pérez',
    telefonoPropietario: '+56 9 1234 5678',
    microchip: '985001234567890',
    ultimaVisita: '2025-10-15',
  },
  {
    id: 2,
    nombre: 'Michi',
    especie: 'Gato',
    raza: 'Persa',
    edad: 3,
    peso: '4.5 kg',
    propietario: 'María González',
    telefonoPropietario: '+56 9 8765 4321',
    microchip: '985001234567891',
    ultimaVisita: '2025-09-20',
  },
]

export default function MascotasPage() {
  const router = useRouter()

  const columns: ColumnDef<(typeof MASCOTAS)[number]>[] = [
    { accessorKey: 'nombre', header: 'Nombre' },
    { accessorKey: 'especie', header: 'Especie' },
    { accessorKey: 'raza', header: 'Raza' },
    { accessorKey: 'edad', header: 'Edad (años)' },
    { accessorKey: 'peso', header: 'Peso' },
    { accessorKey: 'propietario', header: 'Propietario' },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/mascotas/${row.original.id}`)}
        >
          Ver perfil
        </Button>
      ),
    },
  ]

  return (
    <div className="p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Mascotas</h1>

      <GenericDataTable columns={columns} data={MASCOTAS} title="Listado de Mascotas" />
    </div>
  )
}