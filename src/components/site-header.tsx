"use client"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  IconRefresh,
  IconSun,
  IconMoon,
  IconUserCircle,
  IconLogout,
} from "@tabler/icons-react"
import { useTheme } from "next-themes"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export function SiteHeader() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const user = {
    name: "Admin",
    email: "admin@clinic.com",
    avatar: "/avatars/shadcn.jpg",
  }

  const getPageTitle = () => {
    if (!pathname) return "Dashboard"
    const parts = pathname.split("/").filter(Boolean)
    const last = parts[parts.length - 1] || "dashboard"
    return last.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header
      className="
        flex h-[var(--header-height)] shrink-0 items-center
        border-b bg-background/95 backdrop-blur
        supports-[backdrop-filter]:bg-background/60
        transition ease-linear
        px-6 py-1
      "
    >
      <div className="flex w-full items-center gap-3">

        <SidebarTrigger className="-ml-1" />

        <Separator orientation="vertical" className="h-5 mx-2" />

        <h1 className="text-base font-semibold tracking-tight">{getPageTitle()}</h1>

        <div className="ml-auto flex items-center gap-2">

          <Button
            variant="ghost"
            size="icon"
            title="Actualizar página"
            onClick={() => window.location.reload()}
          >
            <IconRefresh className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            title={`Cambiar a tema ${theme === "dark" ? "claro" : "oscuro"}`}
            onClick={toggleTheme}
          >
            {theme === "dark" ? <IconSun className="h-4 w-4" /> : <IconMoon className="h-4 w-4" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={6} className="rounded-lg min-w-48">
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-2 py-2 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="text-muted-foreground truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <Link href="/admin/account">
                <DropdownMenuItem>
                  <IconUserCircle className="mr-2" />
                  Cuenta
                </DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator />

              <Link href="/admin/logout">
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <IconLogout className="mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}