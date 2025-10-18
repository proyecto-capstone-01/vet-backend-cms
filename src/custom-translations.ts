import { enTranslations } from '@payloadcms/translations/languages/en'
import { esTranslations } from '@payloadcms/translations/languages/es'
import type { NestedKeysStripped } from '@payloadcms/translations'

export const customTranslations = {
  en: {
    custom: {
      dashboardGreeting: `Welcome to the Content Management System Dashboard.`,
      unauthorizedTitle: `You don't have access to this content.`,
      unauthorizedSubtitle: 'Ask an administrator for permissions',
      cmsMessage: 'You are in your website content manager.',
      goToDashboard: 'Go to dashboard',
      rebuildWebsite: 'Rebuild website',
    }
  },
  es: {
    custom: {
      dashboardGreeting: 'Bienvenido al panel de Gestión de Contenido.',
      unauthorizedTitle: 'No tienes acceso a este contenido.',
      unauthorizedSubtitle: 'Consulta con el administrador.',
      cmsMessage: 'Para sincronizar los cambios con tu sitio web, haz clic en el botón «Reconstruir sitio web».',
      goToDashboard: 'Ir al dashboard',
      rebuildWebsite: 'Reconstruir sitio web',
    }
  }
}

export type CustomTranslationsObject = typeof customTranslations.en & typeof enTranslations & typeof customTranslations.es & typeof esTranslations
export type CustomTranslationsKeys =
  NestedKeysStripped<CustomTranslationsObject>