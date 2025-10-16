import React from 'react'
import Link from 'next/link'
import { headers } from 'next/headers'
import config from '@payload-config'
import { getPayload } from 'payload'
import { Lock, Undo2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getTranslation, I18n, t,  } from '@payloadcms/translations'

export default async function Unauthorized() {
  // const hdrs = await headers()
  // const acceptLanguage = hdrs.get('accept-language') || ''
  // const preferred = acceptLanguage.split(',')[0]?.trim() || ''
  // const lang = preferred.split('-')[0] || undefined
  //
  // const payload = await getPayload({ config: await config })
  // // Use a fixed translator for the resolved language without mutating global state
  // const i18n = payload.config.i18n.translations as Pick<I18n<any, any>, "fallbackLanguage" | "language" | "t">
  //
  // const tl = getTranslation(('custom:dashboardGreeting'), i18n)
  //
  // console.log(tl)
  //
  // const title = ('custom:unauthorizedTitle')
  // const subtitle = ('custom:unauthorizedSubtitle')

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="mx-auto grid place-items-center size-14 rounded-full bg-muted text-muted-foreground">
          <Lock className="size-7" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            unauthorized
          </h1>
          <p className="text-sm text-muted-foreground">

          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button asChild variant="outline">
            <Link href="/">
              Go Back
              <Undo2 />
            </Link>
          </Button>
          <Button variant="destructive">
            <Link href="/admin/logout">
              Log Out
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}