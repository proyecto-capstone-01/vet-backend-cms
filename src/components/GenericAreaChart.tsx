'use client'

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
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
  data: { date: string; [key: string]: number }[]
  dataKeys: DataKeyConfig[]
}

export function GenericAreaChart({
  title,
  description,
  data,
  dataKeys,
}: GenericAreaChartProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <div>
          <CardTitle>{title}</CardTitle>
          {description && (
            <CardDescription className="text-muted-foreground">
              {description}
            </CardDescription>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={{
            ...Object.fromEntries(
              dataKeys.map((k) => [k.key, { label: k.label, color: k.color }])
            ),
          }}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={data}>
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