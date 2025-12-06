'use client'

/// <reference types="react" />

import * as React from "react"
// Se cambian las importaciones de recharts por BarChart
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  ToggleGroup,
} from "@/components/ui/toggle-group"
import { useIsMobile } from "@/hooks/use-mobile"

// Se mantiene la declaración global para los gradientes
declare global {
  namespace JSX {
    interface IntrinsicElements {
      linearGradient: React.SVGProps<SVGLinearGradientElement>
      stop: React.SVGProps<SVGStopElement>
    }
  }
}

interface DataKeyConfig {
  key: string
  label: string
  color: string
}

// Se renombra la interfaz de Props
interface GenericBarChartProps {
  title: string
  description?: string
  data: { // @ts-ignore
    date: string; [key: string]: number }[]
  dataKeys: DataKeyConfig[]
  showLegend?: boolean
  hideTimeRangeSelector?: boolean
}

// Se renombra el componente
export function GenericBarChart({
  title,
  description,
  data,
  dataKeys,
  showLegend = true,
  hideTimeRangeSelector = false,
}: GenericBarChartProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) setTimeRange("7d")
  }, [isMobile])

  // Toda la lógica de filtrado de datos se mantiene igual
  const referenceDate = new Date(data[data.length - 1]?.date || new Date())
  const filteredData = data.filter((item) => {
    const date = new Date(item.date)
    let days = 90
    if (timeRange === "30d") days = 30
    if (timeRange === "7d") days = 7
    const start = new Date(referenceDate)
    start.setDate(referenceDate.getDate() - days)
    return date >= start
  })

  return (
    <Card className="@container/card">
      {/* El CardHeader con filtros se mantiene idéntico */}
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && (
              <CardDescription className="text-muted-foreground">
                {description}
              </CardDescription>
            )}
          </div>
          {!hideTimeRangeSelector && (
            <CardAction className="mt-3 sm:mt-0">
              <ToggleGroup
                type="single"
                value={timeRange}
                onValueChange={setTimeRange}
                variant="outline"
                className="hidden @[767px]/card:flex"
              >
              </ToggleGroup>
            </CardAction>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={{
            // La configuración del ChartContainer se mantiene
            ...Object.fromEntries(
              dataKeys.map((k) => [k.key, { label: k.label, color: k.color }])
            ),
          }}
          className="aspect-auto h-[250px] w-full"
        >
          {/* 1. Se cambia AreaChart por BarChart */}
          <BarChart data={filteredData}>
            {/* 2. Mantenemos los <defs> para los gradientes en las barras */}
            <defs>
              {dataKeys.map((key) => (
                <linearGradient
                  key={key.key}
                  id={`fill-${key.key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={key.color} stopOpacity={0.9} />
                  <stop offset="95%" stopColor={key.color} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(v) =>
                new Date(v).toLocaleDateString("es-CL", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            {/* 3. Se añade un YAxis para el gráfico de barras */}
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={32}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(v) =>
                    new Date(v).toLocaleDateString("es-CL", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />

            {showLegend && (
              <ChartLegend content={<ChartLegendContent />} />
            )}

            {dataKeys.map((key) => (
              <Bar
                key={key.key}
                dataKey={key.key}
                fill={key.color}
                stackId="a"
                label={{
                  position: 'insideTopRight',
                  fill: '#ffffff',
                  fontSize: 15,
                  fontWeight: '600',
                  offset: 8,
                  formatter: (value: number) => value > 0 ? value : '',
                }}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}