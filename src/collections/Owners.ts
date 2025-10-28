import type { CollectionConfig } from 'payload';
import { isDashboardUser } from '@/access/isDashboardUser'
import { isAdmin } from '@/access/isAdmin'
import { authenticated } from '@/access/authenticated'

export const Owners: CollectionConfig = {
  slug: 'owners',
  admin: {
    useAsTitle: 'nameRutCombination',
  },
  access: {
    read: authenticated,
    update: isDashboardUser,
    create: isDashboardUser,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      label: {
        en: 'First Name',
        es: 'Nombre'
      },
      required: true
    },
    {
      name: 'lastName',
      type: 'text',
      label: {
        en: 'Last Name',
        es: 'Apellido'
      },
      required: true
    },
    {
      name: 'rut',
      type: 'text',
      label: {
        en: 'RUT',
        es: 'RUT'
      },
      required: true
    },
    {
      name: 'email',
      type: 'email',
      label: {
        en: 'Email',
        es: 'Correo Electrónico'
      },
      required: false
    },
    {
      name: 'phoneNumber',
      type: 'text',
      label: {
        en: 'Phone Number',
        es: 'Número de Teléfono'
      },
      required: true
    },
    {
      name: 'address',
      type: 'text',
      label: {
        en: 'Address',
        es: 'Dirección'
      },
      required: false
    },
    {
      name: 'nameRutCombination',
      type: 'text',
      admin: {
        hidden: true
      },
      hooks: {
        beforeChange: [
          ({ data, originalDoc, }) => {
            // @ts-ignore
            const firstName = data.firstName || originalDoc?.firstName || '';
            // @ts-ignore
            const lastName = data.lastName || originalDoc?.lastName || '';
            // @ts-ignore
            const rut = data.rut || originalDoc?.rut || '';
            return `${firstName} ${lastName} - ${rut}`;
          }
        ]
      }
    }
  ],
  labels: {
    plural: {
      en: 'Owners',
      es: 'Propietarios'
    },
    singular: {
      en: 'owner',
      es: 'propietario'
    }
  }
}
