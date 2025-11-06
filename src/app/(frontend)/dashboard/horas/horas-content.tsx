'use client'

import { useAppointments } from '@/hooks/useAppointments'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { format, startOfWeek, addDays} from 'date-fns'
import { es } from 'date-fns/locale'

interface HorasContentProps {
  initialData: any[]
}

export default function HorasContent({ initialData }: HorasContentProps) {
  const { data} = useAppointments(initialData)
  const [selectedWeekStart, setSelectedWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(selectedWeekStart, i))

  const getAppointmentsByDay = (dayDate: Date) => {
    const dayString = format(dayDate, 'yyyy-MM-dd')

    const filtered = data
      .filter((apt) => {
        let fechaStr = apt.fecha

        if (apt.fecha instanceof Date) {
          fechaStr = format(apt.fecha, 'yyyy-MM-dd')
        }
        else if (typeof apt.fecha === 'number') {
          fechaStr = format(new Date(apt.fecha), 'yyyy-MM-dd')
        }
        else if (typeof apt.fecha === 'string' && apt.fecha.includes('T')) {
          fechaStr = apt.fecha.split('T')[0]
        }

        const matches = fechaStr === dayString
        if (matches) {
          console.log('Coincidencia encontrada:', apt.nombre, 'fecha:', fechaStr)
        }
        return matches
      })
      .sort((a, b) => a.hora.localeCompare(b.hora))

    console.log(`Citas encontradas para ${dayString}:`, filtered.length)
    return filtered
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      Pendiente: 'bg-yellow-100 text-yellow-800',
      Completado: 'bg-green-100 text-green-800',
      Cancelado: 'bg-red-100 text-red-800',
    }
    return variants[status] || variants['Pendiente']
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const appointments = getAppointmentsByDay(day)
          const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')

          return (
            <Card
              key={format(day, 'yyyy-MM-dd')}
              className={`p-4 min-h-96 overflow-y-auto ${isToday ? 'border-blue-500 border-2 bg-blue-50' : ''}`}
            >
              <h3
                className={`font-bold text-center mb-4 sticky top-0 ${isToday ? 'text-blue-600' : ''}`}
              >
                {format(day, 'EEE', { locale: es })}
                <br />
                <span className="text-sm">{format(day, 'dd/MM')}</span>
              </h3>

              <div className="space-y-3">
                {appointments.length > 0 ? (
                  appointments.map((apt) => (
                    <div
                      key={apt.id}
                      className={`border rounded-lg p-3 text-sm space-y-2 ${
                        apt.estado === 'Completado'
                          ? 'bg-green-50 border-green-200'
                          : apt.estado === 'Cancelado'
                            ? 'bg-red-50 border-red-200'
                            : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="font-semibold text-blue-600">{apt.hora}</div>
                        <Badge className={getStatusBadge(apt.estado)}>{apt.estado}</Badge>
                      </div>
                      <div>
                        <div className="font-medium">{apt.nombre}</div>
                        <div className="text-gray-600 text-xs">{apt.tipo}</div>
                        <div className="text-gray-600 text-xs">{apt.servicio}</div>
                        <div className="text-gray-600 text-xs">Dueño: {apt.dueño}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 text-sm pt-8">Sin citas</div>
                )}
              </div>
            </Card>
          )
        })}
      </div>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => setSelectedWeekStart(addDays(selectedWeekStart, -7))}
        >
          ← Semana Anterior
        </Button>
        <Button variant="outline" onClick={() => setSelectedWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}>
          Hoy
        </Button>
        <Button
          variant="outline"
          onClick={() => setSelectedWeekStart(addDays(selectedWeekStart, 7))}
        >
          Próxima Semana →
        </Button>
      </div>
    </div>
  )
}