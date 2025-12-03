'use client'

import { useState, useEffect } from 'react'
import type { Appointment } from '@/payload-types'
import { toast } from "sonner"

export function useAppointments(initialData: Appointment[] = []) {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setData(initialData)
  }, [initialData])

  const refetchAppointments = async () => {
    try {
      const response = await fetch('/api/appointments')
      if (response.ok) {
        const appointments = await response.json()
        setData(appointments.docs as Appointment[])
      }
    } catch (err) {
      console.error('Error refetching appointments:', err)
    }
  }

  const handleConfirm = async (id: number) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'confirmed' }),
      })
      if (response.ok) {
        setData(prev => prev.map(item => item.id === id ? { ...item, estado: 'Completado' } : item))
        await refetchAppointments()
        toast.success("Cita confirmada")
        return true
      } else {
        setError('Error al confirmar cita')
        toast.error("Error al confirmar cita")
        return false
      }
    } catch (err) {
      setError('Error de conexión')
      toast.error("Error de conexión")
      console.error(err)
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async (id: number) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'canceled' }),
      })
      if (response.ok) {
        setData(prev => prev.map(item => item.id === id ? { ...item, estado: 'Cancelado' } : item))
        await refetchAppointments()
        toast.success("Cita rechazada")
        return true
      } else {
        setError('Error al rechazar cita')
        toast.error("Error al rechazar cita")
        return false
      }
    } catch (err) {
      setError('Error de conexión')
      toast.error("Error de conexión")
      console.error(err)
      return false
    } finally {
      setLoading(false)
    }
  }

  return { 
    data, 
    setData, 
    loading, 
    error, 
    handleConfirm, 
    handleReject,
    refetchAppointments 
  }
}