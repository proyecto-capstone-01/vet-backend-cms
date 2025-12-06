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
import { Card, CardHeader, CardAction } from '@/components/ui/card'
import type { Appointment, Owner, Product } from '@/payload-types'
import { DateTime } from 'luxon'
import { TZ } from '@/lib/timezone'
import { speciesToSpanish } from '@/app/utils/uiTranslations'

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

export default function AnalyticsClient({
  appointments,
  owners,
  products,
}: {
  appointments: Appointment[]
  owners: Owner[]
  products: Product[]
}) {
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
  const [dateRange, setDateRange] = useState<DateRange>('30')

  useEffect(() => {
    const run = async () => {
      try {
        const filteredAppointments = filterAppointmentsByDateRange(
          appointments,
          parseInt(dateRange),
        )

        const chartData = generateChartData(filteredAppointments, parseInt(dateRange))
        setVentasData(chartData)

        // Total income: sum of service prices for confirmed/completed appointments
        const totalIncomeNumber = computeTotalIncome(filteredAppointments)

        const newClientsThisMonth = owners.filter((client: Owner) => {
          if (!client.createdAt) return false
          const clientDate = DateTime.fromISO(client.createdAt, { zone: TZ })
          const now = DateTime.now().setZone(TZ)
          const monthStart = now.startOf('month')
          return clientDate >= monthStart
        }).length

        setStats({
          totalIncome: `$${totalIncomeNumber.toLocaleString('es-CL')}`,
          newClients: newClientsThisMonth,
          activeAccounts: owners.length,
          growthRate: calculateGrowthRate(filteredAppointments).toFixed(1) + '%',
        })

        const petStats = processPetStats(filteredAppointments)
        setPieChartData(petStats)

        const serviceStats = processServiceStats(filteredAppointments)
        setServiceChartData(serviceStats)

        const productStats = processProductStats(products)
        setProductChartData(productStats)
      } catch (error) {
        console.error('❌ Error preparing analytics data:', error)
      }
    }

    run()
  }, [appointments, owners, products, dateRange])

  return (
    <div className="@container flex flex-col gap-6 p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Ingresos Totales"
          description="Ingresos totales de este período"
          value={stats.totalIncome}
          icon={<IconTrendingUp className="size-4" />}
        />
        <StatCard
          title="Nuevos Clientes"
          description="Clientes durante este período"
          value={stats.newClients.toString()}
          icon={<IconTrendingDown className="size-4" />}
        />
        <StatCard
          title="Cuentas Activas"
          description="Retención total de usuarios"
          value={stats.activeAccounts.toString()}
          icon={<IconTrendingUp className="size-4" />}
        />
        <StatCard
          title="Tasa de Crecimiento"
          description="Crecimiento intermensual"
          value={stats.growthRate}
          icon={<IconTrendingUp className="size-4" />}
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
          showLegend={true}
        />
        <GenericPieChart
          title="Tipos de Servicio"
          description="Servicios más solicitados."
          data={
            serviceChartData.length > 0
              ? serviceChartData
              : [{ name: 'Sin datos', value: 1, fill: 'var(--chart-2)' }]
          }
          showLegend={true}
        />
        <GenericPieChart
          title="Ventas por Categoría"
          description="Distribución de productos."
          data={
            productChartData.length > 0
              ? productChartData
              : [{ name: 'Sin datos', value: 1, fill: 'var(--chart-1)' }]
          }
          showLegend={true}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 @xl:grid-cols-2">
        <GenericAreaChart
          title="Ventas Totales"
          description={`Datos de los últimos ${dateRange} días`}
          // @ts-ignore
          data={ventasData}
          dataKeys={[
            { key: 'online', label: 'Ventas Online', color: 'var(--primary)' },
            { key: 'tienda', label: 'Ventas en Tienda', color: 'var(--chart-2)' },
          ]}
          hideTimeRangeSelector
          showLegend={true}
        />
        <GenericAreaChart
          title="Usuarios Activos"
          description={`Citas por día (últimos ${dateRange} días)`}
          // @ts-ignore
          data={ventasData}
          dataKeys={[
            { key: 'online', label: 'Citas Online', color: 'var(--primary)' },
            { key: 'tienda', label: 'Citas Presenciales', color: 'var(--chart-2)' },
          ]}
          hideTimeRangeSelector
          showLegend={true}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 @xl:grid-cols-2">
        <GenericBarChart
          title="Nuevos Registros (Barras)"
          description={`Nuevos usuarios por canal (últimos ${dateRange} días)`}
          // @ts-ignore
          data={ventasData}
          dataKeys={[{ key: 'tienda', label: 'Registros Tienda', color: 'var(--chart-2)' }]}
          showLegend={true}
        />
        <GenericBarChart
          title="Citas por Canal"
          description={`Distribución de citas (últimos ${dateRange} días)`}
          // @ts-ignore
          data={ventasData}
          dataKeys={[{ key: 'online', label: 'Citas Online', color: 'var(--chart-2)' }]}
          showLegend={true}
        />
      </div>
    </div>
  )
}

function filterAppointmentsByDateRange(appointments: Appointment[], days: number): Appointment[] {
  const now = DateTime.now().setZone(TZ)
  const startDate = now.minus({ days }).startOf('day') // Incluir desde el inicio del día

  return appointments.filter((apt) => {
    if (!apt.date) return false
    const aptDate = DateTime.fromISO(apt.date, { zone: TZ })
    return aptDate >= startDate && aptDate < now.plus({ days: 1 }).startOf('day')
  })
}

function generateChartData(appointments: Appointment[], days: number): ChartDataPoint[] {
  const chartData: ChartDataPoint[] = []
  const now = DateTime.now().setZone(TZ).startOf('day')

  for (let i = days - 1; i >= 0; i--) {
    const date = now.minus({ days: i })
    const dateIso = date.toISO()
    const dateStr = date.toFormat('yyyy-MM-dd')

    const dayAppointments = appointments.filter((apt) => {
      if (!apt.date) return false
      const aptDate = DateTime.fromISO(apt.date, { zone: TZ })
      return aptDate.toFormat('yyyy-MM-dd') === dateStr
    })

    const totalCount = dayAppointments.length
    const online = dayAppointments.filter((apt) => apt.status === 'confirmed').length
    const tienda = dayAppointments.filter((apt) => apt.status === 'completed').length

    chartData.push({
      date: dateIso!,
      online: online > 0 ? online : totalCount,
      tienda: tienda > 0 ? tienda : 0,
    })
  }

  return chartData
}

function processPetStats(appointments: Appointment[]): PetStats[] {
  const stats: Record<string, number> = {}
  const colors = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
  ]

  appointments.forEach((apt) => {
    const pet = apt.pet as any
    // Use correct field per payload-types: species ('dog' | 'cat')
    const rawSpecies = (pet?.species as string) || ''
    const normalized = rawSpecies.toLowerCase()
    const translated = speciesToSpanish[normalized] || 'Otros'
    stats[translated] = (stats[translated] || 0) + 1
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

function processServiceStats(appointments: Appointment[]): PetStats[] {
  const stats: Record<string, number> = {}
  const colors = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
  ]

  appointments.forEach((apt) => {
    const services = apt.services as any[]
    services?.forEach((svc) => {
      // Service interface uses 'title'; fall back to 'name' if older data exists
      const display = (typeof svc === 'object' ? (svc?.title || svc?.name) : undefined) || 'Otros'
      stats[display] = (stats[display] || 0) + 1
    })
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

function processProductStats(products: Product[]): PetStats[] {
  const stats: Record<string, number> = {}
  const colors = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
  ]

  products.forEach((product) => {
    const category = (product as any).category || (product as any).name || 'Sin categoría'
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

function calculateGrowthRate(appointments: Appointment[]): number {
  if (appointments.length === 0) return 0
  const now = DateTime.now().setZone(TZ)
  const midpointDate = now.minus({ days: Math.floor(appointments.length / 2) })

  const firstHalf = appointments.filter((apt) => {
    if (!apt.date) return false
    const aptDate = DateTime.fromISO(apt.date, { zone: TZ })
    return aptDate <= midpointDate
  }).length

  const secondHalf = appointments.filter((apt) => {
    if (!apt.date) return false
    const aptDate = DateTime.fromISO(apt.date, { zone: TZ })
    return aptDate > midpointDate
  }).length

  if (firstHalf === 0) return 0
  return ((secondHalf - firstHalf) / firstHalf) * 100
}

function computeTotalIncome(appointments: Appointment[]): number {
  // Sum prices for appointments with status confirmed or completed
  let total = 0
  for (const apt of appointments) {
    if (apt.status !== 'confirmed' && apt.status !== 'completed') continue
    const services = apt.services as any[]
    for (const svc of services || []) {
      const price = typeof svc === 'object' ? (svc?.price ?? null) : null
      if (typeof price === 'number') {
        total += price
      }
    }
  }
  return total
}
