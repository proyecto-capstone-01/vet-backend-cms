'use client'

import type { Media } from '@/payload-types'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useMemo, useState, useCallback } from 'react'
import { IconChevronRight, IconChevronLeft } from '@tabler/icons-react'
import { ScrollArea } from "@/components/ui/scroll-area"


// Choose the best display URL from the available sizes, fallback to original url
function getMediaUrl(m?: Media | null): string | null {
  if (!m) return null
  const order = [
    m.sizes?.xlarge?.url,
    m.sizes?.large?.url,
    m.sizes?.medium?.url,
    m.sizes?.small?.url,
    m.sizes?.square?.url,
    m.sizes?.thumbnail?.url,
    m.sizes?.og?.url,
    m.url,
  ]
  return (order.find(Boolean) as string | undefined) ?? null
}

function isImage(m?: Media | null): boolean {
  const mt = m?.mimeType?.toLowerCase() ?? ''
  return mt.startsWith('image/')
}

export default function MediaViewer({ media }: { media: Media[] }) {
  const items = useMemo(() => media?.filter(Boolean) ?? [], [media])
  const [index, setIndex] = useState(0)

  const hasItems = items.length > 0
  const current = hasItems ? items[Math.min(index, items.length - 1)] : undefined
  const currentUrl = getMediaUrl(current)

  const goPrev = useCallback(() => {
    if (!hasItems) return
    setIndex((i) => (i - 1 + items.length) % items.length)
  }, [items.length, hasItems])

  const goNext = useCallback(() => {
    if (!hasItems) return
    setIndex((i) => (i + 1) % items.length)
  }, [items.length, hasItems])

  if (!hasItems) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Media</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No hay archivos para mostrar.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle>
          Media ({index + 1}/{items.length})
        </CardTitle>
        {items.length > 1 && (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={goPrev} aria-label="Anterior">
              <IconChevronLeft size={16} />
            </Button>
            <Button size="sm" variant="outline" onClick={goNext} aria-label="Siguiente">
              <IconChevronRight size={16} />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-row gap-4">
          <div className="w-full flex-1">
            {isImage(current) && currentUrl ? (
              <div className="relative w-full overflow-hidden rounded-md border bg-muted">
                {/* Constrain height to avoid layout shift; adjust as needed */}
                <img
                  src={currentUrl}
                  alt={current?.alt ?? current?.filename ?? 'Media'}
                  className="h-[233px] w-full object-contain bg-white"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="flex flex-col items-start gap-2 rounded-md border p-4">
                <span className="text-sm text-muted-foreground">Archivo</span>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-muted">📄</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{current?.filename ?? 'Archivo'}</span>
                    {currentUrl && (
                      <a
                        href={currentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-primary underline"
                      >
                        Abrir
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {items.length > 1 && (
            <ScrollArea className="hidden h-55 w-24 md:block">
              <div className="hidden w-24 flex-col gap-2 md:flex">
                {items.map((m, i) => {
                  const thumb = m.sizes?.thumbnail?.url ?? m.sizes?.small?.url ?? m.url ?? undefined
                  const active = i === index
                  return (
                    <button
                      key={m.id + '-' + i}
                      type="button"
                      onClick={() => setIndex(i)}
                      className={
                        'relative h-16 w-full overflow-hidden rounded border ring-offset-2 focus:outline-none focus:ring-2 ' +
                        (active ? 'ring-2 ring-primary' : 'ring-transparent')
                      }
                      aria-label={`Seleccionar media ${i + 1}`}
                    >
                      {thumb && isImage(m) ? (
                        <img src={thumb} alt={m.alt ?? m.filename ?? 'Miniatura'} className="h-full w-full object-cover" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center bg-muted text-xs">{i + 1}</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  )
}