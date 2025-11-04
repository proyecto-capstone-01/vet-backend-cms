'use client'

import { GenericDataTable } from '@/components/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

// Definir el tipo de datos
interface Mascota {
  nombreMascota: string
  nombreDueno: string
  rutDueno: string
  edad: number
  peso: number
  raza: string
}

// Datos de ejemplo
const mascotas: Mascota[] = [
  {
    nombreMascota: 'Firulais',
    nombreDueno: 'Juan Pérez',
    rutDueno: '12.345.678-9',
    edad: 5,
    peso: 12.3,
    raza: 'Beagle',
  },
  {
    nombreMascota: 'Misha',
    nombreDueno: 'Camila Soto',
    rutDueno: '20.111.222-3',
    edad: 3,
    peso: 4.5,
    raza: 'Gato Siamés',
  },
  {
    nombreMascota: 'Rocky',
    nombreDueno: 'Carlos López',
    rutDueno: '18.777.555-2',
    edad: 7,
    peso: 25.1,
    raza: 'Labrador Retriever',
  },
]

// Definir las columnas
const columns: ColumnDef<Mascota>[] = [
  {
    accessorKey: 'nombreMascota',
    header: 'Nombre Mascota',
  },
  {
    accessorKey: 'nombreDueno',
    header: 'Nombre Dueño',
  },
  {
    accessorKey: 'rutDueno',
    header: 'RUT Dueño',
  },
  {
    accessorKey: 'edad',
    header: 'Edad (años)',
    cell: ({ row }) => `${row.original.edad} años`,
  },
  {
    accessorKey: 'peso',
    header: 'Peso (kg)',
    cell: ({ row }) => `${row.original.peso.toFixed(1)} kg`,
  },
  {
    accessorKey: 'raza',
    header: 'Raza',
  },
  {
    id: 'actions',
    header: 'Acción',
    cell: ({ row }) => {
      const router = useRouter()
      return (
        <Button
          variant="default"
          size="sm"
          onClick={() =>
            router.push(`/dashboard/mascotas/${row.original.nombreMascota.toLowerCase()}`)
          }
        >
          Ver mascota
        </Button>
      )
    },
  },
]

export default function MascotasPage() {
  return (
    <div className="p-6">
      <GenericDataTable
        columns={columns}
        data={mascotas}
        title="Mascotas registradas"
        enableSearch={true}
      />
    </div>
  )
}