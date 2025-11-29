import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { isDashboardUser } from '@/access/isDashboardUser'

export const ClosedDays: CollectionConfig = {
  slug: 'closed-days',
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
    singular: { en: 'Closed Day', es: 'Día Cerrado' },
    plural: { en: 'Closed Days', es: 'Días Cerrados' },
  },
  fields: [
    {
      name: 'date',
      type: 'date',
      label: { en: 'Date', es: 'Fecha' },
      required: true,
      admin: {
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'reason',
      type: 'text',
      label: { en: 'Reason', es: 'Motivo' },
    },
  ],
}

