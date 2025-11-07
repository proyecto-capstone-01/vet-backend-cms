import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { isDashboardUser } from '@/access/isDashboardUser'

export const Inventory: CollectionConfig = {
  slug: 'inventory',
  access: {
    read: (args) => isDashboardUser(args) || isAdmin(args),
    create: (args) => isDashboardUser(args) || isAdmin(args),
    update: (args) => isDashboardUser(args) || isAdmin(args),
    delete: isAdmin,
  },
  admin: {
    group: {
      en: 'Operations',
      es: 'Operaciones'
    },
    useAsTitle: 'name',
    defaultColumns: ['sku', 'name', 'quantity', 'status'],
  },
  fields: [
    {
      name: 'sku',
      type: 'text',
      unique: true,
      required: true,
      label: {
        en: 'SKU / Code',
        es: 'SKU / Código'
      },
      admin: {
        description: {
          en: 'Unique identifier for the item',
          es: 'Identificador único del ítem'
        }
      }
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: {
        en: 'Item name',
        es: 'Nombre del ítem'
      }
    },
    {
      name: 'description',
      type: 'textarea',
      label: {
        en: 'Description',
        es: 'Descripción'
      }
    },
    {
      name: 'category',
      type: 'text',
      label: {
        en: 'Category',
        es: 'Categoría'
      }
    },
    {
      name: 'unitCost',
      type: 'number',
      min: 0,
      admin: {
        placeholder: '0'
      },
      label: {
        en: 'Unit cost',
        es: 'Costo unitario'
      }
    },
    {
      name: 'trackStock',
      type: 'checkbox',
      defaultValue: true,
      label: {
        en: 'Track stock',
        es: 'Controlar stock'
      }
    },
    {
      name: 'quantity',
      type: 'number',
      min: 0,
      defaultValue: 0,
      label: {
        en: 'Quantity on hand',
        es: 'Cantidad en stock'
      },
      admin: {
        description: {
          en: 'Total available units',
          es: 'Unidades disponibles'
        }
      }
    },
    {
      name: 'reorderLevel',
      type: 'number',
      min: 0,
      defaultValue: 0,
      label: {
        en: 'Reorder level',
        es: 'Nivel de reposición'
      }
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: { en: 'Active', es: 'Activo' }, value: 'active' },
        { label: { en: 'Inactive', es: 'Inactivo' }, value: 'inactive' },
        { label: { en: 'Archived', es: 'Archivado' }, value: 'archived' }
      ],
      label: {
        en: 'Status',
        es: 'Estado'
      }
    },
    {
      name: 'supplier',
      type: 'text',
      label: {
        en: 'Supplier',
        es: 'Proveedor'
      }
    },
    {
      name: 'location',
      type: 'text',
      label: {
        en: 'Storage location',
        es: 'Ubicación de almacenamiento'
      }
    },
    {
      name: 'barcode',
      type: 'text',
      label: {
        en: 'Barcode',
        es: 'Código de barras'
      }
    },
    {
      name: 'serialNumber',
      type: 'text',
      label: {
        en: 'Serial number',
        es: 'Número de serie'
      }
    },
    {
      name: 'images',
      type: 'upload',
      hasMany: true,
      relationTo: 'media',
      label: {
        en: 'Item images',
        es: 'Imágenes del ítem'
      }
    },
    {
      name: 'notes',
      type: 'textarea',
      label: {
        en: 'Internal notes',
        es: 'Notas internas'
      }
    }
  ],
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        // When inventory changes, update linked products' stock flag
        try {
          const trackStock = Boolean((doc as any).trackStock)
          let outOfStock = false
          if (trackStock) {
            const qty = typeof (doc as any).quantity === 'number' ? (doc as any).quantity : 0
            outOfStock = qty <= 0
          }

          // Find all products linked to this inventory item
          const linked = await req.payload.find({
            collection: 'products',
            where: { inventoryItem: { equals: (doc as any).id } },
            limit: 1000,
            overrideAccess: true,
            depth: 0,
          })

          for (const p of linked.docs) {
            await req.payload.update({
              collection: 'products',
              id: String(p.id),
              data: { outOfStock },
              overrideAccess: true,
            })
          }
        } catch (e) {
          // Best-effort sync; ignore errors to not block inventory updates
        }
        return doc
      }
    ]
  },
  labels: {
    plural: {
      en: 'Inventory',
      es: 'Inventario'
    },
    singular: {
      en: 'inventory item',
      es: 'ítem de inventario'
    }
  }
}
