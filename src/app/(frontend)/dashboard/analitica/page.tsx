"use client"

import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"
import { StatCard } from "@/components/StatCard"
import { GenericAreaChart } from "@/components/GenericAreaChart"

const ventasData = [
  { date: "2024-04-01", online: 200, tienda: 150 },
  { date: "2024-04-02", online: 180, tienda: 190 },
  { date: "2024-04-03", online: 220, tienda: 210 },
  { date: "2024-04-04", online: 250, tienda: 180 },
  { date: "2024-04-05", online: 230, tienda: 200 },
]

const data = [
  { name: "Consulta General", value: 30 },
  { name: "Vacunación", value: 25 },
  { name: "Baño", value: 20 },
  { name: "Corte de Pelo", value: 15 },
  { name: "Desparasitación", value: 10 },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8">
      
      {/* === Tarjetas de estadísticas === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          description="Total Revenue"
          value="$1,250.00"
          trend="up"
          percent="12.5%"
          icon={<IconTrendingUp className="size-4" />}
          footerMain="Trending up this month"
          footerSub="Visitors for the last 6 months"
        />
        <StatCard
          title="New Customers"
          description="New Customers"
          value="1,234"
          trend="down"
          percent="20%"
          icon={<IconTrendingDown className="size-4" />}
          footerMain="Down 20% this period"
          footerSub="Acquisition needs attention"
        />
        <StatCard
          title="Active Accounts"
          description="Active Accounts"
          value="45,678"
          trend="up"
          percent="12.5%"
          icon={<IconTrendingUp className="size-4" />}
          footerMain="Strong user retention"
          footerSub="Engagement exceeds targets"
        />
        <StatCard
          title="Growth Rate"
          description="Growth Rate"
          value="4.5%"
          trend="up"
          percent="4.5%"
          icon={<IconTrendingUp className="size-4" />}
          footerMain="Steady performance increase"
          footerSub="Meets growth projections"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      </div>

      {/* === Gráficos === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GenericAreaChart
          title="Ventas Totales"
          description="Datos combinados de los últimos 3 meses"
          data={ventasData}
          dataKeys={[
            { key: "online", label: "Ventas Online", color: "var(--primary)" },
            { key: "tienda", label: "Ventas en Tienda", color: "#10b981" },
          ]}
        />

        <GenericAreaChart
          title="Usuarios Activos"
          description="Usuarios únicos por día"
          data={ventasData}
          dataKeys={[
            { key: "online", label: "Usuarios App", color: "#6366f1" },
            { key: "tienda", label: "Usuarios Web", color: "#f97316" },
          ]}
        />

        <GenericAreaChart
          title="Ingresos Mensuales"
          description="Tendencia de ingresos"
          data={ventasData}
          dataKeys={[
            { key: "online", label: "Ingresos Online", color: "#14b8a6" },
            { key: "tienda", label: "Ingresos Tienda", color: "#22c55e" },
          ]}
        />
      </div>
    </div>
  )
}