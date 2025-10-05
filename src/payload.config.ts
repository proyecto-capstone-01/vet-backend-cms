import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import path from 'path'
import sharp from 'sharp'

// Translations
import { en } from '@payloadcms/translations/languages/en'
import { es } from '@payloadcms/translations/languages/es'

// Collections
import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import { Team } from '@/collections/Team'
import { FrequentlyAskQuestions } from '@/collections/FAQ'
import { Products } from '@/collections/Products'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      robots: 'noindex, nofollow',
    },
    components: {
      beforeDashboard: ['@/components/beforeDashboard'],
    },
  },
  i18n: {
    supportedLanguages: { en, es },
    fallbackLanguage: 'es',
    translations: {
      en: {
        custom: {
          dashboardGreeting: `Welcome to the Content Management System Dashboard.`,
        },
      },
      es: {
        custom: {
          dashboardGreeting: 'Bienvenido al panel de Gestión de Contenido.',
        },
      },
    },
  },
  collections: [
    Users,
    Media,
    Team,
    FrequentlyAskQuestions,
    Products
  ],
  telemetry: false,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),

  ],
})
