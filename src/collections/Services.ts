import type { CollectionConfig } from 'payload'
import { isDashboardUser } from '@/access/isDashboardUser'
import { anyone } from '@/access/anyone'

export const Services: CollectionConfig = {
  slug: 'services',
  access: {
    read: anyone,
    create: isDashboardUser,
    update: isDashboardUser,
    delete: isDashboardUser
  },
  admin: {
    group: {
      en: 'Website Content',
      es: 'Contenido del Sitio Web'
    },
    useAsTitle: 'title'
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: {
        en: 'Service Title',
        es: 'Título del Servicio'
      },
      required: true
    },
    {
      name: 'description',
      type: 'textarea',
      label: {
        en: 'Service Description',
        es: 'Descripción del Servicio'
      }
    },
    {
      name: 'price',
      type: 'number',
      label: {
        en: 'Service Price',
        es: 'Precio del Servicio'
      }
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      label: {
        en: 'Service Icon',
        es: 'Icono del Servicio'
      }
    }
  ],
  labels: {
    singular: {
      en: 'service',
      es: 'servicio'
    },
    plural: {
      en: 'Services',
      es: 'Servicios'
    }
  }
}