import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { isAdmin } from '@/access/isAdmin'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    read: anyone,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
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
        en: 'Product name',
        es: 'Nombre del producto'
      },
      required: true
    },
    {
      name: 'description',
      type: 'textarea',
      label: {
        en: 'Product description',
        es: 'Descripción del producto'
      },
    },
    {
      name: 'price',
      type: 'number',
      min: 0,
      max: 100_000_000,
      admin: {
        placeholder: '0'
      },
      label: {
        en: 'Listing price',
        es: 'Precio'
      }
    },
    {
      name: 'discount',
      type: 'number',
      min: 0,
      max: 100,
      admin: {
        step: 1,
        placeholder: '0',
        description: {
          en: 'Range 0 to 100%',
          es: 'De 0 a 100%'
        }
      },
      label: {
        en: 'Discount percentage',
        es: 'Porcentaje de descuento'
      }
    },
    {
      name: 'outOfStock',
      type: 'checkbox',
      defaultValue: false,
      label: {
        en: 'Out of stock',
        es: 'Sin stock'
      }
    },
    {
      name: 'images',
      type: 'upload',
      hasMany: true,
      relationTo: 'media',
      label: {
        en: 'Product images',
        es: 'Imagenes del producto'
      }
    }
  ],
  labels: {
    plural: {
      en: 'Products',
      es: 'Productos'
    },
    singular: {
      en: 'product',
      es: 'producto'
    }
  }
}
