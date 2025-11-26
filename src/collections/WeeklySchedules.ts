import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { isDashboardUser } from '@/access/isDashboardUser'

// Defines default weekly schedule patterns, one doc per dayOfWeek
export const WeeklySchedules: CollectionConfig = {
  slug: 'weekly-schedules',
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
    useAsTitle: 'title',
  },
  labels: {
    singular: { en: 'Weekly Schedule', es: 'Horario Semanal' },
    plural: { en: 'Weekly Schedules', es: 'Horarios Semanales' },
  },
  fields: [
    {
      name: 'dayOfWeek',
      type: 'select',
      label: { en: 'Day of Week', es: 'Día de la semana' },
      options: [
        { label: { en: 'Monday', es: 'Lunes' }, value: 'monday' },
        { label: { en: 'Tuesday', es: 'Martes' }, value: 'tuesday' },
        { label: { en: 'Wednesday', es: 'Miércoles' }, value: 'wednesday' },
        { label: { en: 'Thursday', es: 'Jueves' }, value: 'thursday' },
        { label: { en: 'Friday', es: 'Viernes' }, value: 'friday' },
        { label: { en: 'Saturday', es: 'Sábado' }, value: 'saturday' },
        { label: { en: 'Sunday', es: 'Domingo' }, value: 'sunday' },
      ],
      required: true,
      unique: true,
    },
    {
      name: 'openTime',
      type: 'date',
      label: { en: 'Open Time', es: 'Hora de Apertura' },
      admin: { date: { pickerAppearance: 'timeOnly' } },
      required: false,
    },
    {
      name: 'closeTime',
      type: 'date',
      label: { en: 'Close Time', es: 'Hora de Cierre' },
      admin: { date: { pickerAppearance: 'timeOnly' } },
      required: false,
    },
    {
      name: 'closed',
      type: 'checkbox',
      label: { en: 'Closed', es: 'Cerrado' },
      defaultValue: false,
    },
    {
      name: 'title',
      type: 'text',
      admin: { hidden: true },
      hooks: {
        beforeChange: [({ data }) => {
          const day = data?.dayOfWeek || ''
          const closed = data?.closed ? ' (Cerrado)' : ''
          return `${day}${closed}`
        }]
      }
    }
  ],
}

