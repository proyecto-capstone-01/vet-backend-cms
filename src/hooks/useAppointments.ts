'use client'

import { useState, useEffect } from 'react'

export function useAppointments(initialData: any[] = []) {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setData(initialData)
  }, [initialData])

  const handleConfirm = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'Confirmado' }),
      })
      
      if (response.ok) {
        setData(data.map(item => 
          item.id === id ? { ...item, estado: 'Confirmado' } : item
        ))
      } else {
        setError('Error al confirmar cita')
      }
    } catch (err) {
      setError('Error de conexión')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'Rechazado' }),
      })
      
      if (response.ok) {
        setData(data.map(item => 
          item.id === id ? { ...item, estado: 'Rechazado' } : item
        ))
      } else {
        setError('Error al rechazar cita')
      }
    } catch (err) {
      setError('Error de conexión')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return { data, setData, loading, error, handleConfirm, handleReject }
}