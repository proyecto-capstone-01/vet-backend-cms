import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { isAdmin } from '@/access/isAdmin'

export const ContactForm: CollectionConfig = {
  slug: 'contact-form',
  access: {
    create: anyone,
    delete: isAdmin,
    update: isAdmin,
    read: isAdmin,
  },
  admin: {
    group: {
      en: 'User Submissions',
      es: 'User Submissions'
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: {
        en: 'Full name',
        es: 'Nombre completo'
      },
      required: true
    },
    {
      name: 'email',
      type: 'text',
      required: true,
      label: {
        en: 'Email',
        es: 'Correo electrónico'
      }
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      label: {
        en: 'Phone number',
        es: 'Numero de teléfono'
      }
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: {
        en: 'Message',
        es: 'Mensaje'
      }
    },
    {
      name: 'contactPreference',
      type: 'radio',
      defaultValue: 'phone',
      options: [
        {
          value: 'email',
          label: {
            en: 'Email',
            es: 'Correo electrónico'
          }
        },
        {
          value: 'phone',
          label: {
            en: 'Phone',
            es: 'Teléfono'
          }
        }
      ],
      label: {
        en: 'Contact preference',
        es: 'Preferencia de contacto'
      }
    },
  ],
  hooks: {
    beforeChange: [
      async () => {
        throw new Error('Form submissions are disabled.');
      }
    ]
  },
  labels: {
    singular: {
      en: 'contact form submission',
      es: 'solicitud de contacto'
    },
    plural: {
      en: 'Contact Form Submissions',
      es: 'Solicitudes de Contacto'
    }
  }
}
