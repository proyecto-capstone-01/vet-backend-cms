import type { CollectionConfig } from 'payload'
import { isDashboardUser } from '@/access/isDashboardUser'
import { anyone } from '@/access/anyone'

export const Hours: CollectionConfig = {
  slug: 'hours',
  access: {
    read: anyone,
    create: isDashboardUser,
    update: isDashboardUser,
    delete: isDashboardUser
  },
  admin: {
    group: {
      en: 'Administration',
      es: 'Administración'
    }
  },
  fields: [
    {
      name: 'dayOfWeek',
      type: 'select',
      label: {
        en: 'Day of the Week',
        es: 'Día de la Semana'
      },
      options: [
        { label: { en: 'Monday', es: 'Lunes' }, value: 'monday' },
        { label: { en: 'Tuesday', es: 'Martes' }, value: 'tuesday' },
        { label: { en: 'Wednesday', es: 'Miércoles' }, value: 'wednesday' },
        { label: { en: 'Thursday', es: 'Jueves' }, value: 'thursday' },
        { label: { en: 'Friday', es: 'Viernes' }, value: 'friday' },
        { label: { en: 'Saturday', es: 'Sábado' }, value: 'saturday' },
        { label: { en: 'Sunday', es: 'Domingo' }, value: 'sunday' },
      ],
      required: true
    },
    {
      name: 'startTime',
      type: 'date',
      label: {
        en: 'Start Time',
        es: 'Hora de Inicio'
      },
      admin: {
        date: {
          pickerAppearance: 'timeOnly'
        }
      },
      required: true
    },
    {
      name: 'endTime',
      type: 'date',
      label: {
        en: 'End Time',
        es: 'Hora de Término'
      },
      admin: {
        date: {
          pickerAppearance: 'timeOnly'
        }
      },
      required: true
    }
  ],
  labels: {
    singular: {
      en: 'hour',
      es: 'hora'
    },
    plural: {
      en: 'Hours',
      es: 'Horas'
    }
  }
}