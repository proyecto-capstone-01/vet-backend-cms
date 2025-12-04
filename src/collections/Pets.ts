import type { CollectionConfig } from 'payload'
import { isDashboardUser } from '@/access/isDashboardUser'
import { isAdmin } from '@/access/isAdmin'
import { isServer, isServerOrRoles } from '@/access/isServer'

export const Pets: CollectionConfig = {
  slug: 'pets',
  access: {
    update: isDashboardUser,
    create: isDashboardUser,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'owner',
      type: 'relationship',
      label: {
        en: 'Owner',
        es: 'Propietario',
      },
      relationTo: 'owners',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
      label: {
        en: 'Name',
        es: 'Nombre',
      },
      required: true,
    },
    {
      name: 'microchipNumber',
      type: 'number',
      label: {
        en: 'Microchip Number',
        es: 'Número de Microchip',
      },
      unique: true,
      required: false,
    },
    {
      name: 'species',
      type: 'select',
      label: {
        en: 'Species',
        es: 'Especie',
      },
      options: [
        { label: { en: 'Dog', es: 'Perro' }, value: 'dog' },
        { label: { en: 'Cat', es: 'Gato' }, value: 'cat' },
      ],
      required: true,
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      label: {
        en: 'Date of Birth',
        es: 'Fecha de Nacimiento',
      },
      required: false,
      admin: {
        description: {
          en: 'Real or approximate date of birth',
          es: 'Fecha de nacimiento real o aproximada',
        },
      },
    },
    {
      name: 'sex',
      type: 'select',
      label: {
        en: 'Sex',
        es: 'Sexo',
      },
      options: [
        { label: { en: 'Male', es: 'Macho' }, value: 'male' },
        { label: { en: 'Female', es: 'Hembra' }, value: 'female' },
      ],
      required: true,
    },
    {
      name: 'color',
      type: 'text',
      label: {
        en: 'Color',
        es: 'Color',
      },
    },
    {
      name: 'breed',
      type: 'text',
      label: {
        en: 'Breed',
        es: 'Raza',
      },
      required: false,
    },
    {
      name: 'weight',
      type: 'number',
      label: {
        en: 'Weight (kg)',
        es: 'Peso (kg)',
      },
      required: false,
    },
    {
      name: 'height',
      type: 'number',
      label: {
        en: 'Height (cm)',
        es: 'Altura (cm)',
      },
      required: false,
    },
    {
      name: 'notes',
      type: 'textarea',
      label: {
        en: 'Notes',
        es: 'Notas',
      },
      required: false,
    },
    {
      name: 'photos',
      type: 'upload',
      label: {
        en: 'Photos',
        es: 'Fotos',
      },
      relationTo: 'media',
      required: false,
      hasMany: true,
      admin: {
        description: {
          en: 'Upload photos of the pet',
          es: 'Sube fotos de la mascota',
        },
      },
    },
  ],
  labels: {
    plural: {
      en: 'Pets',
      es: 'Mascotas',
    },
    singular: {
      en: 'pet',
      es: 'mascota',
    },
  },
}
