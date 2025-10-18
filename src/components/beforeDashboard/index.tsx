import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'
import { getTranslation, I18n } from '@payloadcms/translations'
import './index.scss'
import { IconExternalLink, IconHammer } from '@tabler/icons-react'
import { Button } from '@payloadcms/ui'
import Link from 'next/link'

const baseClass = 'before-dashboard'

export default async function BeforeDashboard({
  i18n,
}: {
  i18n: Pick<I18n<any, any>, 'fallbackLanguage' | 'language' | 't'>
}) {
  const dg = getTranslation(i18n.t('custom:dashboardGreeting'), i18n)
  const cmsm = getTranslation(i18n.t('custom:cmsMessage'), i18n)
  const gtd = getTranslation(i18n.t('custom:goToDashboard'), i18n)
  const rbw = getTranslation(i18n.t('custom:rebuildWebsite'), i18n)

  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>{dg}</h4>
      </Banner>
      <p>{cmsm}</p>

      <div className={`${baseClass}__actions`}>
        <Link href="/dashboard" prefetch='auto'>
          <Button>
            {gtd}
            <IconExternalLink size={16} style={{ marginLeft: '8px' }} />
          </Button>
        </Link>

        <Button >
          {rbw}
          <IconHammer size={16} style={{ marginLeft: '8px' }} />
        </Button>

      </div>
    </div>
  )
}
