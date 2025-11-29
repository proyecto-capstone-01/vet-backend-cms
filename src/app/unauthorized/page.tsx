import React from 'react'
import Link from 'next/link'
import { IconLock, IconArrowBack } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'

export default async function Unauthorized() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="mx-auto grid place-items-center size-14 rounded-full bg-muted text-muted-foreground">
          <IconLock className="size-7" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">No autorizado</h1>
          <p className="text-sm text-muted-foreground"></p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button asChild variant="outline">
            <Link href="/">
              Volver
              <IconArrowBack />
            </Link>
          </Button>
          <Button variant="destructive">
            <Link href="/admin/logout">Cerrar sesión</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
