import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { isAdmin } from '@/access/isAdmin'

export const FrequentlyAskQuestions: CollectionConfig = {
  slug: 'faq',
  admin: {
    useAsTitle: 'question',
    group: {
      en: 'Website Content',
      es: 'Contenido del Sitio Web'
    }
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      label: {
        en: 'Question',
        es: 'Pregunta Frecuente'
      },
      required: true
    },
    {
      name: 'answer',
      type: 'text',
      label: {
        en: 'Answer',
        es: 'Respuesta'
      },
      required: true
    },
  ],
  labels: {
    plural: {
      en: 'Frequently Asked Questions',
      es: 'Preguntas Frecuentes'
    },
    singular: {
      en: 'frequently asked question',
      es: 'pregunta frecuente'
    }
  }
}
