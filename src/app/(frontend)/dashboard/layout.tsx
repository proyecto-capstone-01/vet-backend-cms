import React from "react"
import { headers as getHeaders } from "next/headers"
import { redirect } from "next/navigation"
import { getPayload } from "payload"
import config from "@payload-config"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Autenticación
  const headers = await getHeaders()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })
  const roles = user?.roles || []
  const isAuthorized = roles.includes("admin") || roles.includes("dashboard")

  if (!isAuthorized) {
    redirect("/unauthorized")
  } else if (!user) {
    redirect("/login")
  }

  const userProp = {
    name: user.firstName + " " + user.lastName,
    email: user.email,
    // @ts-ignore
    avatarUrl: user.profileImage?.sizes?.square?.url.toString(),
  }

  return (
    <SidebarProvider
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader user={userProp} />
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
