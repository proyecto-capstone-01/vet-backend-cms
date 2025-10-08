import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminFieldLevel } from '@/access/isAdmin'
import { isAdminOrSelf } from '@/access/isAdminOrSelf'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    create: isAdmin,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'email',
    group: {
      es: 'Administración',
      en: 'Administration'
    }
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      minLength: 2,
      maxLength: 256,
      label: {
        es: 'Nombre',
        en: 'Name'
      },
      required: true
    },
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          minLength: 2,
          maxLength: 256,
          //required: true,
          label: {
            en: 'First name',
            es: 'Nombre'
          }
        },
        {
          name: 'lastName',
          type: 'text',
          minLength: 2,
          maxLength: 256,
          //required: true,
          label: {
            en: 'Last name',
            es: 'Apellido'
          }
        },
      ],
    },
    {
      name: 'roles',
      saveToJWT: true,
      type: 'select',
      hasMany: true,
      defaultValue: ['dashboard'],
      required: true,
      access: {
        // Only admins can create or update a value for this field
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
