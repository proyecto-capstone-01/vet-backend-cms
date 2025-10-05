import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: {
          en: 'A short description of the image or file.',
          es: 'Una breve descripción de la imagen o archivo.'
        }
      },
      label: {
        en: 'Alt text',
        es: 'Texto alternativo'
      }
    },
  ],
  admin: {
    group: {
      en: 'Blog',
      es: 'Blog'
    }
  },
  upload: {
    hideRemoveFile: true,
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
  labels: {
    singular: {
      en: 'media',
      es: 'archivo multimedia'
    },
    plural: {
      en: 'Media',
      es: 'Archivos multimedia'
    }
  }
}
