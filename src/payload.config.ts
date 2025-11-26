import { postgresAdapter } from '@payloadcms/db-postgres'
import { uploadthingStorage } from '@payloadcms/storage-uploadthing'
import { resendAdapter } from '@payloadcms/email-resend'

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
import { Owners } from '@/collections/Owners'
import { Pets } from '@/collections/Pets'
import { Inventory } from '@/collections/Inventory'
import { Services } from '@/collections/Services'
import { Appointments } from '@/collections/Appointments'
import { Blog } from '@/collections/Blog'
import { BlogCategories } from '@/collections/BlogCategories'
import { BlogTags } from '@/collections/BlogTags'

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
  cors: {
    origins: [
      'http://localhost:3000',
      'http://localhost:4321',
      'http://127.0.0.1:3000',
      'https://*.veterinariapucara.cl',
    ],
  },
  email: resendAdapter({
    defaultFromAddress: process.env.DEFAULT_ADDRESS || '',
    defaultFromName: process.env.DEFAULT_EMAIL_NAME || 'Admin',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  i18n: {
    fallbackLanguage: 'es',
    supportedLanguages: { es, en },
    translations: customTranslations,
  },
  collections: [
    Users,
    Media,
    Team,
    FrequentlyAskQuestions,
    Inventory,
    Products,
    ContactForm,
    Owners,
    Pets,
    Services,
    Appointments,
    Blog,
    BlogCategories,
    BlogTags,
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
    uploadthingStorage({
      collections: {
        media: true,
      },
      options: {
        token: process.env.UPLOADTHING_TOKEN,
        acl: 'public-read',
      },
    }),
    payloadCloudPlugin(),
  ],
})
