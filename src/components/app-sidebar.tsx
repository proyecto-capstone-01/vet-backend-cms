"use client"

import * as React from "react"
import {
  IconHome,
  IconClock,
  IconClipboardList,
  IconUsers,
  IconDog,
  IconPackage,
  IconFileText,
  IconDatabase,
  IconFiles,
  IconFileWord,
  IconListDetails,
  IconHelpCircle,
  IconBook,
} from "@tabler/icons-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { NavMain } from "@/components/nav-main"
import { NavDocuments } from "@/components/nav-documents"

const data = {
  navMain: [
    {
      title: "Home",
      icon: IconHome,
      url: "/dashboard",
      items: [
        { title: "Gráficos", url: "/dashboard/graficos" },
        { title: "Resumen de Toma de Horas del Día", url: "/dashboard/resumen-horas" },
        { title: "Confirmación de Horas", url: "/dashboard/confirmacion-horas" },
      ],
    },
    {
      title: "Analítica",
      icon: IconClipboardList,
      url: "/dashboard/analitica",
      items: [
        { title: "Análisis de Visitas", url: "/dashboard/analitica/visitas" },
        { title: "Análisis de Servicios", url: "/dashboard/analitica/servicios" },
      ],
    },
    {
      title: "Clientes",
      icon: IconUsers,
      url: "/dashboard/clientes",
      items: [
        { title: "Listado de Clientes", url: "/dashboard/clientes" },
        { title: "Listado de Mascotas por Cliente", url: "/dashboard/clientes/mascotas" },
      ],
    },
    {
      title: "Mascotas",
      icon: IconDog,
      url: "/dashboard/mascotas",
      items: [
        { title: "Listado de Mascotas", url: "/dashboard/mascotas" },
        { title: "Fichas de Cada Mascota", url: "/dashboard/mascotas/fichas" },
      ],
    },
    {
      title: "Inventario",
      icon: IconPackage,
      url: "/dashboard/inventario",
      items: [{ title: "Tabla con Productos", url: "/dashboard/inventario" }],
    },
    {
      title: "Horas",
      icon: IconClock,
      url: "/dashboard/horas",
      items: [
        { title: "Calendario con Horas", url: "/dashboard/horas" },
        { title: "Seleccionar Horas para Desplegar", url: "/dashboard/horas/seleccionar" },
      ],
    },
    {
      title: "Crear Receta",
      icon: IconFileText,
      url: "/dashboard/recetas",
      items: [{ title: "Formulario de Creación", url: "/dashboard/recetas/nueva" }],
    },
  ],

  documents: [
    {
      name: "Ir al CMS",
      url: "/admin",
      icon: IconDatabase,
      className:
        "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear",
      external: true,
    },
    {
      name: "Contenido Multimedia",
      url: "/admin/media",
      icon: IconFiles,
    },
    {
      name: "Publicaciones del Blog",
      url: "/admin/blogpost",
      icon: IconFileWord,
    },
    {
      name: "Productos",
      url: "/admin/collection/product",
      icon: IconListDetails,
    },
    {
      name: "Profesionales",
      url: "/admin/collection/professional",
      icon: IconUsers,
    },
    {
      name: "Preguntas Frecuentes",
      url: "/admin/collection/faq",
      icon: IconHelpCircle,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* HEADER */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="/dashboard">
                <span className="text-base font-semibold">Clínica Pucará</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* CONTENIDO */}
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
      </SidebarContent>

      {/* FOOTER - Botón Manual de Usuario */}
      <SidebarFooter className="mt-auto border-t border-border pt-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a
                href="/dashboard/manual-usuario"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <IconBook className="size-4" />
                Manual de Usuario
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}