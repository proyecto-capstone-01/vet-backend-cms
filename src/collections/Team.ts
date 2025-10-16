import type { CollectionConfig } from 'payload'

export const Team: CollectionConfig = {
  slug: 'team',
  admin: {
    group: {
      en: 'Website Content',
      es: 'Contenido del Sitio Web'
    }
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: {
        en: `Member name`,
        es: 'Nombre del profesional'
      },
      required: true
    },
    {
      name: 'role',
      type: 'text',
      label: {
        en: `Member role`,
        es: 'Rol del profesional'
      }
    },
    {
      name: 'picture',
      type: 'upload',
      relationTo: 'media',
      label: {
        en: 'Picture',
        es: 'Foto'
      }
    }
  ],
  labels: {
    singular: {
      en: 'team member',
      es: 'profesional'
    },
    plural: {
      en: 'Team',
      es: 'Profesionales'
    }
  }
}