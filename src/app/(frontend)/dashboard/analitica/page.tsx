"use client"

import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"
import { StatCard } from "@/components/StatCard"
import { GenericAreaChart } from "@/components/GenericAreaChart"
import { GenericPieChart } from "@/components/GenericPieChart"
// 1. IMPORTACIÓN AÑADIDA
import { GenericBarChart } from "@/components/GenericBarChart"

// Datos para los gráficos de área (y ahora barras)
const ventasData = [
  { date: "2024-04-01", online: 200, tienda: 150 },
  { date: "2024-04-02", online: 180, tienda: 190 },
  { date: "2024-04-03", online: 220, tienda: 210 },
  { date: "2024-04-04", online: 250, tienda: 180 },
  { date: "2024-04-05", online: 230, tienda: 200 },
  // ... más datos (idealmente 90 días para que los filtros funcionen)
]

// Datos para los gráficos de pastel
const pieChartData = [
  { name: "Perros", value: 400, fill: "var(--chart-1)" },
  { name: "Gatos", value: 300, fill: "var(--chart-2)" },
  { name: "Otros", value: 100, fill: "var(--chart-4)" },
]

export default function DashboardPage() {
  return (
    // @container activa las container queries.
    // Los prefijos como "@lg:" ahora reaccionan al tamaño de este div.
    <div className="@container flex flex-col gap-6 p-6">
      
      {/* === Tarjetas de estadísticas === */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Ingresos Totales"
          description="Ingresos totales de este mes"
          value="$1,250.00"
          trend="up"
          percent="12.5%"
          icon={<IconTrendingUp className="size-4" />}
          footerMain="Trending up this month"
          footerSub="Visitors for the last 6 months"
        />
        <StatCard
          title="Nuevos Clientes"
          description="Clientes durante este período"
          value="1,234"
          trend="down"
          percent="20%"
          icon={<IconTrendingDown className="size-4" />}
          footerMain="Down 20% this period"
          footerSub="Acquisition needs attention"
        />
        <StatCard
          title="Cuentas Activas"
          description="Retención total de usuarios"
          value="45,678"
          trend="up"
          percent="12.5%"
          icon={<IconTrendingUp className="size-4" />}
          footerMain="Strong user retention"
          footerSub="Engagement exceeds targets"
        />
        <StatCard
          title="Tasa de Crecimiento"
          description="Crecimiento intermensual"
          value="4.5%"
          trend="up"
          percent="4.5%"
          icon={<IconTrendingUp className="size-4" />}
          footerMain="Steady performance increase"
          footerSub="Meets growth projections"
        />
      </div>

      {/* === Gráficos de Pastel === */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <GenericPieChart
          title="Visitas por Mascota"
          description="Distribución por tipo de mascota."
          data={pieChartData}
        />
        <GenericPieChart
          title="Tipos de Servicio"
          description="Servicios más solicitados."
          data={[ // Datos de ejemplo
            { name: "Consulta", value: 300, fill: "var(--chart-1)" },
            { name: "Vacunación", value: 250, fill: "var(--chart-2)" },
            { name: "Peluquería", value: 450, fill: "var(--chart-3)" },
          ]}
        />
        <GenericPieChart
          title="Ventas por Categoría"
          description="Distribución de productos."
          data={[ // Datos de ejemplo
            { name: "Alimento", value: 600, fill: "var(--chart-5)" },
            { name: "Juguetes", value: 150, fill: "var(--chart-3)" },
            { name: "Medicina", value: 250, fill: "var(--chart-1)" },
          ]}
        />
      </div>

      {/* === Gráficos de Área === */}
      <div className="grid grid-cols-1 gap-6 @xl:grid-cols-2">
        <GenericAreaChart
          title="Ventas Totales"
          description="Datos combinados de los últimos 3 meses"
          data={ventasData}
          dataKeys={[
            { key: "online", label: "Ventas Online", color: "var(--primary)" },
            { key: "tienda", label: "Ventas en Tienda", color: "var(--chart-2)" },
          ]}
        />
        <GenericAreaChart
          title="Usuarios Activos"
          description="Usuarios únicos por día"
          data={ventasData}
          dataKeys={[
            { key: "online", label: "Usuarios App", color: "var(--chart-3)" },
            { key: "tienda", label: "Usuarios Web", color: "var(--chart-5)" },
          ]}
        />
      </div>

      {/* 2. SECCIÓN DE GRÁFICO DE BARRAS AÑADIDA */}
      <div className="grid grid-cols-1 gap-6 @xl:grid-cols-2">
                <GenericBarChart
          title="Nuevos Registros (Barras)"
          description="Nuevos usuarios por canal"
          data={ventasData}
          dataKeys={[
            { key: "tienda", label: "Registros Tienda", color: "var(--chart-5)" },
          ]}
        />
        <GenericBarChart
          title="Nuevos Registros (Barras)"
          description="Nuevos usuarios por canal"
          data={ventasData}
          dataKeys={[
            { key: "tienda", label: "Registros Tienda", color: "var(--chart-5)" },
          ]}
        />
        {/* Puedes añadir otro gráfico de barras aquí */}
      </div>

    </div>
  )
}