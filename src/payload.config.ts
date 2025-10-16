import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { s3Storage } from '@payloadcms/storage-s3'

import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import path from 'path'
import sharp from 'sharp'

// Translations
import { en } from '@payloadcms/translations/languages/en'
import { es } from '@payloadcms/translations/languages/es'
import { customTranslations } from '@/custom-translations'

// Collections
import { Users } from '@/collections/Users'
import { Media } from '@/collections/Media'
import { Team } from '@/collections/Team'
import { FrequentlyAskQuestions } from '@/collections/FAQ'
import { Products } from '@/collections/Products'
import { ContactForm } from '@/collections/ContactForm'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const storageEnv= process.env.STORAGE_ENV || 'local'

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
    translations: customTranslations
  },
  collections: [
    Users,
    Media,
    Team,
    FrequentlyAskQuestions,
    Products,
    ContactForm
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
    vercelBlobStorage({
      enabled: storageEnv === 'vercel',
      // Specify which collections should use Vercel Blob
      addRandomSuffix: true,
      collections: {
        media: true,
      },
      // Token provided by Vercel once Blob storage is added to your Vercel project
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
    s3Storage({
      enabled: storageEnv === 's3',
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION,
        // ... Other S3 configuration
      },
    }),
  ],
})
