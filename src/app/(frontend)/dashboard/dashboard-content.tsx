'use client'

import { useAppointments } from '@/hooks/useAppointments'
import { GenericDataTable } from '@/components/DataTable'
import { StatCard } from '@/components/StatCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { toast } from 'sonner'

interface DashboardContentProps {
  initialData: any[]
}

export default function DashboardContent({ initialData }: DashboardContentProps) {
  const { data, loading, handleConfirm, handleReject } = useAppointments(initialData)
  const [processingId, setProcessingId] = useState<string | null>(null)

  const handleConfirmClick = async (id: string) => {
    setProcessingId(id)
    try {
      await handleConfirm(id)
      toast.success('Cita confirmada')
    } catch (err) {
      toast.error('Error al confirmar cita')
    } finally {
      setProcessingId(null)
    }
  }

  const handleRejectClick = async (id: string) => {
    setProcessingId(id)
    try {
      await handleReject(id)
      toast.success('Cita rechazada')
    } catch (err) {
      toast.error('Error al rechazar cita')
    } finally {
      setProcessingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'Completado': 'bg-green-100 text-green-800',
      'Cancelado': 'bg-red-100 text-red-800',
    }
    return variants[status] || variants['Pendiente']
  }

  const baseColumns: ColumnDef<any, any>[] = [
    { accessorKey: 'nombre', header: 'Mascota' },
    { accessorKey: 'tipo', header: 'Tipo' },
    { accessorKey: 'servicio', header: 'Servicio' },
    { accessorKey: 'fecha', header: 'Fecha' },
    { accessorKey: 'hora', header: 'Hora' },
    { accessorKey: 'total', header: 'Total' },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: ({ getValue }) => {
        const value = getValue<string>()
        return <Badge className={getStatusBadge(value)}>{value}</Badge>
      },
    },
    { accessorKey: 'dueño', header: 'Dueño' },
  ]

  const confirmColumns: ColumnDef<any, any>[] = [
    ...baseColumns,
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => {
        const original = row.original as any
        const isProcessing = processingId === original.id
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={() => handleConfirmClick(original.id)}
              disabled={original.estado !== 'Pendiente' || loading || isProcessing}
            >
              {isProcessing ? 'Confirmando...' : 'Confirmar'}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleRejectClick(original.id)}
              disabled={original.estado !== 'Pendiente' || loading || isProcessing}
            >
              {isProcessing ? 'Rechazando...' : 'Rechazar'}
            </Button>
          </div>
        )
      },
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
          value={horasPendientes.length.toString()}
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