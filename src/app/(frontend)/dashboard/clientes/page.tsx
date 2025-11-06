// app/clientes/page.tsx
'use client'

import { useRouter } from 'next/navigation'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { GenericDataTable } from '@/components/DataTable'

// Ejemplo de datos simulados (reemplaza con fetch o axios)
const CLIENTES = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    rut: '12.345.678-9',
    telefono: '+56 9 1234 5678',
    email: 'juan@example.com',
    direccion: 'Av. Siempre Viva 742',
  },
  {
    id: 2,
    nombre: 'María González',
    rut: '9.876.543-2',
    telefono: '+56 9 8765 4321',
    email: 'maria@example.com',
    direccion: 'Calle Falsa 123',
  },
]

export default function ClientesPage() {
  const router = useRouter()

  const columns: ColumnDef<(typeof CLIENTES)[number]>[] = [
    { accessorKey: 'nombre', header: 'Nombre' },
    { accessorKey: 'rut', header: 'RUT' },
    { accessorKey: 'telefono', header: 'Teléfono' },
    { accessorKey: 'email', header: 'Email' },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/clientes/${row.original.id}`)}
        >
          Ver perfil
        </Button>
      ),
    },
  ]

  return (
    <div className="p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Clientes</h1>

      <GenericDataTable columns={columns} data={CLIENTES} title="Listado de Clientes" />
    </div>
  )
}
