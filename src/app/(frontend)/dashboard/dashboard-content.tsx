'use client'

import { useAppointments } from '@/hooks/useAppointments'
import { GenericDataTable } from '@/components/DataTable'
import { StatCard } from '@/components/StatCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ColumnDef } from '@tanstack/react-table'
import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogHeader, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { DateTime } from 'luxon'
import { TZ, isoTimeToHHmm } from '@/lib/timezone'
import type { Appointment, Service } from '@/payload-types'


// Helpers using raw English fields
const formatDate = (dateString: string): string => {
  try {
    const dt = DateTime.fromISO(dateString).setZone(TZ)
    return dt.toFormat('dd-MM-yyyy')
  } catch {
    return ''
  }
}

const getDateOnly = (dateString: string): Date => {
  const date = new Date(dateString)
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate())
}

const isToday = (dateString: string): boolean => {
  const today = new Date()
  const dateToCheck = getDateOnly(dateString)
  return (
    dateToCheck.getFullYear() === today.getFullYear() &&
    dateToCheck.getMonth() === today.getMonth() &&
    dateToCheck.getDate() === today.getDate()
  )
}

const statusToSpanish: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  completed: 'Completado',
  canceled: 'Cancelado',
}

const speciesToSpanish: Record<string, string> = {
  dog: 'Perro',
  cat: 'Gato',
}

const formatRut = (rut: string): string => {
  // Simple RUT formatting: 12345678-9 -> 12.345.678-9
  const cleanRut = rut.replace(/\./g, '').replace('-', '')
  const body = cleanRut.slice(0, -1)
  const dv = cleanRut.slice(-1)
  const reversed = body.split('').reverse().join('')
  const chunks = []
  for (let i = 0; i < reversed.length; i += 3) {
    chunks.push(reversed.slice(i, i + 3))
  }
  const formattedBody = chunks
    .map((chunk) => chunk.split('').reverse().join(''))
    .reverse()
    .join('.')
  return `${formattedBody}-${dv}`
}

export default function DashboardContent({ initialData }: { initialData: Appointment[] }) {
  const { data, loading, handleConfirm, handleReject } = useAppointments(initialData)

  const [processingId, setProcessingId] = useState<number | null>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [open, setOpen] = useState(false)


  const tableData = useMemo(() => {
    try {
      return data.map((item) => ({
        ...item,
        estado: statusToSpanish[item.status] || 'Pendiente',
        tipo: item.pet ? speciesToSpanish[item.pet.species] || item.pet.species : '',
        servicio: item.services && item.services.length > 0 ? item.services[0].title : 'Sin servicio',
      }))
    } catch {
      return []
    }
  }, [data])

  const handleConfirmClick = async (id: number) => {
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

  const handleRejectClick = async (id: number) => {
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
      servicios: selectedAppointment.services?.filter((_: any, i: number) => i !== index) || [],
    }

    setSelectedAppointment(updated)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      Pendiente: 'bg-yellow-100 text-yellow-800',
      Completado: 'bg-green-100 text-green-800',
      Cancelado: 'bg-red-100 text-red-800',
      Confirmado: 'bg-blue-100 text-blue-800',
    }
    return variants[status] || variants['Pendiente']
  }

  const baseColumns: ColumnDef<any, any>[] = [
    { accessorKey: 'pet.name', header: 'Mascota' },
    { accessorKey: 'tipo', header: 'Tipo' },
    { accessorKey: 'servicio', header: 'Servicios' },
    {
      accessorKey: 'date',
      header: 'Fecha',
      cell: ({ getValue }) => formatDate(getValue<string>()),
    },
    { accessorKey: 'time', header: 'Hora',
    cell: ({ getValue }) => isoTimeToHHmm(getValue<string>()), },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: ({ getValue }) => {
        const value = getValue<string>()
        return <Badge className={getStatusBadge(value)}>{value}</Badge>
      },
    },
    { accessorKey: 'pet.owner.firstName', header: 'Dueño',
      cell: ({ row }) => {
        const owner = row.original.pet.owner
        return `${owner.firstName} ${owner.lastName}`
      }
    },
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

  const todayAppointments = tableData.filter((item) => isToday(item.date))

  const confirmedAppointments = todayAppointments.filter(
    (item) => item.estado === 'Confirmado' || item.estado === 'Completado' || item.estado === 'Cancelado'
  )
  const unconfirmedAppointments = todayAppointments.filter((item) => item.estado === 'Pendiente')

  // @ts-ignore
  const servicesTotalPrice: number | null = selectedAppointment ? selectedAppointment.services?.reduce((total, service) => total + (service.price || 0), 0) || 0 : null

  return (
    <div className="@container/main flex flex-1 flex-col gap-6 py-6 px-4 md:px-6">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="text-xl">Detalles de la cita</DialogHeader>
          {selectedAppointment && (
            <div className="flex flex-col gap-4">
              <div className="border rounded-lg p-4 space-y-1">
                <p>
                  {/* @ts-ignore */}
                  <strong>Mascota:</strong> {selectedAppointment.pet.name}
                </p>
                <p>
                  {/* @ts-ignore */}
                  <strong>Tipo:</strong> {(selectedAppointment.pet.species) in speciesToSpanish ? speciesToSpanish[selectedAppointment.pet.species] : selectedAppointment.pet.species}
                </p>
                <p>
                  <strong>Fecha:</strong> {formatDate(selectedAppointment.date)}
                </p>
                <p>
                  <strong>Hora:</strong> {isoTimeToHHmm(selectedAppointment.time)}
                </p>

                <hr />

                <p>
                  {/* @ts-ignore */}
                  <strong>Dueño:</strong> {selectedAppointment.pet.owner.firstName}{' '}
                  {/* @ts-ignore */}
                  {selectedAppointment.pet.owner.lastName}
                </p>
                <p>
                  {/* @ts-ignore */}
                  <strong>RUT:</strong> {formatRut(selectedAppointment.pet.owner.rut)}
                </p>
                <p>
                  {/* @ts-ignore */}
                  <strong>Teléfono:</strong> {selectedAppointment.pet.owner.phoneNumber}
                </p>
                <p>
                  {/* @ts-ignore */}
                  <strong>Email:</strong> {selectedAppointment.pet.owner.email}
                </p>
              </div>

              <div className="border rounded-lg p-4 space-y-2">
                <h3 className="font-semibold">Servicios</h3>

                {
                  //@ts-ignore
                  selectedAppointment.services.map((service: Service, index: number) => (
                    <div key={index} className="flex justify-between items-center border-b pb-2">
                      <span>
                        {service.title}
                        {service.price && (` - ${service.price.toLocaleString("es-CL", { currency: "CLP", style: "currency" })}`)}
                      </span>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveService(index)}
                      >
                        Quitar
                      </Button>
                    </div>
                  ))
                }

                {servicesTotalPrice && (
                  <p className="text-right font-semibold mt-2">
                    Total: {servicesTotalPrice.toLocaleString("es-CL", { currency: "CLP", style: "currency" })}
                  </p>
                )}
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
          value={todayAppointments.length.toString()}
        />
        <StatCard
          title="Servicios Completados"
          description="Total de servicios completados hoy"
          value={confirmedAppointments.filter((i) => i.estado === 'Completado').length.toString()}
        />
        <StatCard
          title="Servicios Cancelados"
          description="Total de servicios cancelados hoy"
          value={confirmedAppointments.filter((i) => i.estado === 'Cancelado').length.toString()}
        />
        <StatCard
          title="Horas para confirmar"
          description="Total de horas pendientes por confirmar"
          value={unconfirmedAppointments.length.toString()}
        />
      </div>

      <GenericDataTable
        columns={baseColumns}
        data={confirmedAppointments}
        pageSizeOptions={[5, 10, 20]}
        title="Horas Confirmadas"
      />

      <GenericDataTable
        columns={confirmColumns}
        data={unconfirmedAppointments}
        pageSizeOptions={[5, 10, 20]}
        title="Horas Sin Confirmar"
      />
    </div>
  )
}
