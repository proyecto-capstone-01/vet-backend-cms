import { CollectionConfig } from 'payload'

export const Appointments: CollectionConfig = {
  slug: 'appointments',
  labels: {
    singular: {
      en: 'Appointment',
      es: 'Cita',
    },
    plural: {
      en: 'Appointments',
      es: 'Citas',
    },
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'petId',
      type: 'relationship',
      relationTo: 'pets',
      label: 'Mascota',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      label: 'Fecha',
      required: true,
    },
    {
      name: 'time',
      type: 'date',
      label: 'Hora',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'timeOnly',
        },
      },
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: 'Servicios',
      required: true,
    },
    {
      name: 'comment',
      type: 'textarea',
      label: 'Comentario',
    },
    {
      name: 'safeId',
      type: 'text',
      admin: {
        hidden: true,
      },
      required: true,
      unique: true,
      defaultValue: () => {
        return 'apt-' + Math.random().toString(36).substr(2, 9)
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Estado',
      options: [
        { label: 'Pendiente', value: 'pending' },
        { label: 'Confirmada', value: 'confirmed' },
        { label: 'Completada', value: 'completed' },
        { label: 'Cancelada', value: 'canceled' },
      ],
      defaultValue: 'pending',
      required: true,
    }
  ],
}