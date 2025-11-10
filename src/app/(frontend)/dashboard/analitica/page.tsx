'use client'

import { useEffect, useState } from 'react'
import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react'
import { StatCard } from '@/components/StatCard'
import { GenericAreaChart } from '@/components/GenericAreaChart'
import { GenericPieChart } from '@/components/GenericPieChart'
import { GenericBarChart } from '@/components/GenericBarChart'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useIsMobile } from '@/hooks/use-mobile'
import { Card, CardHeader, CardAction } from '@/components/ui/card'

interface ChartDataPoint {
  date: string
  online: number
  tienda: number
}

interface PetStats {
  name: string
  value: number
  fill: string
}

type DateRange = '7' | '30' | '90'

export default function DashboardPage() {
  const isMobile = useIsMobile()
  const [ventasData, setVentasData] = useState<ChartDataPoint[]>([])
  const [stats, setStats] = useState({
    totalIncome: '$0.00',
    newClients: 0,
    activeAccounts: 0,
    growthRate: '0%',
  })
  const [pieChartData, setPieChartData] = useState<PetStats[]>([])
  const [serviceChartData, setServiceChartData] = useState<PetStats[]>([])
  const [productChartData, setProductChartData] = useState<PetStats[]>([])
  const [loading, setLoading] = useState(true)
  const [debug, setDebug] = useState<any>(null)
  const [dateRange, setDateRange] = useState<DateRange>('30')

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true)

        const appointmentsRes = await fetch('/api/appointments?limit=1000&sort=-fecha')
        const appointmentsData = await appointmentsRes.json()
        const appointments = appointmentsData.docs || []

        const clientsRes = await fetch('/api/owners?limit=1000')
        const clientsData = await clientsRes.json()
        const clients = clientsData.docs || []

        const productsRes = await fetch('/api/products?limit=1000')
        const productsData = await productsRes.json()
        const products = productsData.docs || []

        const filteredAppointments = filterAppointmentsByDateRange(
          appointments,
          parseInt(dateRange),
        )

        const chartData = generateChartData(filteredAppointments, parseInt(dateRange))
        setVentasData(chartData)

        const totalIncome = filteredAppointments
          .filter((apt: any) => apt.estado === 'Completado')
          .reduce((sum: number, apt: any) => sum + (apt.total || 0), 0)

        const newClientsThisMonth = clients.filter((client: any) => {
          if (!client.createdAt) return false
          const clientDate = new Date(client.createdAt)
          const now = new Date()
          const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1)
          return clientDate >= monthAgo
        }).length

        setStats({
          totalIncome: `$${totalIncome.toLocaleString('es-CL')}`,
          newClients: newClientsThisMonth,
          activeAccounts: clients.length,
          growthRate: calculateGrowthRate(filteredAppointments).toFixed(1) + '%',
        })

        const petStats = processPetStats(filteredAppointments)
        setPieChartData(petStats)

        const serviceStats = processServiceStats(filteredAppointments)
        setServiceChartData(serviceStats)

        const productStats = processProductStats(products)
        setProductChartData(productStats)

        setDebug({
          appointmentsCount: filteredAppointments.length,
          clientsCount: clients.length,
          productsCount: products.length,
          petStats,
          serviceStats,
          productStats,
          dateRange,
        })
      } catch (error) {
        console.error('❌ Error fetching analytics data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [dateRange])

  return (
    <div className="@container flex flex-col gap-6 p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Ingresos Totales"
          description="Ingresos totales de este período"
          value={stats.totalIncome}
          trend="up"
          percent="12.5%"
          icon={<IconTrendingUp className="size-4" />}
          footerMain="Trending up this month"
          footerSub="Ingresos de servicios completados"
        />
        <StatCard
          title="Nuevos Clientes"
          description="Clientes durante este período"
          value={stats.newClients.toString()}
          trend="down"
          percent="20%"
          icon={<IconTrendingDown className="size-4" />}
          footerMain="Este mes"
          footerSub="Clientes nuevos registrados"
        />
        <StatCard
          title="Cuentas Activas"
          description="Retención total de usuarios"
          value={stats.activeAccounts.toString()}
          trend="up"
          percent="12.5%"
          icon={<IconTrendingUp className="size-4" />}
          footerMain="Total de clientes"
          footerSub="Clientes en el sistema"
        />
        <StatCard
          title="Tasa de Crecimiento"
          description="Crecimiento intermensual"
          value={stats.growthRate}
          trend="up"
          percent="4.5%"
          icon={<IconTrendingUp className="size-4" />}
          footerMain="Steady performance increase"
          footerSub="Basado en citas completadas"
        />
      </div>

      <Card className="@container/card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <span className="font-semibold text-sm self-center">Período:</span>

            <CardAction className="mt-3 sm:mt-0">
              <ToggleGroup
                type="single"
                value={dateRange}
                onValueChange={(value) => value && setDateRange(value as DateRange)}
                variant="outline"
                className="hidden @[767px]/card:flex"
              >
                <ToggleGroupItem value="7">7 Días</ToggleGroupItem>
                <ToggleGroupItem value="30">30 Días</ToggleGroupItem>
                <ToggleGroupItem value="90">3 Meses</ToggleGroupItem>
              </ToggleGroup>

              <Select value={dateRange} onValueChange={(value) => setDateRange(value as DateRange)}>
                <SelectTrigger className="w-40 @[767px]/card:hidden" size="sm">
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="7">7 Días</SelectItem>
                  <SelectItem value="30">30 Días</SelectItem>
                  <SelectItem value="90">3 Meses</SelectItem>
                </SelectContent>
              </Select>
            </CardAction>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <GenericPieChart
          title="Visitas por Mascota"
          description="Distribución por tipo de mascota."
          data={
            pieChartData.length > 0
              ? pieChartData
              : [{ name: 'Sin datos', value: 1, fill: 'var(--chart-1)' }]
          }
        />
        <GenericPieChart
          title="Tipos de Servicio"
          description="Servicios más solicitados."
          data={
            serviceChartData.length > 0
              ? serviceChartData
              : [{ name: 'Sin datos', value: 1, fill: 'var(--chart-2)' }]
          }
        />
        <GenericPieChart
          title="Ventas por Categoría"
          description="Distribución de productos."
          data={
            productChartData.length > 0
              ? productChartData
              : [{ name: 'Sin datos', value: 1, fill: 'var(--chart-1)' }]
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-6 @xl:grid-cols-2">
        <GenericAreaChart
          title="Ventas Totales"
          description={`Datos de los últimos ${dateRange} días`}
          //@ts-ignore
          data={ventasData}
          dataKeys={[
            { key: 'online', label: 'Ventas Online', color: 'var(--primary)' },
            { key: 'tienda', label: 'Ventas en Tienda', color: 'var(--chart-2)' },
          ]}
          hideTimeRangeSelector
        />
        <GenericAreaChart
          title="Usuarios Activos"
          description={`Citas por día (últimos ${dateRange} días)`}
          //@ts-ignore
          data={ventasData}
          dataKeys={[
            { key: 'online', label: 'Citas Online', color: 'var(--chart-3)' },
            { key: 'tienda', label: 'Citas Presenciales', color: 'var(--chart-5)' },
          ]}
          hideTimeRangeSelector
        />
      </div>

      <div className="grid grid-cols-1 gap-6 @xl:grid-cols-2">
        <GenericBarChart
          title="Nuevos Registros (Barras)"
          description="Nuevos usuarios por canal"
          //@ts-ignore
          data={ventasData}
          dataKeys={[{ key: 'tienda', label: 'Registros Tienda', color: 'var(--chart-5)' }]}
        />
        <GenericBarChart
          title="Citas por Canal"
          description="Distribución de citas"
          //@ts-ignore
          data={ventasData}
          dataKeys={[{ key: 'online', label: 'Citas Online', color: 'var(--chart-3)' }]}
        />
      </div>
    </div>
  )
}

function filterAppointmentsByDateRange(appointments: any[], days: number): any[] {
  const now = new Date()
  const startDate = new Date(now)
  startDate.setDate(startDate.getDate() - days)

  return appointments.filter((apt: any) => {
    if (!apt.fecha) return false
    const aptDate = new Date(apt.fecha)
    return aptDate >= startDate && aptDate <= now
  })
}

function generateChartData(appointments: any[], days: number): ChartDataPoint[] {
  const chartData: ChartDataPoint[] = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]

    const dayAppointments = appointments.filter((apt: any) => {
      if (!apt.fecha) return false
      const aptDate = new Date(apt.fecha)
      return aptDate.toISOString().split('T')[0] === dateStr
    })

    chartData.push({
      date: dateStr,
      online: Math.floor(dayAppointments.length * 0.6),
      tienda: Math.floor(dayAppointments.length * 0.4),
    })
  }

  return chartData
}

function processPetStats(appointments: any[]): PetStats[] {
  const stats: Record<string, number> = {}
  const colors = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
  ]

  appointments.forEach((apt: any) => {
    if (!apt.tipo) return
    const petType = apt.tipo.trim() || 'Otros'
    stats[petType] = (stats[petType] || 0) + 1
  })

  if (Object.keys(stats).length === 0) {
    return []
  }

  return Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], index) => ({
      name,
      value,
      fill: colors[index % colors.length],
    }))
}

function processServiceStats(appointments: any[]): PetStats[] {
  const stats: Record<string, number> = {}
  const colors = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
  ]

  appointments.forEach((apt: any) => {
    if (!apt.servicio) return
    const serviceName = apt.servicio.trim() || 'Otros'
    stats[serviceName] = (stats[serviceName] || 0) + 1
  })

  if (Object.keys(stats).length === 0) {
    return []
  }

  return Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], index) => ({
      name,
      value,
      fill: colors[index % colors.length],
    }))
}

function processProductStats(products: any[]): PetStats[] {
  const stats: Record<string, number> = {}
  const colors = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
  ]

  products.forEach((product: any) => {
    const category = product.category || product.name || 'Sin categoría'
    stats[category] = (stats[category] || 0) + 1
  })

  if (Object.keys(stats).length === 0) {
    return []
  }

  return Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], index) => ({
      name,
      value,
      fill: colors[index % colors.length],
    }))
}

function calculateGrowthRate(appointments: any[]): number {
  const now = new Date()
  const midpoint = new Date(now)
  midpoint.setDate(midpoint.getDate() - Math.floor(appointments.length / 2))

  const firstHalf = appointments.filter((apt: any) => {
    if (!apt.fecha) return false
    const aptDate = new Date(apt.fecha)
    return aptDate <= midpoint
  }).length

  const secondHalf = appointments.filter((apt: any) => {
    if (!apt.fecha) return false
    const aptDate = new Date(apt.fecha)
    return aptDate > midpoint
  }).length

  if (firstHalf === 0) return 0
  return ((secondHalf - firstHalf) / firstHalf) * 100
}