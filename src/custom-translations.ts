import { enTranslations } from '@payloadcms/translations/languages/en'
import { esTranslations } from '@payloadcms/translations/languages/es'
import type { NestedKeysStripped } from '@payloadcms/translations'

export const customTranslations = {
  en: {
    custom: {
      dashboardGreeting: `Welcome to the Content Management System Dashboard.`,
      unauthorizedTitle: `You don't have access to this content.`,
      unauthorizedSubtitle: 'Ask an administrator for permissions',
    }
  },
  es: {
    custom: {
      dashboardGreeting: 'Bienvenido al panel de Gestión de Contenido.',
      unauthorizedTitle: 'No tienes acceso a este contenido.',
      unauthorizedSubtitle: 'Consulta con el administrador.',
    }
  }
}

export type CustomTranslationsObject = typeof customTranslations.en & typeof enTranslations & typeof customTranslations.es & typeof esTranslations
export type CustomTranslationsKeys =
  NestedKeysStripped<CustomTranslationsObject>