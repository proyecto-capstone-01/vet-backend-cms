import type { CollectionConfig } from 'payload'

export const BusinessHours: CollectionConfig = {
  slug: 'business-hours',
  admin: {
    useAsTitle: 'day',
    group: {
      en: 'Website Content',
      es: 'Contenido del Sitio Web'
    }
  },
  fields: [
    {
      name: 'day',
      type: 'text',
      label: {
        en: 'Day',
        es: 'Día'
      },
      required: true
    },
    {
      name: 'openTime',
      type: 'text',
      label: {
        en: 'Opening Time',
        es: 'Hora de Apertura'
      },
      required: true
    },
    {
      name: 'closeTime',
      type: 'text',
      label: {
        en: 'Closing Time',
        es: 'Hora de Cierre'
      },
      required: true
    },
  ],
  labels: {
    plural: {
      en: 'Business Hours',
      es: 'Horario Comercial'
    },
    singular: {
      en: 'business hour',
      es: 'hora comercial'
    }
  }
}