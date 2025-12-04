'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CreateScheduleButton, SlotPill, CloseDayButton } from '@/app/(frontend)/dashboard/horas/horarios/actions'
import { DateTime } from 'luxon'
import { TZ, isoTimeToHHmm, weekdaySlug, generateHalfHourSlots } from '@/lib/timezone'
import * as timezoneFns from '@/lib/timezone'

// Labels for days (index 0 => Monday)
const dayLabels = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

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

  // Start of current week (Monday) in Chile timezone
  const today = DateTime.now().setZone(TZ)
  const weekStart = today.minus({ days: today.weekday - 1 }).startOf('day') // weekday: 1=Mon ... 7=Sun

  const dayData = Array.from({ length: 7 }).map((_, idx) => {
    const date = weekStart.plus({ days: idx })
    const dateKey = date.toFormat('yyyy-MM-dd')
    const dowSlug = weekdaySlug(date)
    const h = (hours as any[]).find((x) => x.dayOfWeek === dowSlug)
    const closed = (closedDays as any[]).some((d) => {
      const cd = DateTime.fromISO(d.date, { zone: TZ })
      return cd.toFormat('yyyy-MM-dd') === dateKey
    })

    let slots: string[] = []
    if (h && !closed) {
      const openISO = h.startTime
      const closeISO = h.endTime
      if (openISO && closeISO) {
        const genFn: any = (timezoneFns as any).generateHalfHourSlotsForDate || ((localISO: string, o: string, c: string) => generateHalfHourSlots(o, c))
        slots = genFn(date.toISO()!, openISO, closeISO)
      }
    }

    const blockedSet = new Set(
      (blockedSlots as any[])
        .filter((b) => {
          const bd = DateTime.fromISO(b.date, { zone: TZ })
          return bd.toFormat('yyyy-MM-dd') === dateKey
        })
        .map((b) => isoTimeToHHmm(b.time))
    )

    const displaySlots = slots.map((s) => ({ time: s, available: !blockedSet.has(s) }))

    return {
      idx,
      date,
      dow: dowSlug,
      closed,
      h,
      slots: displaySlots,
    }
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
                  {d.date.setLocale('es').toFormat("d 'de' MMMM")}
                </div>
              </div>
              {d.h ? (
                <span className="text-sm text-muted-foreground dark:text-muted-foreground">
                  {isoTimeToHHmm(d.h.startTime)} - {isoTimeToHHmm(d.h.endTime)}
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
                      dateISO={d.date.toISO()!}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <CloseDayButton dateISO={d.date.toISO()!} />
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
