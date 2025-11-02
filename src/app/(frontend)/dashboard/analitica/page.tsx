"use client"

import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"
import { StatCard } from "@/components/StatCard"
import { GenericPieChart } from "@/components/GenericPieChart"
import { GenericAreaChart } from "@/components/GenericAreaChart"
import { GenericBarChart } from "@/components/GenericBarChart"

// === Datos simulados ===

// Cards
const totalAgendas = "145"
const tasaCancelacion = "7.3%"
const mascotasRegistradas = "342"

// Tortas
const serviciosMasSolicitados = [
  { name: "Consulta", value: 120, fill: "var(--chart-1)" },
  { name: "Vacunación", value: 80, fill: "var(--chart-2)" },
  { name: "Desparasitación", value: 50, fill: "var(--chart-3)" },
  { name: "Peluquería", value: 40, fill: "var(--chart-4)" },
]

const perrosVsGatos = [
  { name: "Perros", value: 220, fill: "var(--chart-1)" },
  { name: "Gatos", value: 122, fill: "var(--chart-2)" },
]

const serviciosEntregados = [
  { name: "Vacunación", value: 150, fill: "var(--chart-3)" },
  { name: "Cirugías", value: 50, fill: "var(--chart-4)" },
  { name: "Controles", value: 100, fill: "var(--chart-5)" },
]

// Líneas (Ingresos y Citas)
const ingresosMensuales = [
  { date: "2024-01-01", ingresos: 500 },
  { date: "2024-02-01", ingresos: 700 },
  { date: "2024-03-01", ingresos: 800 },
  { date: "2024-04-01", ingresos: 1000 },
  { date: "2024-05-01", ingresos: 1200 },
  { date: "2024-06-01", ingresos: 1800 },
  { date: "2024-07-01", ingresos: 1400 },
  { date: "2024-08-01", ingresos: 2000 },
  { date: "2024-09-01", ingresos: 2200 },
  { date: "2024-10-01", ingresos: 1950 },
  { date: "2024-11-01", ingresos: 2500 },
  { date: "2024-12-01", ingresos: 3000 },
]

const citasAgVsAt = [
  { date: "2024-05-01", agendadas: 150, atendidas: 140 },
  { date: "2024-06-01", agendadas: 170, atendidas: 165 },
  { date: "2024-07-01", agendadas: 160, atendidas: 150 },
  { date: "2024-08-01", agendadas: 190, atendidas: 185 },
  { date: "2024-09-01", agendadas: 210, atendidas: 205 },
  { date: "2024-10-01", agendadas: 230, atendidas: 220 },
]

// Barras (Día y Personal)
const atencionesPorDia = [
  { date: "Lunes", atenciones: 25 },
  { date: "Martes", atenciones: 30 },
  { date: "Miércoles", atenciones: 28 },
  { date: "Jueves", atenciones: 35 },
  { date: "Viernes", atenciones: 40 },
]

const horasPersonal = [
  { date: "Dr. Pérez", horas: 140 },
  { date: "Dra. Soto", horas: 155 },
  { date: "Dr. Ruiz", horas: 130 },
  { date: "Asistente Ana", horas: 160 },
]

export default function AnaliticaPage() {
  return (
    <div className="@container flex flex-col gap-6 p-6">
      {/* === Tarjetas === */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total Agendas Mensual"
          description="Cantidad total de citas este mes"
          value={totalAgendas}
          trend="up"
          percent="5%"
          icon={<IconTrendingUp className="size-4" />}
          footerMain="Agendas en aumento"
          footerSub="Respecto al mes anterior"
        />
        <StatCard
          title="Tasa de Cancelación"
          description="Promedio mensual de cancelaciones"
          value={tasaCancelacion}
          trend="down"
          percent="2%"
          icon={<IconTrendingDown className="size-4" />}
          footerMain="Cancelaciones estables"
          footerSub="Buen nivel de asistencia"
        />
        <StatCard
          title="Mascotas Registradas"
          description="Total de mascotas activas en el sistema"
          value={mascotasRegistradas}
          trend="up"
          percent="10%"
          icon={<IconTrendingUp className="size-4" />}
          footerMain="Clientes recurrentes en alza"
          footerSub="Aumento mensual positivo"
        />
      </div>

      {/* === Gráficos de torta === */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <GenericPieChart
          title="Servicios Más Solicitados"
          description="Proporción de servicios demandados."
          data={serviciosMasSolicitados}
        />
        <GenericPieChart
          title="Perros vs Gatos"
          description="Cantidad registrada por especie."
          data={perrosVsGatos}
        />
        <GenericPieChart
          title="Servicios Entregados"
          description="Distribución general de servicios."
          data={serviciosEntregados}
        />
      </div>

      {/* === Gráficos de líneas === */}
      <div className="grid grid-cols-1 gap-6 @xl:grid-cols-2">
        <GenericAreaChart
          title="Ingresos Totales Mensual"
          description="Evolución de ingresos últimos 6 meses"
          data={ingresosMensuales}
          dataKeys={[
            { key: "ingresos", label: "Ingresos", color: "var(--chart-1)" },
          ]}
        />
        <GenericAreaChart
          title="Citas Agendadas vs Atendidas"
          description="Comparación mensual de atención efectiva"
          data={citasAgVsAt}
          dataKeys={[
            { key: "agendadas", label: "Agendadas", color: "var(--chart-2)" },
            { key: "atendidas", label: "Atendidas", color: "var(--chart-3)" },
          ]}
        />
      </div>

      {/* === Gráficos de barras === */}
      <div className="grid grid-cols-1 gap-6 @xl:grid-cols-2">
        <GenericBarChart
          title="Atenciones por Día de Semana"
          description="Distribución de atención semanal"
          data={atencionesPorDia}
          dataKeys={[
            { key: "atenciones", label: "Atenciones", color: "var(--chart-4)" },
          ]}
        />
        <GenericBarChart
          title="Horas Trabajadas del Personal"
          description="Tiempo total trabajado por persona"
          data={horasPersonal}
          dataKeys={[
            { key: "horas", label: "Horas", color: "var(--chart-5)" },
          ]}
        />
      </div>
    </div>
  )
}