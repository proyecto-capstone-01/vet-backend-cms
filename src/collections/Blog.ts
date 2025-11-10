import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { isAdmin } from '@/access/isAdmin'

export const Blog: CollectionConfig = {
  slug: 'blog',
  admin: {
    useAsTitle: 'title',
    group: 'Blog',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: isAdmin,
  },
  fields: [
    // SECCIÓN 1: INFORMACIÓN BÁSICA
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Contenido Principal',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Título',
              required: true,
            },
            {
              name: 'slug',
              type: 'text',
              label: 'URL amigable (slug)',
              required: true,
              unique: true,
              admin: {
                description: 'Auto-generado desde el título si está vacío',
              },
            },
            {
              name: 'excerpt',
              type: 'textarea',
              label: 'Extracto / Resumen',
              required: false,
              admin: {
                description: 'Resumen breve para listados (máx 160 caracteres)',
              },
            },
            {
              name: 'content',
              type: 'richText',
              label: 'Contenido Principal',
              required: true,
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Imagen Destacada (Hero Image)',
              required: false,
            },
          ],
        },
        {
          label: 'Clasificación',
          fields: [
            {
              name: 'categories',
              type: 'relationship',
              relationTo: 'blog-categories',
              hasMany: true,
              label: 'Categorías',
              required: false,
              admin: {
                description: 'Selecciona una o más categorías',
              },
            },
            {
              name: 'tags',
              type: 'relationship',
              relationTo: 'blog-tags',
              hasMany: true,
              label: 'Etiquetas',
              required: false,
              admin: {
                description: 'Selecciona una o más etiquetas',
              },
            },
            {
              name: 'authors',
              type: 'relationship',
              relationTo: 'users',
              hasMany: true,
              label: 'Autores',
              required: false,
            },
          ],
        },
        {
          label: 'SEO & Metadatos',
          fields: [
            {
              name: 'meta',
              type: 'group',
              label: 'Metadatos SEO',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Meta Title',
                  required: false,
                  admin: {
                    description: 'Título para buscadores (aparece en navegadores)',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Meta Description',
                  required: false,
                  admin: {
                    description: 'Descripción para buscadores (máx 160 caracteres)',
                  },
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Meta Image (OG Image)',
                  required: false,
                  admin: {
                    description: 'Imagen para redes sociales',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Relaciones',
          fields: [
            {
              name: 'relatedPosts',
              type: 'relationship',
              relationTo: 'blog',
              hasMany: true,
              label: 'Artículos Relacionados',
              required: false,
              admin: {
                description: 'Selecciona otros posts para mostrar como relacionados. Úsalo después de crear este artículo.',
              },
            },
          ],
        },
        {
          label: 'Publicación',
          fields: [
            {
              name: 'publishedAt',
              type: 'date',
              label: 'Fecha de Publicación',
              required: false,
              admin: {
                description: 'Fecha en que se publicó el artículo',
              },
            },
            {
              name: '_status',
              type: 'select',
              defaultValue: 'draft',
              label: 'Estado',
              options: [
                {
                  label: 'Borrador',
                  value: 'draft',
                },
                {
                  label: 'Publicado',
                  value: 'published',
                },
                {
                  label: 'Archivado',
                  value: 'archived',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}