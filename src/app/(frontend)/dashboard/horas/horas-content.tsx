'use client'

import { useAppointments } from '@/hooks/useAppointments'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns'
import { es } from 'date-fns/locale'

interface HorasContentProps {
  initialData: any[]
}

export default function HorasContent({ initialData }: HorasContentProps) {
  const { data } = useAppointments(initialData)
  const [selectedWeekStart, setSelectedWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week')

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(selectedWeekStart, i))

  const monthDays = eachDayOfInterval({
    start: startOfWeek(startOfMonth(selectedMonth), { weekStartsOn: 1 }),
    end: endOfMonth(selectedMonth),
  })

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

  const renderAppointmentItem = (apt: any) => (
    <div
      key={apt.id}
      className={`border rounded-lg p-2 text-xs space-y-1 ${
        apt.estado === 'Completado'
          ? 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700'
          : apt.estado === 'Cancelado'
            ? 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700'
            : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="flex justify-between items-start gap-1">
        <div className="font-semibold text-blue-600 dark:text-blue-400">{apt.hora}</div>
        <Badge className={`${getStatusBadge(apt.estado)} text-xs py-0`}>{apt.estado}</Badge>
      </div>
      <div>
        <div className="font-medium text-black dark:text-white">{apt.nombre}</div>
        <div className="text-gray-600 dark:text-gray-300">{apt.tipo}</div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* View Toggle Buttons */}
      <div className="flex gap-2">
        <Button
          variant={viewMode === 'month' ? 'default' : 'outline'}
          onClick={() => setViewMode('month')}
        >
          Vista Mensual
        </Button>
        <Button
          variant={viewMode === 'week' ? 'default' : 'outline'}
          onClick={() => setViewMode('week')}
        >
          Vista Semanal
        </Button>
      </div>

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="space-y-4">
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
                      appointments.map(renderAppointmentItem)
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
      )}

      {/* Month View */}
      {viewMode === 'month' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {format(selectedMonth, 'MMMM yyyy', { locale: es })}
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1))}
              >
                ← Mes Anterior
              </Button>
              <Button variant="outline" onClick={() => setSelectedMonth(new Date())}>
                Hoy
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
              >
                Próximo Mes →
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab', 'Dom'].map((day) => (
              <div key={day} className="text-center font-bold text-gray-600 py-2">
                {day}
              </div>
            ))}

            {/* Calendar days */}
              {monthDays.map((day) => {
              const appointments = getAppointmentsByDay(day)
              const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
              const isCurrentMonth = isSameMonth(day, selectedMonth)

              return (
                <Card
                  key={format(day, 'yyyy-MM-dd')}
                  className={`p-2 min-h-28 overflow-y-auto ${
                    !isCurrentMonth 
                      ? 'bg-gray-50 dark:bg-gray-900' 
                      : isToday 
                        ? 'border-blue-500 border-2 bg-blue-50 dark:bg-blue-950' 
                        : 'bg-white dark:bg-slate-950'
                  }`}
                >
                  <div className={`font-bold mb-2 ${isToday ? 'text-blue-600 dark:text-blue-400' : isCurrentMonth ? 'text-black dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {appointments.slice(0, 2).map(renderAppointmentItem)}
                    {appointments.length > 2 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold px-2">
                        +{appointments.length - 2} más
                      </div>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}