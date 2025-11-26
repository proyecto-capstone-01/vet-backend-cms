import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminFieldLevel } from '@/access/isAdmin'
import { isAdminOrSelf } from '@/access/isAdminOrSelf'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    create: isAdmin,
    read: () => true,

    update: isAdminOrSelf,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'fullName',
    group: {
      es: 'Administración',
      en: 'Administration'
    }
  },
  auth: true,
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (data.firstName || data.lastName) {
          data.fullName = `${data.firstName ?? ''} ${data.lastName ?? ''}`.trim()
        }
        return data
      },
    ],
    afterRead: [
      async ({ doc }) => {
        if (doc.firstName || doc.lastName) {
          doc.fullName = `${doc.firstName ?? ''} ${doc.lastName ?? ''}`.trim()
        }
        return doc
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          minLength: 2,
          maxLength: 256,
          required: true,
          label: {
            en: 'First name',
            es: 'Nombre'
          },
          access: { read: () => true },
        },
        {
          name: 'lastName',
          type: 'text',
          minLength: 2,
          maxLength: 256,
          required: true,
          label: {
            en: 'Last name',
            es: 'Apellido'
          },
          access: { read: () => true },
        },
      ],
    },
    {
      name: 'fullName',
      type: 'text',
      admin: { hidden: true },
      access: { read: () => true },
    },
    {
      name: 'email',
      type: 'email',
      access: { 
        read: ({ req }) => (req.user?.id === req.data?.id || req.user?.roles?.includes('admin')) ?? false
      },
    },
    {
      name: 'roles',
      saveToJWT: true,
      type: 'select',
      hasMany: true,
      defaultValue: ['dashboard'],
      required: true,
      access: {
        read: ({ req }) => req.user?.roles?.includes('admin') ?? false,
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
      options: [
        {
          label: {
            en: 'Admin',
            es: 'Administrador'
          },
          value: 'admin',
        },
        {
          label: {
            en: 'Editor',
            es: 'Editor'
          },
          value: 'editor',
        },
        {
          label: {
            en: 'Blogger',
            es: 'Blogger'
          },
          value: 'blogger'
        },
        {
          label: {
            en: 'Web editor',
            es: 'Editor web'
          },
          value: 'webEditor'
        },
        {
          label: {
            en: 'Dashboard user',
            es: 'Usuario del dashboard'
          },
          value: 'dashboard'
        }
      ]
    },
    {
      name: 'sessions',
      type: 'array',
      access: { 
        read: ({ req }) => req.user?.roles?.includes('admin') ?? false
      },
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'createdAt',
          type: 'date',
        },
        {
          name: 'expiresAt',
          type: 'date',
        },
      ],
    },
  ],
  labels: {
    singular: {
      en: 'User',
      es: 'Usuario',
    },
    plural: {
      en: 'Users',
      es: 'Usuarios',
    },
  },
}
