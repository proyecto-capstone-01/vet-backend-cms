import { CollectionConfig } from 'payload'

export const Appointments: CollectionConfig = {
  slug: 'appointments',
  labels: {
    singular: 'Cita',
    plural: 'Citas',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'nombre',
      label: 'Nombre de la Mascota',
      type: 'text',
      required: true,
    },
    {
      name: 'tipo',
      label: 'Tipo de Mascota',
      type: 'text',
      required: true,
    },
    {
      name: 'servicio',
      label: 'Servicio',
      type: 'text',
      required: true,
    },
    {
      name: 'fecha',
      label: 'Fecha',
      type: 'date',
      required: true,
    },
    {
      name: 'hora',
      label: 'Hora',
      type: 'text',
      required: true,
    },
    {
      name: 'total',
      label: 'Total',
      type: 'number',
      required: true,
    },
    {
      name: 'estado',
      label: 'Estado',
      type: 'select',
      options: [
        { label: 'Pendiente', value: 'Pendiente' },
        { label: 'Completado', value: 'Completado' },
        { label: 'Cancelado', value: 'Cancelado' },
      ],
      defaultValue: 'Pendiente',
      required: true,
    },
    {
      name: 'dueño',
      label: 'Dueño',
      type: 'text',
      required: true,
    },
  ],
}