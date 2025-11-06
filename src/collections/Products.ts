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
      name: 'inventoryItem',
      type: 'relationship',
      relationTo: 'inventory',
      required: false,
      label: {
        en: 'Inventory item (optional)',
        es: 'Ítem de inventario (opcional)'
      },
      admin: {
        description: {
          en: 'Link a product to an internal inventory item to inherit name, description, images and stock status',
          es: 'Vincula un producto a un ítem de inventario interno para heredar nombre, descripción, imágenes y estado de stock'
        }
      }
    },
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
  hooks: {
    beforeValidate: [
      async ({ data, req }) => {
        if (!data) return data
        // If a product is linked to an inventory item, inherit core fields for convenience
        const rawRel = (data as any).inventoryItem
        const inventoryId = typeof rawRel === 'string' ? rawRel : rawRel?.id
        if (!inventoryId) return data
        try {
          const inventoryDoc = await req.payload.findByID({ collection: 'inventory', id: inventoryId, overrideAccess: true })
          if (!inventoryDoc) return data

          // Only set fields if not already provided to allow overrides
          ;(data as any).name = (data as any).name ?? (inventoryDoc as any).name
          ;(data as any).description = (data as any).description ?? (inventoryDoc as any).description
          ;(data as any).images = Array.isArray((data as any).images) && (data as any).images.length > 0 ? (data as any).images : (inventoryDoc as any).images

          // Derive stock status if inventory is tracked
          const trackStock = Boolean((inventoryDoc as any).trackStock)
          if (trackStock) {
            const qty = typeof (inventoryDoc as any).quantity === 'number' ? (inventoryDoc as any).quantity : 0
            ;(data as any).outOfStock = qty <= 0
          }

          return data
        } catch (e) {
          // If inventory not accessible, just continue; validation may catch invalid relation
          return data
        }
      }
    ]
  },
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
