'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'


export function CreateScheduleButton({ dow, disabled }: { dow: string; disabled: boolean }) {
  const [open, setOpen] = useState(false)
  const [start, setStart] = useState('08:00')
  const [end, setEnd] = useState('18:00')
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled}>Crear horario</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear horario</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 items-center">
            <Label>Hora de apertura</Label>
            <Input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
            <Label>Hora de cierre</Label>
            <Input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={async () => {
              const res = await fetch('/schedule/hours', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  dayOfWeek: dow,
                  startTime: start, // send HH:mm string
                  endTime: end,     // send HH:mm string
                }),
              })
              if (res.ok) {
                location.reload()
              } else {
                const t = await res.text()
              }
            }}
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function SlotPill({
  time,
  available,
  dow,
  dateISO,
}: {
  time: string
  available: boolean
  dow: string
  dateISO: string
}) {
  return (
    <div
      className={`flex items-center justify-between border px-2 py-1 text-sm 
      ${available ? 'bg-green-50 border-green-200 dark:bg-gray-600 dark:border-gray-300' : 'bg-red-50 border-red-200 dark:bg-gray-600 dark:border-red-300'}`
    }
    >
      <span>{time}</span>
      {/*<Button*/}
      {/*  variant="ghost"*/}
      {/*  size="sm"*/}
      {/*  onClick={async () => {*/}
      {/*    // toggle block: if available -> create block; if not available -> remove block*/}
      {/*    const url = '/schedule/blocks'*/}
      {/*    const payload = { date: dateISO, time }*/}
      {/*    const res = await fetch(url, {*/}
      {/*      method: available ? 'POST' : 'DELETE',*/}
      {/*      headers: { 'Content-Type': 'application/json' },*/}
      {/*      body: JSON.stringify(payload),*/}
      {/*    })*/}
      {/*    if (res.ok) location.reload()*/}
      {/*  }}*/}
      {/*>*/}
      {/*  {available ? 'Bloquear' : 'Desbloquear'}*/}
      {/*</Button>*/}
    </div>
  )
}

export function CloseDayButton({ dateISO }: { dateISO: string }) {
  return (
    <Button
      variant="secondary"
      onClick={async () => {
        const res = await fetch('/schedule/closed-days', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: dateISO }),
        })
        if (res.ok) location.reload()
      }}
    >
      Marcar día cerrado
    </Button>
  )
}
