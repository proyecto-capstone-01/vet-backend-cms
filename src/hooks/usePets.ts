'use client'

import { useState, useEffect } from 'react'

export function usePets(initialData: any[] = []) {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setData(initialData)
  }, [initialData])

  const handleDelete = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/pets/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setData(data.filter(item => item.id !== id))
      } else {
        setError('Error al eliminar mascota')
      }
    } catch (err) {
      setError('Error de conexión')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (id: string, updatedData: any) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/pets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      })
      
      if (response.ok) {
        const result = await response.json()
        setData(data.map(item => item.id === id ? result : item))
      } else {
        setError('Error al actualizar mascota')
      }
    } catch (err) {
      setError('Error de conexión')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return { data, setData, loading, error, handleDelete, handleEdit }
}