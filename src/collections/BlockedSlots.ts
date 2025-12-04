import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { isDashboardUser } from '@/access/isDashboardUser'

export const BlockedSlots: CollectionConfig = {
  slug: 'blocked-slots',
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
    singular: { en: 'Blocked Slot', es: 'Bloqueo de Hora' },
    plural: { en: 'Blocked Slots', es: 'Bloqueos de Horas' },
  },
  fields: [
    {
      name: 'date',
      type: 'date',
      label: { en: 'Date', es: 'Fecha' },
      admin: { date: { pickerAppearance: 'dayOnly' } },
      required: true,
    },
    {
      name: 'time',
      type: 'date',
      label: { en: 'Time', es: 'Hora' },
      admin: { date: { pickerAppearance: 'timeOnly' } },
      required: true,
    },
    {
      name: 'reason',
      type: 'text',
      label: { en: 'Reason', es: 'Motivo' },
    },
  ],
}

