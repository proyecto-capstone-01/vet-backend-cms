import type { CollectionConfig } from 'payload'

export const FrequentlyAskQuestions: CollectionConfig = {
  slug: 'faq',
  admin: {
    group: {
      en: 'Website Content',
      es: 'Contenido del Sitio Web'
    }
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
