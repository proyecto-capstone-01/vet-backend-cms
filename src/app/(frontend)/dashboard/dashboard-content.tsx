'use client'

import { useAppointments } from '@/hooks/useAppointments'
import { GenericDataTable } from '@/components/DataTable'
import { StatCard } from '@/components/StatCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ColumnDef } from '@tanstack/react-table'
import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
} from '@/components/ui/dialog'

interface DashboardContentProps {
  initialData: any[]
}

// Helpers using raw English fields
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  const day = String(localDate.getDate()).padStart(2, '0')
  const month = String(localDate.getMonth() + 1).padStart(2, '0')
  const year = localDate.getFullYear()
  return `${day}-${month}-${year}`
}

const getDateOnly = (dateString: string): Date => {
  const date = new Date(dateString)
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate())
}

const isToday = (dateString: string): boolean => {
  const appointmentDate = getDateOnly(dateString)
  const today = new Date()
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return appointmentDate.getTime() === todayDate.getTime()
}

const statusToSpanish: Record<string,string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  completed: 'Completado',
  canceled: 'Cancelado',
}

const spanishToStatus: Record<string,string> = {
  'Pendiente': 'pending',
  'Confirmado': 'confirmed',
  'Completado': 'completed',
  'Cancelado': 'canceled',
}

const speciesToSpanish: Record<string,string> = {
  dog: 'Perro',
  cat: 'Gato',
}

function formatTime(iso: string) {
  try {
    const d = new Date(iso)
    const hh = String(d.getUTCHours()).padStart(2,'0')
    const mm = String(d.getUTCMinutes()).padStart(2,'0')
    return `${hh}:${mm}`
  } catch { return '' }
}

export default function DashboardContent({ initialData }: DashboardContentProps) {
  const { data, loading, handleConfirm, handleReject } = useAppointments(initialData)

  const [processingId, setProcessingId] = useState<string | null>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null)
  const [open, setOpen] = useState(false)

  // Build UI table data from raw documents (english field names)
  const tableData = useMemo(() => {
    return (data || []).map((doc: any) => {
      const pet = typeof doc.pet === 'object' ? doc.pet : null
      const owner = pet && typeof pet.owner === 'object' ? pet.owner : null
      const services = Array.isArray(doc.services) ? doc.services : []
      const firstServiceTitle = services[0] && typeof services[0] === 'object' ? services[0].title : undefined
      return {
        id: doc.id?.toString?.() ?? doc.id,
        fecha: doc.date,
        hora: doc.time ? formatTime(doc.time) : '',
        estado: statusToSpanish[doc.status] || 'Pendiente',
        nombre: pet?.name || 'Mascota',
        tipo: speciesToSpanish[pet?.species || ''] || pet?.species || '',
        servicio: firstServiceTitle || `${services.length} servicio(s)`,
        total: services.length.toString(),
        dueno: owner ? `${owner.firstName} ${owner.lastName}` : '',
        rawStatus: doc.status,
      }
    })
  }, [data])

  const handleConfirmClick = async (id: string) => {
    setProcessingId(id)
    try {
      await handleConfirm(id) // sets status to completed internally
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
      await handleReject(id) // sets status to canceled internally
      toast.success('Cita rechazada')
    } catch (err) {
      toast.error('Error al rechazar cita')
    } finally {
      setProcessingId(null)
    }
  }

  const handleRemoveService = (index: number) => {
    if (!selectedAppointment) return

    const updated = {
      ...selectedAppointment,
      servicios: selectedAppointment.servicios?.filter((_: any, i: number) => i !== index) || []
    }

    setSelectedAppointment(updated)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'Completado': 'bg-green-100 text-green-800',
      'Cancelado': 'bg-red-100 text-red-800',
      'Confirmado': 'bg-blue-100 text-blue-800',
    }
    return variants[status] || variants['Pendiente']
  }

  const baseColumns: ColumnDef<any, any>[] = [
    { accessorKey: 'nombre', header: 'Mascota' },
    { accessorKey: 'tipo', header: 'Tipo' },
    { accessorKey: 'servicio', header: 'Servicio' },
    {
      accessorKey: 'fecha',
      header: 'Fecha',
      cell: ({ getValue }) => formatDate(getValue<string>()),
    },
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
    { accessorKey: 'dueño.nombre', header: 'Dueño' },
  ]

  const confirmColumns: ColumnDef<any, any>[] = [
    ...baseColumns,
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => {
        const original = row.original
        const isProcessing = processingId === original.id

        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setSelectedAppointment(original)
                setOpen(true)
              }}
            >
              Ver Detalles
            </Button>
          </div>
        )
      },
    },
  ]

  const datosHoy = data.filter((item) => isToday(item.fecha))
  const horasConfirmadas = datosHoy.filter((i) => i.estado !== 'Pendiente')
  const horasPendientes = datosHoy.filter((i) => i.estado === 'Pendiente')

  const totalServicios =
    selectedAppointment?.servicios?.reduce(
      (acc: number, item: any) => acc + item.precio,
      0
    ) || 0

  return (
    <div className="@container/main flex flex-1 flex-col gap-6 py-6 px-4 md:px-6">

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
          <h2 className="text-xl font-semibold">Detalles de la Cita</h2>
          </DialogHeader>

          {selectedAppointment && (
            <div className="flex flex-col gap-4">

              <div className="border rounded-lg p-4 space-y-1">
                <p><strong>Mascota:</strong> {selectedAppointment.nombre}</p>
                <p><strong>Tipo:</strong> {selectedAppointment.tipo}</p>
                <p><strong>Fecha:</strong> {formatDate(selectedAppointment.fecha)}</p>
                <p><strong>Hora:</strong> {selectedAppointment.hora}</p>
                <hr />
                <p><strong>Dueño:</strong> {selectedAppointment.dueño?.nombre}</p>
                <p><strong>RUT:</strong> {selectedAppointment.dueño?.rut}</p>
                <p><strong>Teléfono:</strong> {selectedAppointment.dueño?.telefono}</p>
                <p><strong>Email:</strong> {selectedAppointment.dueño?.email}</p>
              </div>

              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold">Servicios</h3>

                {selectedAppointment.servicios?.map((servicio: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <span>{servicio.nombre} — ${servicio.precio}</span>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveService(index)}
                    >
                      Quitar
                    </Button>
                  </div>
                ))}

                <p className="text-right font-semibold mt-2">
                  Total: ${totalServicios}
                </p>
              </div>

              <DialogFooter>
                <Button
                  onClick={() => {
                    handleConfirmClick(selectedAppointment.id)
                    setOpen(false)
                  }}
                >
                  Confirmar Hora
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => {
                    handleRejectClick(selectedAppointment.id)
                    setOpen(false)
                  }}
                >
                  Rechazar
                </Button>
              </DialogFooter>

            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 mb-4">
        <StatCard
          title="Horas Agendadas Hoy"
          description="Total de horas agendadas para hoy"
          value={datosHoy.length.toString()}
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