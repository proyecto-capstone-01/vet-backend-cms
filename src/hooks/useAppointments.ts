'use client'

import { useState, useEffect } from 'react'

export function useAppointments(initialData: any[] = []) {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setData(initialData)
  }, [initialData])

  const refetchAppointments = async () => {
    try {
      const response = await fetch('/appointments')
      if (response.ok) {
        const appointments = await response.json()
        setData(appointments)
      }
    } catch (err) {
      console.error('Error refetching appointments:', err)
    }
  }

  const handleConfirm = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      })
      if (response.ok) {
        setData(prev => prev.map(item => item.id === id ? { ...item, estado: 'Completado' } : item))
        await refetchAppointments()
        return true
      } else {
        setError('Error al confirmar cita')
        return false
      }
    } catch (err) {
      setError('Error de conexión')
      console.error(err)
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'canceled' }),
      })
      if (response.ok) {
        setData(prev => prev.map(item => item.id === id ? { ...item, estado: 'Cancelado' } : item))
        await refetchAppointments()
        return true
      } else {
        setError('Error al rechazar cita')
        return false
      }
    } catch (err) {
      setError('Error de conexión')
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