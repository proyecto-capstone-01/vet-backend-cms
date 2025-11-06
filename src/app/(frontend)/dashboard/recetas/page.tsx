'use client'

import { useState, useEffect } from 'react'
import jsPDF from 'jspdf'
import { Button } from '@/components/ui/button'
import fondoBase64 from '../../../utils/fondoBase64'

export default function RecetaForm() {
  const [formData, setFormData] = useState({
    nombreMascota: '',
    pesoMascota: '',
    nombreDueno: '',
    rutDueno: '',
    fecha: '',
    diagnostico: '',
    tratamiento: '',
    observaciones: '',
  })

  useEffect(() => {
    const hoy = new Date()
    const fechaActual = hoy.toLocaleDateString('es-CL')
    setFormData((prev) => ({ ...prev, fecha: fechaActual }))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    const { nombreMascota, pesoMascota, nombreDueno, rutDueno, diagnostico, tratamiento } = formData
    if (
      !nombreMascota ||
      !pesoMascota ||
      !nombreDueno ||
      !rutDueno ||
      !diagnostico ||
      !tratamiento
    ) {
      alert('Por favor completa todos los campos obligatorios.')
      return
    }

    const doc = new jsPDF({ format: 'a5', unit: 'mm', orientation: 'portrait' })

    // Imagen de fondo
    doc.addImage(fondoBase64, 'PNG', 0, 0, 148, 210)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(12)

    let y = 27

    doc.text(`Fecha: ${formData.fecha}`, 15, y)
    y += 6
    doc.text(`Nombre de la Mascota: ${formData.nombreMascota}`, 15, y)
    y += 6
    doc.text(`Peso de la Mascota: ${formData.pesoMascota} kg`, 15, y)
    y += 6
    doc.text(`Nombre del Dueño: ${formData.nombreDueno}`, 15, y)
    y += 6
    doc.text(`RUT del Dueño: ${formData.rutDueno}`, 15, y)
    y += 6

    doc.text('Diagnóstico:', 15, y)
    y += 5
    doc.text(formData.diagnostico, 20, y, { maxWidth: 110 })
    y += 25

    doc.text('Tratamiento:', 15, y)
    y += 5
    doc.text(formData.tratamiento, 20, y, { maxWidth: 110 })
    y += 40

    if (formData.observaciones) {
      doc.text('Observaciones:', 15, y)
      y += 5
      doc.text(formData.observaciones, 20, y, { maxWidth: 110 })
      y += 25
    }

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    doc.setFont('helvetica')
    doc.text('Firma y Timbre del Veterinario', pageWidth / 2, pageHeight - 20, { align: 'center' })

    doc.save(`Receta_${formData.nombreMascota}.pdf`)
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-center mb-6">Generar Receta Médica</h1>

      <div className="space-y-4">

        <div className="flex flex-col md:flex-row gap-4">
          <label className="flex-1 flex flex-col">
            Nombre de la Mascota *
            <input
              type="text"
              name="nombreMascota"
              value={formData.nombreMascota}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </label>
          <label className="flex-1 flex flex-col">
            Peso de la Mascota (kg) *
            <input
              type="text"
              name="pesoMascota"
              value={formData.pesoMascota}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </label>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <label className="flex-1 flex flex-col">
            Nombre del Dueño *
            <input
              type="text"
              name="nombreDueno"
              value={formData.nombreDueno}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </label>
          <label className="flex-1 flex flex-col">
            RUT del Dueño *
            <input
              type="text"
              name="rutDueno"
              value={formData.rutDueno}
              onChange={handleChange}
              className="w-full border rounded p-2"
              placeholder="12.345.678-9"
              required
            />
          </label>
        </div>

        <label className="flex flex-col w-full">
          Fecha
          <input
            type="text"
            name="fecha"
            value={formData.fecha}
            readOnly
            className="w-full border rounded p-2"
          />
        </label>

        <label className="flex flex-col w-full">
          Diagnóstico *
          <textarea
            name="diagnostico"
            value={formData.diagnostico}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded p-2"
            required
          />
        </label>

        <label className="flex flex-col w-full">
          Tratamiento *
          <textarea
            name="tratamiento"
            value={formData.tratamiento}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded p-2"
            required
          />
        </label>

        <label className="flex flex-col w-full">
          Observaciones
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded p-2"
          />
        </label>

        <Button onClick={handleSubmit} className="w-full mt-4">
          Generar Receta
        </Button>
      </div>
    </div>
  )
}
