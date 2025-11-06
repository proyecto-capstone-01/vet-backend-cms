'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  IconExternalLink,
  type Icon,
} from '@tabler/icons-react'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

export function NavDocuments({
  items,
  activePath,
}: {
  items: {
    name: string
    url: string
    icon: Icon
    className?: string
    external?: boolean
  }[]
  activePath: string
}) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Contenido WEB</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive =
            !item.external &&
            (activePath === item.url || activePath.startsWith(`${item.url}/`))

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                className={`transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                } ${item.className || ''}`}
              >
                {item.external ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <item.icon />
                      <span>{item.name}</span>
                    </div>
                    <IconExternalLink className="size-4" />
                  </a>
                ) : (
                  <Link href={item.url} className="flex items-center gap-2">
                    <item.icon className="size-4" />
                    <span>{item.name}</span>
                  </Link>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}