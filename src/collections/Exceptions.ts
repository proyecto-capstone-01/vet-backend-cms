import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { isDashboardUser } from '@/access/isDashboardUser'

// Per-date exceptions. Can close the whole day or add/remove availability windows.
export const Exceptions: CollectionConfig = {
  slug: 'schedule-exceptions',
  access: {
    read: anyone,
    create: isDashboardUser,
    update: isDashboardUser,
    delete: isDashboardUser,
  },
  admin: {
    group: {
      en: 'Administration',
      es: 'Administración',
    },
  },
  labels: {
    singular: { en: 'Schedule Exception', es: 'Excepción de Horario' },
    plural: { en: 'Schedule Exceptions', es: 'Excepciones de Horario' },
  },
  fields: [
    {
      name: 'date',
      type: 'date',
      label: { en: 'Date', es: 'Fecha' },
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'closed',
      type: 'checkbox',
      label: { en: 'Closed', es: 'Cerrado' },
      defaultValue: false,
    },
    {
      name: 'openTime',
      type: 'date',
      label: { en: 'Open Time (override)', es: 'Hora de Apertura (override)' },
      admin: { date: { pickerAppearance: 'timeOnly' } },
    },
    {
      name: 'closeTime',
      type: 'date',
      label: { en: 'Close Time (override)', es: 'Hora de Cierre (override)' },
      admin: { date: { pickerAppearance: 'timeOnly' } },
    },
  ],
}

