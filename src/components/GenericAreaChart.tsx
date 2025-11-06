'use client'

/// <reference types="react" />

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { useIsMobile } from "@/hooks/use-mobile"

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

interface GenericAreaChartProps {
  title: string
  description?: string
  data: { // @ts-ignore
    date: string; [key: string]: number }[]
  dataKeys: DataKeyConfig[]
}

export function GenericAreaChart({
  title,
  description,
  data,
  dataKeys,
}: GenericAreaChartProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) setTimeRange("7d")
  }, [isMobile])

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
          <CardAction className="mt-3 sm:mt-0">
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={setTimeRange}
              variant="outline"
              className="hidden @[767px]/card:flex"
            >
              <ToggleGroupItem value="90d">3 meses</ToggleGroupItem>
              <ToggleGroupItem value="30d">30 días</ToggleGroupItem>
              <ToggleGroupItem value="7d">7 días</ToggleGroupItem>
            </ToggleGroup>

            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 @[767px]/card:hidden" size="sm">
                <SelectValue placeholder="3 meses" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="90d">3 meses</SelectItem>
                <SelectItem value="30d">30 días</SelectItem>
                <SelectItem value="7d">7 días</SelectItem>
              </SelectContent>
            </Select>
          </CardAction>
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={{
            visitors: { label: title },
            ...Object.fromEntries(
              dataKeys.map((k) => [k.key, { label: k.label, color: k.color }])
            ),
          }}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
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

            {dataKeys.map((key) => (
              <Area
                key={key.key}
                dataKey={key.key}
                type="natural"
                fill={`url(#fill-${key.key})`}
                stroke={key.color}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}