'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import { format, addMinutes, startOfWeek, addDays, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale/es'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CreateScheduleButton, SlotPill, CloseDayButton } from '@/app/(frontend)/dashboard/horas/horarios/actions'

// Next app router: mark this as a Server Component wrapper and embed small Client islands where needed

const dayLabels = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

function generateSlots(open: Date, close: Date) {
  const slots: string[] = []
  let cur = new Date(open)
  while (cur < close) {
    slots.push(format(cur, 'HH:mm'))
    cur = addMinutes(cur, 30)
  }
  return slots
}

function toTime(dateStr?: string | null) {
  return dateStr ? new Date(dateStr) : undefined
}

async function getSchedulingData() {
  const payload = await getPayload({ config })
  const [hours, closedDays, blockedSlots] = await Promise.all([
    payload.find({ collection: 'hours', limit: 1000 }),
    payload.find({ collection: 'closed-days', limit: 1000 }),
    payload.find({ collection: 'blocked-slots', limit: 1000 }),
  ])
  return { hours: hours.docs, closedDays: closedDays.docs, blockedSlots: blockedSlots.docs }
}

export default async function Horarios() {
  const { hours, closedDays, blockedSlots } = await getSchedulingData()

  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })

  const dayData = Array.from({ length: 7 }).map((_, idx) => {
    const date = addDays(weekStart, idx)
    const dow = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][idx]
    const h = hours.find((x: any) => x.dayOfWeek === dow)
    const closed = closedDays.some((d: any) => isSameDay(new Date(d.date), date))
    let slots: string[] = []
    if (h && !closed) {
      const open = toTime(h.startTime)
      const close = toTime(h.endTime)
      if (open && close) slots = generateSlots(open, close)
    }
    const blocked = new Set(
      blockedSlots
        .filter((b: any) => isSameDay(new Date(b.date), date))
        .map((b: any) => format(new Date(b.time), 'HH:mm')),
    )
    const displaySlots = slots.map((s) => ({ time: s, available: !blocked.has(s) }))
    return { idx, date, dow, closed, h, slots: displaySlots }
  })

  return (
    <div className="space-y-6 lg:px-6 px-3 py-3">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dayData.map((d) => (
          <Card key={d.idx} className="p-4 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-medium">{dayLabels[d.idx]}</div>
                <div className="text-sm text-muted-foreground">
                  {format(d.date, "d 'de' MMMM", { locale: es })}
                </div>
              </div>
              {d.h ? (
                <span className="text-sm text-muted-foreground dark:text-muted-foreground">
                  {format(new Date(d.h.startTime), 'HH:mm')} -{' '}
                  {format(new Date(d.h.endTime), 'HH:mm')}
                </span>
              ) : (
                <span className="text-sm text-muted-foreground">Sin horario</span>
              )}
            </div>
            <Separator />
            {!d.h || d.closed ? (
              <CreateScheduleButton dow={d.dow} disabled={d.closed} />
            ) : (
              <div className="space-y-3">
                {d.slots.length === 0 && (
                  <div className="text-sm text-muted-foreground">No hay bloques disponibles</div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {d.slots.map((s) => (
                    <SlotPill
                      key={s.time}
                      time={s.time}
                      available={s.available}
                      dow={d.dow}
                      dateISO={d.date.toISOString()}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <CloseDayButton dateISO={d.date.toISOString()} />
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

