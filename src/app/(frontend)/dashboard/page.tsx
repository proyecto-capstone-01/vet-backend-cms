'use client'

import { useState } from 'react'
import { GenericDataTable } from '@/components/DataTable'
import { StatCard } from '@/components/StatCard'
import { Button } from '@/components/ui/button'
import dataFile from './data.json'

export default function DashboardPage() {
  const [data, setData] = useState(dataFile)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completado':
        return (
          <div className="border w-fit px-2 py-1 flex items-center gap-1 text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Completado
          </div>
        )
      case 'Cancelado':
        return (
          <div className="border w-fit px-2 py-1 flex items-center gap-1 text-sm">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            Cancelado
          </div>
        )
      default:
        return (
          <div className="border w-fit px-2 py-1 flex items-center gap-1 text-sm">
            <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
            Pendiente
          </div>
        )
    }
  }

  // Cambiar estado de una cita
  const handleConfirm = (rowId: number) => {
    setData((prev) =>
      prev.map((item, index) => (index === rowId ? { ...item, estado: 'Completado' } : item)),
    )
  }

  const handleReject = (rowId: number) => {
    setData((prev) =>
      prev.map((item, index) => (index === rowId ? { ...item, estado: 'Cancelado' } : item)),
    )
  }

  const baseColumns = [
    { header: 'Mascota', accessorKey: 'nombre' },
    { header: 'Tipo', accessorKey: 'tipo' },
    { header: 'Servicio', accessorKey: 'servicio' },
    { header: 'Fecha', accessorKey: 'fecha' },
    { header: 'Hora', accessorKey: 'hora' },
    {
      header: 'Total',
      accessorKey: 'total',
    },
    {
      header: 'Estado',
      accessorKey: 'estado',
      cell: ({ row }: any) => getStatusBadge(row.original.estado),
    },
    { header: 'Dueño', accessorKey: 'dueño' },
  ]

  const confirmColumns = [
    ...baseColumns,
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="default" onClick={() => handleConfirm(row.index)}>
            Confirmar
          </Button>
          <Button size="sm" variant="destructive" onClick={() => handleReject(row.index)}>
            Rechazar
          </Button>
        </div>
      ),
    },
  ]

  const horasConfirmadas = data.filter(
    (item) => item.estado === 'Completado' || item.estado === 'Cancelado',
  )
  const horasPendientes = data.filter((item) => item.estado === 'Pendiente')

  return (
    <div className="@container/main flex flex-1 flex-col gap-6 py-6 px-4 md:px-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 mb-4">
        <StatCard
          title="Horas Agendadas Hoy"
          description="Total de horas agendadas para hoy"
          value={data.length.toString()}
        />
        <StatCard
          title="Servicios Completados"
          description="Total de servicios completados hoy"
          value={horasConfirmadas.filter((i) => i.estado === 'Completado').length.toString()}
        />
        <StatCard
          title="Servicios Cancelados"
          description="Total de servicios cancelados hoy"
          value={horasConfirmadas.filter((i) => i.estado === 'Cancelado').length.toString()}
        />
        <StatCard
          title="Horas para confirmar"
          description="Total de horas pendientes por confirmar"
          value={horasConfirmadas.filter((i) => i.estado === 'Cancelado').length.toString()}
        />
      </div>

      <GenericDataTable
        columns={baseColumns}
        data={horasConfirmadas}
        pageSizeOptions={[5, 10, 20]}
        title="Horas para hoy"
      />

      <GenericDataTable
        columns={confirmColumns}
        data={horasPendientes}
        pageSizeOptions={[5, 10, 20]}
        title="Horas para confirmar"
      />
    </div>
  )
}
